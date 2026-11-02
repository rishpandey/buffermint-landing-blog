const s=require('./sweep.json');const R=s.rows;
const sh=R.filter(r=>r.shipped).sort((a,b)=>a.shipped.ssim-b.shipped.ssim);
for(const r of sh.slice(0,10)){const w90=r.variants.find(v=>v.fmt=='webp'&&v.q==90),a70=r.variants.find(v=>v.fmt=='avif'&&v.q==70);console.log(r.file,r.width+'x'+r.height,r.jpeg,'ship',r.shipped.bytes,r.shipped.ssim.toFixed(3),'w90',w90.bytes,w90.ssim.toFixed(3),'a70',a70.bytes,a70.ssim.toFixed(3))}
console.log('below .95',sh.filter(r=>r.shipped.ssim<.95).length,'below .97',sh.filter(r=>r.shipped.ssim<.97).length,'n',sh.length);
console.log('no webp q90 >= .98',R.filter(r=>r.variants.find(v=>v.fmt=='webp'&&v.q==90).ssim<.98).length, 'avif70 <.98',R.filter(r=>r.variants.find(v=>v.fmt=='avif'&&v.q==70).ssim<.98).length);
const eq=sh.filter(r=>r.variants.some(v=>v.fmt=='webp'&&v.bytes==r.shipped.bytes));console.log('ship==some q',eq.length, eq.map(r=>r.variants.find(v=>v.fmt=='webp'&&v.bytes==r.shipped.bytes).q).reduce((m,q)=>(m[q]=(m[q]||0)+1,m),{}));
const q=f=>{const o={};for(const q of [...new Set(R[0].variants.filter(v=>v.fmt==f).map(v=>v.q))]){const vs=R.map(r=>r.variants.find(v=>v.fmt==f&&v.q==q));const b=vs.reduce((a,v)=>a+v.bytes,0);const m=vs.map(v=>v.ssim).sort((a,b)=>a-b);o[q]={sum:b,pct:+(100*(1-b/4265300)).toFixed(1),medSsim:+m[32].toFixed(4),minSsim:+m[0].toFixed(3),bigger:R.filter((r,i)=>vs[i].bytes>r.jpeg).length}}return o};
console.log(q('webp'),q('avif'));
