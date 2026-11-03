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
$('#sv').onclick=()=>{const was=document.body.classList.contains('editing');setEdit(false);document.body.classList.remove('owner');const cl=document.documentElement.cloneNode(true);cl.querySelector('body').className='';const L=cl.querySelector('#loader');if(L)L.classList.remove('out','gone');const h='<!DOCTYPE html>\n'+cl.outerHTML;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([h],{type:'text/html'}));a.download='index.html';document.body.appendChild(a);a.click();a.remove();document.body.classList.add('owner');if(was)setEdit(true)};

/* ---------- Loader logic ---------- */
(function(){
const L=$('#loader'),A=$('#ldA'),P=$('#ldPct'),B=$('#ldBar'),H=$('#ldHello');
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
document.body.classList.add('ld-lock');
const words=['Hello','नमस्ते','Hola','Bonjour','Ciao'];let wi=0;
const wt=setInterval(()=>{H.style.opacity=0;setTimeout(()=>{H.textContent=words[++wi%words.length];H.style.opacity=1},220)},520);
const MIN=reduce?300:2400,t0=performance.now();let loaded=document.readyState==='complete';
addEventListener('load',()=>loaded=true);
function done(){clearInterval(wt);L.classList.add('out');setTimeout(()=>document.body.classList.add('loaded'),reduce?0:450);setTimeout(()=>{L.classList.add('gone');document.body.classList.remove('ld-lock')},1500)}
(function tick(now){let p=Math.min((now-t0)/MIN,1);p=1-Math.pow(1-p,3);if(!loaded)p=Math.min(p,.92);
const v=Math.round(p*100);A.style.setProperty('--p',v+'%');P.textContent=v;B.style.width=v+'%';
if(p>=1&&loaded)done();else requestAnimationFrame(tick)})(t0);
})();
