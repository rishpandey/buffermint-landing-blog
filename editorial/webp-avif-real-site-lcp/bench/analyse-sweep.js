const s=require('./sweep.json');const R=s.rows;
console.log('rows',R.length,'sumjpeg',R.reduce((a,r)=>a+r.jpeg,0));
const withV=R.filter(r=>r.variants&&r.variants.length);console.log('withV',withV.length,'errs',R.filter(r=>r.error).length, 'keys',Object.keys(R[0]));
const med=a=>{a=[...a].sort((x,y)=>x-y);return a[Math.floor(a.length/2)]};
const interp=(vs,t)=>{vs=[...vs].sort((a,b)=>a.ssim-b.ssim);// smallest whose ssim>=t
 const hit=vs.filter(v=>v.ssim>=t).sort((a,b)=>a.bytes-b.bytes)[0];return hit};
for(const t of [0.98,0.985,0.99]){
 let n=0,J=0,W=0,A=0,rw=[],ra=[],rav=[],wWin=0;
 for(const r of withV){const w=interp(r.variants.filter(v=>v.fmt=='webp'),t),a=interp(r.variants.filter(v=>v.fmt=='avif'),t);if(!w||!a)continue;n++;J+=r.jpeg;W+=w.bytes;A+=a.bytes;rw.push(w.bytes/r.jpeg);ra.push(a.bytes/r.jpeg);rav.push(a.bytes/w.bytes);if(w.bytes<a.bytes)wWin++}
 console.log(t,{n,J,W,A,w:1-W/J,a:1-A/J,aw:1-A/W,medw:1-med(rw),meda:1-med(ra),medaw:1-med(rav),wWin});
}
const big=withV.filter(r=>r.jpeg>=50000);console.log('big',big.length);
const sh=withV.filter(r=>r.shipped);console.log('shipped',sh.length,sh.reduce((a,r)=>a+r.jpeg,0),sh.reduce((a,r)=>a+r.shipped.bytes,0),'minssim',Math.min(...sh.map(r=>r.shipped.ssim)),'medssim',med(sh.map(r=>r.shipped.ssim)));
console.log('largerThanJpeg',sh.filter(r=>r.shipped.bytes>r.jpeg).length);
const ms=f=>med(withV.flatMap(r=>r.variants.filter(v=>v.fmt==f).map(v=>v.ms/(r.width*r.height)*1e6)));console.log('ms/MP',ms('webp'),ms('avif'));
console.log('dims',withV.filter(r=>r.width>=1000).length);
console.log(withV.filter(r=>r.jpeg>=50000).slice(0,0));
