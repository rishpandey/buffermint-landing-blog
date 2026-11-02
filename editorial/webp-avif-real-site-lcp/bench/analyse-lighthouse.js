const fs=require('fs');const rows=fs.readFileSync(__dirname+'/lighthouse.jsonl','utf8').trim().split('\n').map(JSON.parse);
const med=a=>{a=[...a].sort((x,y)=>x-y);return a[Math.floor(a.length/2)]};
const g={};for(const r of rows){(g[r.page+' '+r.v]??=[]).push(r)}
for(const k of Object.keys(g)){const R=g[k];console.log(k.padEnd(70),'n',R.length,'score',med(R.map(r=>r.score)),'lcp',Math.round(med(R.map(r=>r.lcp))),'['+Math.round(Math.min(...R.map(r=>r.lcp)))+'-'+Math.round(Math.max(...R.map(r=>r.lcp)))+']','fcp',Math.round(med(R.map(r=>r.fcp))),'tbt',Math.round(med(R.map(r=>r.tbt))),'kb',Math.round(med(R.map(r=>r.total))/1024),'imgkb',Math.round(med(R.map(r=>r.imgBytes))/1024),'bi',Math.round(med(R.map(r=>r.benchIndex))))}
const r=rows.find(r=>r.v=='webp'&&r.page.length>1),h=rows.find(r=>r.v=='webp'&&r.page=='/');
console.log(r.lh,r.chrome);console.log('POST',r.lcpEl.slice(0,600));console.log(JSON.stringify(r.imgs).slice(0,400));console.log('HOME',h.lcpEl.slice(0,600));console.log(JSON.stringify(h.imgs).slice(0,400));
