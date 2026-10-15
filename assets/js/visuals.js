// BG THREE.JS
// ═══════════════════════════════════════════════════════════
(function() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 1000);
  camera.position.z = 50;

  function makeParticles(count, spread, color, size, opacity) {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random()-.5)*spread.x;
      pos[i*3+1] = (Math.random()-.5)*spread.y;
      pos[i*3+2] = (Math.random()-.5)*spread.z;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return new THREE.Points(geo, new THREE.PointsMaterial({
      color, size, transparent: true, opacity, sizeAttenuation: true,
      blending: THREE.AdditiveBlending, depthWrite: false
    }));
  }

  const p1 = makeParticles(1800, {x:160,y:120,z:80}, 0xd4b483, .35, .45);
  const p2 = makeParticles(600,  {x:200,y:150,z:60}, 0xc9a98e, .18, .22);
  scene.add(p1, p2);

  const lines = [];
  for (let i = 0; i < 12; i++) {
    const pts = [new THREE.Vector3(0,-Math.random()*6-2,0), new THREE.Vector3(0,Math.random()*6+2,0)];
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color:0xd4b483, transparent:true, opacity:Math.random()*.12+.03 })
    );
    line.position.set((Math.random()-.5)*80,(Math.random()-.5)*60,(Math.random()-.5)*20);
    line.rotation.z = Math.random()*Math.PI;
    scene.add(line); lines.push(line);
  }

  let tx=0,ty=0,cx=0,cy=0,sy=0,t=0;
  document.addEventListener('mousemove',e=>{ty=(e.clientX/innerWidth-.5)*.25;tx=(e.clientY/innerHeight-.5)*.15;});
  window.addEventListener('scroll',()=>sy=scrollY);

  (function animate(){
    requestAnimationFrame(animate); t+=.004;
    cx+=(tx-cx)*.04; cy+=(ty-cy)*.04;
    p1.rotation.y=t*.04+cy; p1.rotation.x=cx*.5;
    p2.rotation.y=-t*.025+cy*.6; p2.rotation.x=t*.015;
    lines.forEach((l,i)=>{ l.rotation.z+=.002*(i%2?1:-1); l.position.y+=Math.sin(t*.5+i)*.008; });
    camera.position.y=-sy*.012; camera.position.x=cy*3;
    renderer.render(scene,camera);
  })();

  window.addEventListener('resize',()=>{
    camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth,innerHeight);
  });
})();

// ═══════════════════════════════════════════════════════════
// ABOUT 3D SHAPE
// ═══════════════════════════════════════════════════════════
(function(){
  const sc = document.getElementById('shape-canvas');
  if(!sc || typeof THREE === 'undefined') return;
  const sw=sc.offsetWidth, sh=sc.offsetHeight;
  const r = new THREE.WebGLRenderer({canvas:sc,antialias:true,alpha:true});
  r.setPixelRatio(Math.min(devicePixelRatio,2)); r.setSize(sw,sh);
  const s=new THREE.Scene(), cam=new THREE.PerspectiveCamera(50,sw/sh,.1,100);
  cam.position.z=5;
  const add=(geo,mat)=>{const m=new THREE.Mesh(geo,mat);s.add(m);return m;};
  const t1=add(new THREE.TorusGeometry(1.4,.008,16,120),new THREE.MeshBasicMaterial({color:0xd4b483,transparent:true,opacity:.5}));
  const t2=add(new THREE.TorusGeometry(1.9,.005,16,120),new THREE.MeshBasicMaterial({color:0xc9a98e,transparent:true,opacity:.25}));
  t2.rotation.x=Math.PI/4;
  const ico=add(new THREE.IcosahedronGeometry(1,1),new THREE.MeshBasicMaterial({color:0xd4b483,wireframe:true,transparent:true,opacity:.12}));
  add(new THREE.SphereGeometry(.6,32,32),new THREE.MeshBasicMaterial({color:0x1a1410,transparent:true,opacity:.8}));
  const spPos=new Float32Array(300*3);
  for(let i=0;i<300;i++){const r2=1.2+Math.random()*.8,th=Math.random()*Math.PI*2,ph=Math.random()*Math.PI;spPos[i*3]=r2*Math.sin(ph)*Math.cos(th);spPos[i*3+1]=r2*Math.sin(ph)*Math.sin(th);spPos[i*3+2]=r2*Math.cos(ph);}
  const spGeo=new THREE.BufferGeometry();spGeo.setAttribute('position',new THREE.BufferAttribute(spPos,3));
  const sp=new THREE.Points(spGeo,new THREE.PointsMaterial({color:0xd4b483,size:.025,transparent:true,opacity:.6}));
  s.add(sp);
  let st=0;
  (function a(){requestAnimationFrame(a);st+=.006;t1.rotation.x=st*.4;t1.rotation.y=st*.3;t2.rotation.z=st*.2;t2.rotation.y=st*.15;ico.rotation.x=st*.2;ico.rotation.y=st*.3;sp.rotation.y=st*.1;r.render(s,cam);})();
  window.addEventListener('resize',()=>{
    const w=sc.offsetWidth,h=sc.offsetHeight;
    if(!w||!h) return;
    cam.aspect=w/h; cam.updateProjectionMatrix();
    r.setSize(w,h);
  });
})();

// ═══════════════════════════════════════════════════════════
// INSTAGRAM FEED (generatieve kunst per post)
// ═══════════════════════════════════════════════════════════
const instaData=document.documentElement.lang==='en'?[
  {likes:'0',caption:'Shaping dreams, every single day'},
  {likes:'0',caption:'Every brand has a story. What is yours?'},
  {likes:'0',caption:'Branding that stays with you'},
  {likes:'0',caption:'Colour is a feeling, not a choice'},
  {likes:'0',caption:'Light, atmosphere, and a good story'},
  {likes:'0',caption:'Dreams are where everything starts'},
  {likes:'0',caption:'AI that saves time, in your style'},
  {likes:'0',caption:'Imagery that stays with you'},
  {likes:'0',caption:'Less fuss, more dream'},
  {likes:'0',caption:'Behind the scenes of a shoot'},
  {likes:'0',caption:'A brand starts with a feeling'},
  {likes:'0',caption:'Your dream, beautifully shaped'}
]:[
  {likes:'0',caption:'Dromen vormgeven, elke dag opnieuw'},
  {likes:'0',caption:'Elk merk heeft een verhaal. Wat is het jouwe?'},
  {likes:'0',caption:'Branding die blijft hangen'},
  {likes:'0',caption:'Kleur is een gevoel, geen keuze'},
  {likes:'0',caption:'Licht, sfeer en een goed verhaal'},
  {likes:'0',caption:'Dromen zijn het begin van alles'},
  {likes:'0',caption:'AI die tijd bespaart, in jouw stijl'},
  {likes:'0',caption:'Beeld dat blijft hangen'},
  {likes:'0',caption:'Minder gedoe, meer droom'},
  {likes:'0',caption:'Achter de schermen bij een shoot'},
  {likes:'0',caption:'Een merk begint met een gevoel'},
  {likes:'0',caption:'Jouw droom, mooi vormgegeven'}
];

const palettes=[
  ['#2a1f1a','#d4b483','#c9a98e'],
  ['#1a1410','#e8d5c4','#b8977e'],
  ['#1f0f1a','#f0c4d4','#e8a0b4'],
  ['#131a0f','#8fb870','#c4d9a0'],
  ['#0f1520','#6898d4','#a0c0e8'],
  ['#1a1410','#d4b483','#f5efe8'],
  ['#1a0f14','#d4a0b0','#e8c4d0'],
  ['#0f1a14','#70b490','#a0d4b4'],
  ['#1a1820','#a090d4','#c8c0e8'],
  ['#200f0f','#d48070','#e8b0a0'],
  ['#1a1410','#c4b090','#e8d8c0'],
  ['#0f1418','#70a0c4','#b0cce0'],
];

const instaGrid=document.getElementById('instaGrid');
if (instaGrid) instaData.forEach((post,idx)=>{
  const cell=document.createElement('div');
  cell.className='insta-cell';
  cell.setAttribute('role','listitem');
  cell.setAttribute('aria-label', post.caption);
  const cv=document.createElement('canvas');
  cv.width=200; cv.height=200;
  cv.setAttribute('aria-hidden','true');
  const ctx=cv.getContext('2d');
  const pal=palettes[idx%palettes.length];

  // draw generative art
  ctx.fillStyle=pal[0]; ctx.fillRect(0,0,200,200);

  // random shapes
  const seed=idx*137.5;
  for(let i=0;i<8;i++){
    const x=((seed*i*31)%180)+10, y=((seed*i*17)%180)+10;
    const r=((seed*i*7)%40)+10;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.strokeStyle=pal[1]+(Math.floor(20+i*8).toString(16));
    ctx.lineWidth=.5+i*.15;
    ctx.stroke();
  }
  // lines
  ctx.save();
  ctx.translate(100,100);
  for(let i=0;i<12;i++){
    const angle=(seed+i*30)*Math.PI/180;
    const len=40+((seed*i*3)%50);
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(Math.cos(angle)*len,Math.sin(angle)*len);
    ctx.strokeStyle=pal[2]+'60';
    ctx.lineWidth=.5;
    ctx.stroke();
  }
  ctx.restore();
  // center element
  ctx.beginPath();
  const cx2=100+((seed*7)%40)-20, cy2=100+((seed*11)%40)-20;
  ctx.arc(cx2,cy2,12+((seed*3)%20),0,Math.PI*2);
  ctx.fillStyle=pal[1]+'40';
  ctx.fill();
  ctx.strokeStyle=pal[1];
  ctx.lineWidth=.5;
  ctx.stroke();
  // dots
  for(let i=0;i<20;i++){
    const dx=((seed*i*23)%180)+10, dy=((seed*i*41)%180)+10;
    ctx.beginPath(); ctx.arc(dx,dy,1,0,Math.PI*2);
    ctx.fillStyle=pal[2]+'90'; ctx.fill();
  }

  cell.appendChild(cv);
  const overlay=document.createElement('div');
  overlay.className='insta-overlay';
  overlay.setAttribute('aria-hidden','true');
  overlay.innerHTML=`<span class="insta-icon">✦</span><span class="insta-likes" style="padding:0 12px;text-align:center;line-height:1.6">${post.caption}</span>`;
  cell.appendChild(overlay);
  instaGrid.appendChild(cell);
});

// ═══════════════════════════════════════════════════════════
