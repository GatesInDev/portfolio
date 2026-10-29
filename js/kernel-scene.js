import { kernelSource } from './kernel-source.js';
// Three.js is pinned; the existing Canvas backdrop remains if WebGL is unavailable.
try {
const T = await import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const renderer = new T.WebGLRenderer({alpha:true,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.domElement.className='kernel-scene';
renderer.domElement.setAttribute('aria-hidden','true');
document.body.prepend(renderer.domElement);
const scene=new T.Scene();
scene.fog=new T.FogExp2(0x101512,.028);
const camera=new T.PerspectiveCamera(50,innerWidth/innerHeight,.1,150);
const group=new T.Group();scene.add(group);
const source=kernelSource.split('\n');
for(let p=0;p<8;p++){
 const c=document.createElement('canvas');c.width=1024;c.height=1024;
 const ctx=c.getContext('2d');ctx.fillStyle='rgba(12,22,17,.8)';ctx.fillRect(0,0,1024,1024);
 ctx.strokeStyle='#45694f';ctx.strokeRect(1,1,1022,1022);
 ctx.font='18px monospace';ctx.fillStyle='#c5d59c';ctx.fillText(`LINUX / SCHEDULER   ·   ${String(p).padStart(2,'0')}`,32,45);
 for(let l=0;l<38;l++){ctx.fillStyle=l%5===0?'#b8c58e':'#749989';ctx.fillText(String(p*24+l).padStart(3,'0')+'  '+source[(p*24+l)%source.length].replace(/\t/g,'  '),24,90+l*23);}
 const texture=new T.CanvasTexture(c);
 const plane=new T.Mesh(new T.PlaneGeometry(12,12),new T.MeshBasicMaterial({map:texture,transparent:true,opacity:.48,side:T.DoubleSide,depthWrite:false}));
 plane.position.set((p%2?1:-1)*(9+p%3),2-p%3*3,-p*7);plane.rotation.y=p%2?-.35:.35;group.add(plane);
}
const material=new T.MeshBasicMaterial({color:0x8ba96e,wireframe:true,transparent:true,opacity:.3});
const pages=[];
for(let i=0;i<72;i++){
 const m=new T.Mesh(new T.BoxGeometry(.7,.12,1.1),material.clone());
 m.position.set(5+(i%6)*1.1,-5+Math.floor(i/6)*.32,-12-Math.floor(i/6)*1.25);scene.add(m);pages.push(m);
}
const paths=[],pulses=[];
for(let i=0;i<12;i++){
 const x=(i%2?1:-1)*(5+i%4);
 const curve=new T.CatmullRomCurve3([new T.Vector3(x,3,-i*3),new T.Vector3(x*.5,-2,-10-i*2),new T.Vector3(-x,-3,-25-i)]);
 const line=new T.Line(new T.BufferGeometry().setFromPoints(curve.getPoints(60)),new T.LineBasicMaterial({color:0x7d9a68,transparent:true,opacity:.22}));scene.add(line);
 const pulse=new T.Mesh(new T.SphereGeometry(.07,8,8),new T.MeshBasicMaterial({color:0xc3d992}));scene.add(pulse);paths.push(curve);pulses.push(pulse);
}
const tasks=[];
for(let i=0;i<12;i++){const m=new T.Mesh(new T.BoxGeometry(.35,.35,.35),new T.MeshBasicMaterial({color:0x91b59a,transparent:true,opacity:.55}));scene.add(m);tasks.push(m);}
let pointer={x:0,y:0},depth=0,frame=0;
let paused=false, elapsed=0, boost=0;
addEventListener('pointerdown',e=>{if(e.pointerType==='touch'){pointer.x=e.clientX/innerWidth-.5;pointer.y=e.clientY/innerHeight-.5;wake();}},{passive:true});
addEventListener('pointerout',e=>{if(!e.relatedTarget){pointer.x=0;pointer.y=0;}},{passive:true});
function route(){const h=location.hash;depth=h.includes('project')?12:h.includes('article')||h.includes('post')?26:h.includes('contact')?38:0;}
function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}
addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){pointer.x=e.clientX/innerWidth-.5;pointer.y=e.clientY/innerHeight-.5;}},{passive:true});
addEventListener('hashchange',route);addEventListener('resize',resize);
camera.position.set(0,0,18);route();resize();
let last=0;
function animate(now){frame=0;if(document.hidden)return;const dt=Math.min((now-last)/1000,.05);last=now;if(!paused&&!reduced.matches){elapsed+=dt*(1+boost);boost=Math.max(0,boost-dt*1.5);}const t=reduced.matches?0:elapsed;
 const z=18-depth-Math.min(scrollY*.008,12);const blend=reduced.matches?1:1-Math.exp(-dt*3);
 camera.position.lerp(new T.Vector3(reduced.matches?0:pointer.x*2,reduced.matches?0:-pointer.y*1.3,z),blend);
 camera.lookAt(0,0,camera.position.z-24);
 pulses.forEach((p,i)=>p.position.copy(paths[i].getPoint((t*.075+i/12)%1)));
 tasks.forEach((m,i)=>{m.position.set(-7+((i+t*.7)%12)*.5,-3.5,-10-depth*.5);m.rotation.y=t*.3;});
 pages.forEach((m,i)=>{m.material.opacity=.15+(Math.sin(t*1.2+i*.5)+1)*.12;});
 renderer.render(scene,camera);if(!reduced.matches&&!paused)frame=requestAnimationFrame(animate);
}
function wake(){if(!frame&&!document.hidden)frame=requestAnimationFrame(animate);}
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else wake();});
addEventListener('scroll',wake,{passive:true});addEventListener('hashchange',wake);addEventListener('resize',wake);reduced.addEventListener('change',wake);
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);renderer.domElement.remove();document.body.classList.remove('has-kernel-scene');});
document.body.classList.add('has-kernel-scene');wake();
} catch(error) { console.info('Using Canvas kernel backdrop.',error.message); }
