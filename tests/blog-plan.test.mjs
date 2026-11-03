// BLOG-PLAN.md's open topics feed the scheduled post lanes (company/blog-workflow.md). A topic that reuses a post's
// `keyword:` would fail tests/posts.test.mjs only after the post is written, so this catches it while the topic is
// still a plan. A /tools/ link that is dead or hidden fails here too, in a post or an open topic: seo-check skips
// /tools/, and a dead link in a topic gets copied into its post. The catalogue is a sibling repo, so without a
// checkout that test skips and says why. A topic's target is the first keyword on its line; the others are context.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { isInternal, links, parsePost, root, siteOf } from './helpers.mjs';

const POSTS = join(root, 'source/_posts');
const TOOLS = join(root, '..', 'buffermint-tools');
// From this topic on, each has the full field set and its evidence in an appendix (Appendix C, and later top-ups').
const FULL_FIELDS_FROM = 33;

function parseTopics(plan) {
  const body = plan.split(/^## Old posts/m)[0];
  return body.split(/^### /m).slice(1).flatMap((text) => {
    const section = text.split(/^## /m)[0];
    const head = section.match(/^(\d+)\.\s/);
    if (!head) return [];
    const field = (name) => section.match(new RegExp(`^- \\*\\*${name}:\\*\\*(.*)$`, 'm'))?.[1] ?? '';
    return [{
      number: Number(head[1]),
      section,
      field,
      keyword: field('Keyword').match(/`([^`]+)`/)?.[1].toLowerCase(),
      status: field('Status').trim().split(/\s/)[0],
    }];
  });
}

const isOpen = ({ status }) => status === 'todo' || status === 'writing';

// Counted as tests/posts.test.mjs counts a post's Sources, so a topic that passes here can pass there
const sourceSites = (text) => new Set([...text.matchAll(/https?:\/\/[^\s),]+/g)].map((m) => siteOf(m[0])).filter(Boolean));

// What build.mjs reads: src/<category>/_tools.json, minus internal workflow steps, which have no page of their own.
// A row's page is built from its fragment, src/<engine>.html (engine defaults to <category>/<slug>); a row with no
// fragment is skipped by the build, so it has no page. Throws when anything is missing or has changed shape, so a
// broken checkout never reads as dead links.
function readCatalogue(toolsDir) {
  const read = (file) => JSON.parse(readFileSync(join(toolsDir, file), 'utf8'));
  const categories = new Map();
  const unbuilt = new Set();
  for (const dir of readdirSync(join(toolsDir, 'src')).filter((d) => existsSync(join(toolsDir, 'src', d, '_tools.json')))) {
    const tools = read(`src/${dir}/_tools.json`);
    if (!Array.isArray(tools) || !tools.every((tool) => tool.slug)) throw new Error(`unexpected shape in src/${dir}/_tools.json`);
    const listed = tools.filter((tool) => !tool.internal);
    categories.set(dir, new Set(listed.map((tool) => tool.slug)));
    for (const tool of listed) if (!existsSync(join(toolsDir, 'src', `${tool.engine || `${dir}/${tool.slug}`}.html`))) unbuilt.add(`${dir}/${tool.slug}`);
  }
  const { tools: hidden } = read('src/hidden.json');
  const workflows = read('src/recipes-live.json');
  if (!categories.size || !Array.isArray(hidden) || !Array.isArray(workflows)) throw new Error('unexpected shape');
  return { categories, unbuilt, hidden: new Set(hidden), workflows: new Set(workflows) };
}

// A site path's segments under /tools/, or null. A trailing slash or full stop drops; an empty segment in the middle
// stays as '' so /tools/pdf//gone/ reads as malformed, not as /tools/pdf/.
function toolPath(sitePath) {
  if (!sitePath.startsWith('/tools/')) return null;
  const segments = sitePath.slice('/tools/'.length).replace(/\.+$/, '').split('/');
  if (segments.at(-1) === '') segments.pop();
  return segments;
}

// The path of an internal link (site-relative or on buffermint.com, any case, any port), without query or fragment
const sitePathOf = (url) => {
  try { return new URL(url, 'https://buffermint.com').pathname; } catch { return ''; }
};

// Written paths, site-relative or on buffermint.com in any case and with a port (/assets/tools/, ~/tools/, ?u=/tools/ and example.com/tools/
// don't count), plus every internal link the shared links() reads (unquoted href, an all-caps host, :443). A
// sentence's full stop is not part of the path. Each path once, as segments.
function toolLinks(text) {
  const written = [...text.matchAll(/(?:(?<![\w.-])(?:[Ww]{3}\.)?[Bb][Uu][Ff][Ff][Ee][Rr][Mm][Ii][Nn][Tt]\.[Cc][Oo][Mm](?::\d+)?|(?<![\w./~=-]))(\/tools\/[\w./-]*)/g)].map((m) => m[1]);
  const linked = links(text).filter(isInternal);
  const seen = new Set();
  // Both through URL, so /tools/pdf/../dev/x/ reads once, as the browser resolves it
  return [...written, ...linked].map(sitePathOf).map(toolPath).filter((path) => {
    if (!path || seen.has(path.join('/'))) return false;
    seen.add(path.join('/'));
    return true;
  });
}

// build.mjs and src/static publish these beside the tool pages, and the catalogue can't say anything about them
const TOP_FILES = new Set(['feed.xml', 'llms-full.txt', 'llms.txt', 'manifest.webmanifest', 'robots.txt', 'sitemap.xml', 'tools.json']);
const OTHER_ROOTS = new Set(['assets', 'data', 'embed']);

// Why a link under /tools/ is dead, or null. Hidden tools count: they are unlisted and noindex.
function deadReason(path, { categories, unbuilt, hidden, workflows }) {
  if (path.includes('')) return 'is malformed (an empty segment)';
  const [category, slug, ...rest] = path;
  if (!category || OTHER_ROOTS.has(category) || (path.length === 1 && TOP_FILES.has(category))) return null;
  if (category === 'workflows') return !rest.length && (slug ? workflows.has(slug) : workflows.size) ? null : 'is not a live workflow';
  const tools = categories.get(category);
  if (!slug) return [...tools ?? []].some((name) => !hidden.has(name) && !unbuilt.has(`${category}/${name}`)) ? null : 'is not a category with listed tools';
  if (rest.length || !tools?.has(slug)) return 'is not in the catalogue';
  if (unbuilt.has(`${category}/${slug}`)) return 'has no page (no fragment in the catalogue)';
  return hidden.has(slug) ? 'is hidden' : null;
}

// sources: [{ name, text, published? }]. published() gives the text of the version already on origin/main, or null;
// it is asked only for a post with a dead link (one git call each).
// A dead link that the published version has too is a diagnostic: the catalogue moved under a live post, and failing
// every landing lane over it would hold the queue. A link a lane adds, a draft's and a topic's still fail.
function toolLinkReport(sources, catalogue) {
  const report = { failures: new Set(), diagnostics: new Set() };
  for (const { name, text, published } of sources) {
    let old;
    for (const path of toolLinks(text)) {
      const reason = deadReason(path, catalogue);
      if (!reason) continue;
      if (!old) {
        const before = published?.() ?? null;
        old = new Set(before == null ? [] : toolLinks(before).map((p) => p.join('/')));
      }
      const key = path.join('/');
      (old.has(key) ? report.diagnostics : report.failures).add(`${name}: /tools/${key}${key ? '/' : ''} ${reason}`);
    }
  }
  return { failures: [...report.failures], diagnostics: [...report.diagnostics] };
}
const toolLinkProblems = (sources, catalogue) => toolLinkReport(sources, catalogue).failures;

const postSources = (dir) => readdirSync(dir).filter((f) => f.endsWith('.md')).map((name) => ({
  name,
  text: readFileSync(join(dir, name), 'utf8'),
}));
// A post's code samples and comments aren't links: a post about an API can show `POST /tools/call`. A topic's
// backticks can be one. A fence opens and closes only at the start of a line, after nothing but indentation or a
// blockquote's > (a fence in a list item or a quote is still a fence); an unclosed one runs to the end, as it renders.
const withoutCode = (text) => text
  .replace(/^[ \t>]*((`|~)\2{2,})[^\n]*$[\s\S]*?(?:^[ \t>]*\1\2*[ \t]*$|(?![\s\S]))/gm, '')
  .replace(/<pre[\s\S]*?<\/pre>|<code[\s\S]*?<\/code>|<!--[\s\S]*?-->|`[^`\n]*`/g, '');
// The body of a live post as the site shows it; null for a draft, which answers to this gate once it is published
const liveText = (text, name) => {
  const { meta, body } = parsePost(text, name);
  return meta.published === 'false' ? null : withoutCode(body);
};
// The post as it is on the landing repo's origin/main, or null (new here, or no git): then every problem fails
const gitPublished = (name) => {
  try {
    return execFileSync('git', ['-C', root, 'show', `origin/main:source/_posts/${name}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return null;
  }
};
// The live body of the origin/main copy; null for a draft there, or a copy that doesn't parse (then strict)
const publishedLive = (text, name) => {
  if (text == null) return null;
  try { return liveText(text, name); } catch { return null; }
};
const livePostSources = (dir, published = gitPublished) => postSources(dir).flatMap(({ name, text }) => {
  const live = liveText(text, name);
  if (live == null) return [];
  return [{ name, text: live, published: () => publishedLive(published(name), name) }];
});
const topicSources = (openTopics) => openTopics.map((topic) => ({ name: `topic ${topic.number}`, text: topic.section }));

// null with no checkout. A checkout that is there but corrupt, partial or reshaped throws: a skip would switch the
// gate off unseen.
function checkToolLinks(toolsDir, postsDir, openTopics, published = gitPublished) {
  if (!existsSync(toolsDir)) return null;
  return toolLinkReport([...livePostSources(postsDir, published), ...topicSources(openTopics)], readCatalogue(toolsDir));
}

const articleLinks = (topic) => [...topic.section.matchAll(/(?<![\w./-])\/articles\/([\w-]+)/g)].map((m) => m[1]);

const postKeywords = () => postSources(POSTS).flatMap(({ name, text }) => {
  const { keyword } = parsePost(text, name).meta;
  return keyword ? [[keyword.toLowerCase(), name]] : [];
});

const plan = readFileSync(join(root, 'BLOG-PLAN.md'), 'utf8');
const topics = parseTopics(plan);
const open = topics.filter(isOpen);

test('parseTopics reads keywords and status, and stops before the old posts', () => {
  const sample = '### 1. A · `next`\n- **Keyword:** `Foo Bar` (level 4), `baz`.\n- **Status:** todo\n\n'
    + '### 2. B · `now`\n- **Keyword:** `qux`\n- **Status:** published 2026-10-29 → `/articles/b`\n\n'
    + '## Old posts\n### 3. C\n- **Keyword:** `no`\n';
  const parsed = parseTopics(sample);
  assert.deepEqual(parsed.map((t) => t.keyword), ['foo bar', 'qux']);
  assert.deepEqual(parsed.filter(isOpen).map((t) => t.number), [1]);
});

test('the plan parses: numbered topics, each with a keyword and a status', () => {
  assert.ok(topics.length >= 20, `only ${topics.length} topics: the parser broke`);
  const numbers = topics.map((t) => t.number);
  assert.equal(new Set(numbers).size, numbers.length, 'topic numbers repeat');
  for (const t of topics) {
    assert.ok(t.keyword, `topic ${t.number}: no \`keyword\``);
    assert.match(t.status, /^(todo|writing|published)$/, `topic ${t.number}: Status must start with todo, writing or published`);
  }
});

// `todo` only: a `writing` topic's own post carries its keyword
test('no unwritten topic targets a keyword a post already uses', () => {
  const taken = new Map(postKeywords());
  assert.ok(taken.size >= 10, 'post keywords not read');
  const clashes = open.filter((t) => t.status === 'todo' && taken.has(t.keyword)).map((t) => `topic ${t.number}: ${t.keyword} (${taken.get(t.keyword)})`);
  assert.deepEqual(clashes, []);
});

test('no two open topics target the same keyword', () => {
  const seen = new Map();
  for (const t of open) {
    assert.ok(!seen.has(t.keyword), `${t.keyword}: topics ${seen.get(t.keyword)} and ${t.number}`);
    seen.set(t.keyword, t.number);
  }
});

test('open topics link only real posts', () => {
  for (const topic of open) for (const slug of articleLinks(topic)) {
    assert.ok(existsSync(join(POSTS, `${slug}.blade.md`)), `topic ${topic.number}: /articles/${slug} is not a post`);
  }
});

test('every /tools/ link in a post or an open topic is live and listed', (t) => {
  const report = checkToolLinks(TOOLS, POSTS, open);
  if (!report) return t.skip('tool links not checked: no ../buffermint-tools checkout here');
  for (const line of report.diagnostics) t.diagnostic(`already published, not failing: ${line}`);
  assert.deepEqual(report.failures, []);
});

test('toolLinks finds site and buffermint.com links, and nothing else', () => {
  const text = '[a](/tools/pdf/ok/) <a href="/tools/pdf/two">b</a> https://buffermint.com/tools/dev/abs/#x, www.buffermint.com/tools/dev/www/?a=1 '
    + 'HTTPS://BufferMint.com/tools/dev/caps/ See /tools/dev/end. /tools/seo/ /tools/ /tools /assets/tools/a/b/ ~/tools/bin/ https://x.io?u=/tools/h/i '
    + 'https://example.com/tools/c/d/ https://notbuffermint.com/tools/e/f/ tools.pdf24.org/en/g /TOOLS/j/k/';
  assert.deepEqual(toolLinks(text).map((p) => p.join('/')), ['pdf/ok', 'pdf/two', 'dev/abs', 'dev/www', 'dev/caps', 'dev/end', 'seo', '']);
});

test('toolLinks reads what the shared links() reads: an all-caps host, :443, an unquoted href, and keeps a doubled slash', () => {
  const text = '[a](HTTPS://WWW.BUFFERMINT.COM/tools/pdf/caps/) [b](https://buffermint.com:443/tools/pdf/port/?x#y) <a href=/tools/pdf/bare>c</a> '
    + '[d](/tools/pdf//gone/) [e](https://evil.example/tools/pdf/no/) <a href="//cdn.x/tools/pdf/no/">f</a> [g](/tools/pdf/../dev/up/) '
    + 'plain HTTPS://BUFFERMINT.COM/tools/dev/shout/ and https://buffermint.com:443/tools/dev/bare-port/';
  assert.deepEqual(toolLinks(text).map((p) => p.join('/')).sort(), ['dev/bare-port', 'dev/shout', 'dev/up', 'pdf//gone', 'pdf/bare', 'pdf/caps', 'pdf/port']);
});

test('withoutCode drops a post\'s code samples, so their paths are not links', () => {
  const text = 'A `POST /tools/call`\n```\ncurl /tools/list\n```\n~~~\n/tools/a\n~~~\n<pre><code>/tools/b</code></pre>\n<code>GET /tools/c</code> <!-- /tools/d/ -->\n[x](/tools/dev/hash/)';
  assert.deepEqual(toolLinks(withoutCode(text)), [['dev', 'hash']]);
});

test('withoutCode: a fence counts only at the start of a line, and an unclosed one runs to the end', () => {
  const midLine = 'Type ``` to open a fence, see [a](/tools/dev/one/).\nThen ``` again [b](/tools/dev/two/).';
  assert.deepEqual(toolLinks(withoutCode(midLine)).map((p) => p.join('/')), ['dev/one', 'dev/two']);
  const nested = '````md\n```\n/tools/in/side/\n```\n````\n[c](/tools/dev/three/)\n   ~~~\n/tools/x/y/\n   ~~~~\n[d](/tools/dev/four/)\n```\n/tools/open/end/';
  assert.deepEqual(toolLinks(withoutCode(nested)).map((p) => p.join('/')), ['dev/three', 'dev/four']);
  const inside = '- item\n\n    ```\n    curl /tools/call\n    ```\n\n> ```\n> GET /tools/list\n> ```\n[e](/tools/dev/five/)';
  assert.deepEqual(toolLinks(withoutCode(inside)).map((p) => p.join('/')), ['dev/five'], 'a fence in a list item or a quote');
});

test('toolLinkProblems fails a fixture post and topic with dead links, and passes live ones', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tool-links-'));
  try {
    assert.throws(() => readCatalogue(dir), /ENOENT/, 'no checkout');
    for (const sub of ['src/pdf', 'src/text', 'src/dev', 'posts']) mkdirSync(join(dir, sub), { recursive: true });
    assert.throws(() => readCatalogue(dir), /ENOENT/, 'src/hidden.json is missing');
    writeFileSync(join(dir, 'src/pdf/_tools.json'), JSON.stringify([{ slug: 'ok' }, { slug: 'secret' }, { slug: 'step', internal: true }, { slug: 'bare' }, { slug: 'alias', engine: 'pdf/ok' }]));
    writeFileSync(join(dir, 'src/text/_tools.json'), JSON.stringify([{ slug: 'shy' }]));
    writeFileSync(join(dir, 'src/dev/_tools.json'), JSON.stringify([{ slug: 'hash' }, { slug: 'unbuilt' }]));
    for (const page of ['pdf/ok', 'pdf/secret', 'text/shy', 'dev/hash']) writeFileSync(join(dir, `src/${page}.html`), '<div></div>');
    writeFileSync(join(dir, 'src/hidden.json'), JSON.stringify({ tools: ['secret', 'shy'] }));
    writeFileSync(join(dir, 'src/recipes-live.json'), JSON.stringify(['merge']));
    const catalogue = readCatalogue(dir);

    writeFileSync(join(dir, 'posts/live.blade.md'), 'See [ok](/tools/pdf/ok/), [alias](/tools/pdf/alias/), [all](/tools/), [pdf](/tools/pdf/), [flow](/tools/workflows/merge/), [hub](/tools/workflows/), [llms](/tools/llms.txt), [embed](/tools/embed/pdf/ok/), [logo](/tools/assets/brand/logo.svg), [data](/tools/data/emoji.json).');
    assert.deepEqual(toolLinkProblems(postSources(join(dir, 'posts')), catalogue), []);

    writeFileSync(join(dir, 'posts/dead.blade.md'), 'A [gone](/tools/pdf/gone/), twice (/tools/pdf/gone/), [hidden](/tools/pdf/secret/), [wrong](/tools/dev/ok/), '
      + '[deep](/tools/pdf/ok/more/), [cat](/tools/nope/), [hidden cat](/tools/text/), [flow](/tools/workflows/old/), [step](/tools/pdf/step/), [more](/tools/workflows/merge/x/), [file](/tools/pdf/gone.html), [typo](/tools/llm.txt), [bare](/tools/pdf/bare/), [doubled](/tools/pdf//ok/), <a href=HTTPS://BUFFERMINT.COM:443/tools/pdf/caps/>c</a>.');
    const topic = { number: 7, section: 'Internal links: `/tools/pdf/secret/`, /tools/pdf/ok/.' };
    assert.deepEqual(toolLinkProblems([...postSources(join(dir, 'posts')), ...topicSources([topic])], catalogue), [
      'dead.blade.md: /tools/pdf/gone/ is not in the catalogue',
      'dead.blade.md: /tools/pdf/secret/ is hidden',
      'dead.blade.md: /tools/dev/ok/ is not in the catalogue',
      'dead.blade.md: /tools/pdf/ok/more/ is not in the catalogue',
      'dead.blade.md: /tools/nope/ is not a category with listed tools',
      'dead.blade.md: /tools/text/ is not a category with listed tools',
      'dead.blade.md: /tools/workflows/old/ is not a live workflow',
      'dead.blade.md: /tools/pdf/step/ is not in the catalogue',
      'dead.blade.md: /tools/workflows/merge/x/ is not a live workflow',
      'dead.blade.md: /tools/pdf/gone.html/ is not in the catalogue',
      'dead.blade.md: /tools/llm.txt/ is not a category with listed tools',
      'dead.blade.md: /tools/pdf/bare/ has no page (no fragment in the catalogue)',
      'dead.blade.md: /tools/pdf//ok/ is malformed (an empty segment)',
      'dead.blade.md: /tools/pdf/caps/ is not in the catalogue',
      'topic 7: /tools/pdf/secret/ is hidden',
    ]);

    writeFileSync(join(dir, 'src/recipes-live.json'), '[]');
    assert.equal(deadReason(['workflows'], readCatalogue(dir)), 'is not a live workflow', 'no workflows, no hub');
    rmSync(join(dir, 'src/dev/hash.html'));
    assert.equal(deadReason(['dev'], readCatalogue(dir)), 'is not a category with listed tools', 'a category whose tools have no page');

    writeFileSync(join(dir, 'src/pdf/_tools.json'), '{}');
    assert.throws(() => readCatalogue(dir), /unexpected shape/, 'a changed schema');
  } finally {
    rmSync(dir, { recursive: true });
  }
});

test('sourceSites counts a publisher once, like the post gate', () => {
  assert.deepEqual([...sourceSites('https://docs.stripe.com/a, https://stripe.com/us/pricing (found), https://www.gov.uk/x')], ['stripe.com', 'gov.uk']);
});

test('topics from 33 on carry evidence, intent, an angle, 4+ source sites and 2+ internal links', () => {
  const batch = topics.filter((t) => t.number >= FULL_FIELDS_FROM);
  const appendices = plan.split(/^## Appendix/m).slice(1).join('');
  assert.ok(batch.length, 'no batch topics');
  for (const t of batch) {
    assert.match(t.field('Keyword'), /level \d/, `topic ${t.number}: no autosuggest level`);
    assert.ok(appendices.includes(`\n| ${t.keyword} |`), `topic ${t.number}: ${t.keyword} has no row in an appendix`);
    const title = t.section.split('\n')[0].replace(/^\d+\.\s*/, '').replace(/\s*·.*$/, '');
    assert.ok(title.length <= 65, `topic ${t.number}: title is ${title.length} characters`);
    assert.ok(t.field('Search intent').trim(), `topic ${t.number}: no search intent`);
    assert.ok(t.field('New angle').trim(), `topic ${t.number}: no new angle`);
    const sites = sourceSites(t.field('Sources'));
    assert.ok(sites.size >= 4, `topic ${t.number}: ${sites.size} source sites, need 4`);
    const internal = new Set([...t.field('Internal links').matchAll(/\/(?:tools|articles)\/[\w/-]+/g)].map((m) => m[0]));
    assert.ok(internal.size >= 2, `topic ${t.number}: ${internal.size} internal links`);
  }
});

test('checkToolLinks skips with no checkout, fails a broken one, and covers live posts and open topics', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tool-gate-'));
  const tools = join(dir, 'tools');
  const posts = join(dir, 'posts');
  const post = (name, front, body) => writeFileSync(join(posts, name), `---\ntitle: T\n${front}---\n${body}\n`);
  const none = () => null;
  try {
    mkdirSync(posts);
    assert.equal(checkToolLinks(tools, posts, []), null, 'no checkout');

    mkdirSync(join(tools, 'src/pdf'), { recursive: true });
    writeFileSync(join(tools, 'src/pdf/_tools.json'), JSON.stringify([{ slug: 'ok' }]));
    writeFileSync(join(tools, 'src/pdf/ok.html'), '<div></div>');
    writeFileSync(join(tools, 'src/hidden.json'), JSON.stringify({ tools: [] }));
    assert.throws(() => checkToolLinks(tools, posts, [], none), /ENOENT/, 'a partial checkout fails, it does not skip');

    writeFileSync(join(tools, 'src/recipes-live.json'), '[]');
    post('live.blade.md', '', '[ok](/tools/pdf/ok/) `/tools/sample/`');
    post('draft.blade.md', 'published: false\n', '[soon](/tools/pdf/soon/)');
    assert.deepEqual(checkToolLinks(tools, posts, [], none), { failures: [], diagnostics: [] }, 'a draft and a code sample are not links on the site');

    post('dead.blade.md', 'description: /tools/pdf/front/\n', '[gone](/tools/pdf/gone/)');
    const topic = [{ number: 3, section: '`/tools/pdf/old/`' }];
    assert.deepEqual(checkToolLinks(tools, posts, topic, none), { failures: [
      'dead.blade.md: /tools/pdf/gone/ is not in the catalogue',
      'topic 3: /tools/pdf/old/ is not in the catalogue',
    ], diagnostics: [] }, 'nothing published yet: every problem fails');

    // The catalogue moved under a published post: its old link is a diagnostic; a link this branch adds, a draft
    // published here and a topic still fail.
    post('dead.blade.md', 'description: /tools/pdf/front/\n', '[gone](/tools/pdf/gone/) [new](/tools/pdf/added/)');
    post('draft.blade.md', '', '[soon](/tools/pdf/soon/)');
    const onMain = {
      'dead.blade.md': '---\ntitle: T\n---\n[gone](https://buffermint.com/tools/pdf/gone)\n',
      'draft.blade.md': '---\ntitle: T\npublished: false\n---\n[soon](/tools/pdf/soon/)\n',
    };
    assert.deepEqual(checkToolLinks(tools, posts, topic, (name) => onMain[name] ?? null), {
      failures: [
        'dead.blade.md: /tools/pdf/added/ is not in the catalogue',
        'draft.blade.md: /tools/pdf/soon/ is not in the catalogue',
        'topic 3: /tools/pdf/old/ is not in the catalogue',
      ],
      diagnostics: ['dead.blade.md: /tools/pdf/gone/ is not in the catalogue'],
    });

    // The origin/main copy is only read for a post with a dead link, and one that doesn't parse means strict, not a crash
    post('odd.blade.md', '', '[x](/tools/pdf/odd/)');
    const asked = [];
    const report = checkToolLinks(tools, posts, [], (name) => {
      asked.push(name);
      return name === 'odd.blade.md' ? 'no front matter here [x](/tools/pdf/odd/)' : onMain[name] ?? null;
    });
    assert.deepEqual(asked.sort(), ['dead.blade.md', 'draft.blade.md', 'odd.blade.md'], 'live.blade.md has no dead link');
    assert.ok(report.failures.includes('odd.blade.md: /tools/pdf/odd/ is not in the catalogue'));
  } finally {
    rmSync(dir, { recursive: true });
  }
});

test('gitPublished reads a post as it is on origin/main, and null for one that is not there', (t) => {
  let onMain;
  try {
    onMain = execFileSync('git', ['-C', root, 'ls-tree', '--name-only', 'origin/main', 'source/_posts/'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split('\n').filter(Boolean);
  } catch {
    return t.skip('no git or no origin/main here: every post problem fails, which is the strict side');
  }
  if (!onMain.length) return t.skip('no posts on origin/main');
  const name = onMain[0].split('/').pop();
  assert.match(gitPublished(name), /^---\r?\n/);
  assert.equal(gitPublished('not-a-post-on-main.blade.md'), null);
});
