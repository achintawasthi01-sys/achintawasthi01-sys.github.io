const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});
$$('.rv').forEach(e=>io.observe(e));
const secs=[...$$('header[id],section[id]')],nl=$$('.links a[href^="#"]');
addEventListener('scroll',()=>{let c='home';secs.forEach(s=>{if(s.getBoundingClientRect().top<140)c=s.id});nl.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+c))},{passive:true});
function setEdit(on){document.body.classList.toggle('editing',on);$$('[data-e]').forEach(e=>on?e.setAttribute('contenteditable','true'):e.removeAttribute('contenteditable'));$('#ed').textContent=on?'✓ Editing':'✎ Edit'}
if(/[?&]edit/.test(location.search))document.body.classList.add('owner');
let tp=0,tt;$$('.brand,footer').forEach(el=>el.addEventListener('click',()=>{tp++;clearTimeout(tt);tt=setTimeout(()=>tp=0,700);if(tp>=3){tp=0;document.body.classList.add('owner')}}));
$('#ed').onclick=()=>setEdit(!document.body.classList.contains('editing'));
$$('a[data-e]').forEach(a=>a.addEventListener('click',e=>{if(document.body.classList.contains('editing'))e.preventDefault()}));
const clean=s=>s.replace(/^["']|["']$/g,'').trim(),url=v=>/^(https?:|#)/.test(v)?v:'https://'+v;
const MQ='?subject=Hello%20Achint%20%E2%80%94%20let%27s%20connect&body=Hi%20Achint%2C%0A%0AI%20saw%20your%20portfolio%20and%20would%20like%20to%20connect.%0A%0AMy%20name%3A%20%0AReason%20for%20reaching%20out%3A%20%0A%0AThanks!';$('#em').addEventListener('blur',e=>{$('#em').href=$('#gt').href='mailto:'+clean(e.target.textContent)+MQ});
['li','gh','ig'].forEach(i=>$('#'+i).addEventListener('blur',e=>e.target.href=url(clean(e.target.textContent))));
$('#fr').onclick=()=>document.body.classList.contains('editing')&&$('#fi').click();
$('#fi').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=x=>$('#pic').src=x.target.result;r.readAsDataURL(f)};
$('#add').onclick=()=>{const c=document.createElement('div');c.className='card';c.innerHTML='<button class="rm eo" onclick="this.parentNode.remove()">×</button><div class="num">New</div><h3 data-e contenteditable="true">Project title</h3><p data-e contenteditable="true">Describe what it does and what you learned building it.</p><div class="tags"><span data-e contenteditable="true">Tech</span><span data-e contenteditable="true">Stack</span></div><a class="lk" href="#" data-e contenteditable="true">GitHub →</a><a class="lk" href="#" data-e contenteditable="true">Demo →</a>';$('#pg').insertBefore(c,$('#add'))};
$('#sv').onclick=()=>{const was=document.body.classList.contains('editing');setEdit(false);document.body.classList.remove('owner');const cl=document.documentElement.cloneNode(true);cl.querySelector('body').className='';const L=cl.querySelector('#loader');if(L&&window.__LD0)L.outerHTML=window.__LD0;const h='<!DOCTYPE html>\n'+cl.outerHTML;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([h],{type:'text/html'}));a.download='index.html';document.body.appendChild(a);a.click();a.remove();document.body.classList.add('owner');if(was)setEdit(true)};

/* ---------- Loader logic: cat sleeps while ring fills, then wakes, dominoes fall, iris closes ---------- */
(function(){
const L=document.getElementById('loader');window.__LD0=L.outerHTML;
const g=id=>document.getElementById(id);
const cyl=g('cyl'),rp=g('rp'),orb=g('orb'),dom=g('dom'),pct=g('ldPct'),words=document.querySelectorAll('#bh span');
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
document.body.classList.add('ld-lock');
const MIN=reduce?300:2400,C=653.5,TH=[.4,.65,.88];
let t0=performance.now(),loaded=document.readyState==='complete',fin=false;
addEventListener('load',()=>loaded=true);
L.addEventListener('click',()=>{t0=Math.min(t0,performance.now()-MIN*.8)});
function finish(){
  fin=true;L.classList.add('awake');dom.classList.remove('rise');dom.classList.add('fall');
  setTimeout(()=>{L.classList.add('out');setTimeout(()=>document.body.classList.add('loaded'),450)},reduce?0:1000);
  setTimeout(()=>{L.classList.add('gone');document.body.classList.remove('ld-lock')},reduce?800:2400);
}
(function tick(now){
  let p=Math.min((now-t0)/MIN,1);p=1-Math.pow(1-p,2.2);if(!loaded)p=Math.min(p,.92);
  rp.style.strokeDashoffset=C*(1-p);orb.style.transform='rotate('+p*360+'deg)';cyl.style.transform='rotateX('+p*288+'deg)';
  pct.textContent=Math.round(p*100);
  if(p>.12)dom.classList.add('rise');
  words.forEach((w,i)=>w.classList.toggle('on',p>TH[i]));
  if(p>=1&&loaded)finish();else requestAnimationFrame(tick);
})(t0);
})();
