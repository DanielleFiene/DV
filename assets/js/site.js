// ═══════════════════════════════════════════════════════════
// PRELOADER
// ═══════════════════════════════════════════════════════════
function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('done');
    preloader.setAttribute('aria-hidden', 'true');
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(hidePreloader, 250), { once: true });
} else {
  setTimeout(hidePreloader, 250);
}

// ═══════════════════════════════════════════════════════════
// CURSOR
// ═══════════════════════════════════════════════════════════
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
if (cursor && cursorRing && window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  });
  document.querySelectorAll('a,button,.project-item,.service-card,.insta-cell').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
  });
  (function animateCursor() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px';
    requestAnimationFrame(animateCursor);
  })();
}

// ═══════════════════════════════════════════════════════════
// HEADER SCROLL + MOBILE NAV
// ═══════════════════════════════════════════════════════════
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });
}
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
function setMobileNavOpen(open) {
  if (!hamburger || !mobileNav) return;
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  hamburger.setAttribute('aria-label', open ? 'Sluit navigatiemenu' : 'Open navigatiemenu');
  mobileNav.classList.toggle('open', open);
  mobileNav.setAttribute('aria-hidden', String(!open));
  mobileNav.toggleAttribute('inert', !open);
  if (header) header.classList.toggle('nav-open', open);
}
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    setMobileNavOpen(!mobileNav.classList.contains('open'));
  });
  document.querySelectorAll('.mobile-link').forEach(a => {
    a.addEventListener('click', () => setMobileNavOpen(false));
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      setMobileNavOpen(false);
      hamburger.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!mobileNav.classList.contains('open')) return;
    if (header && header.contains(e.target)) return;
    setMobileNavOpen(false);
  });
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 1101px)').matches) setMobileNavOpen(false);
  });
}

// ═══════════════════════════════════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════════════════════════════════
const reveals = document.querySelectorAll('.reveal');
new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){setTimeout(()=>e.target.classList.add('visible'),80);} });
},{threshold:.1,rootMargin:'0px 0px -40px 0px'}).observe || reveals.forEach(el=>{
  new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add('visible');}},{threshold:.1}).observe(el);
});
// fix: observe each
reveals.forEach(el => {
  new IntersectionObserver(([e])=>{if(e.isIntersecting){setTimeout(()=>el.classList.add('visible'),80);}},{threshold:.1,rootMargin:'0px 0px -40px 0px'}).observe(el);
});

// ═══════════════════════════════════════════════════════════
// KNOPPEN KIEZEN ALVAST DE JUISTE DIENST IN HET FORMULIER
// ═══════════════════════════════════════════════════════════
document.querySelectorAll('[data-service]').forEach(a=>{
  a.addEventListener('click',()=>{const sel=document.getElementById('fService');if(sel){sel.value=a.dataset.service;}});
});

// ═══════════════════════════════════════════════════════════
// CONTACT FORM
// ═══════════════════════════════════════════════════════════
(function(){
  const form=document.getElementById('contactForm'),res=document.getElementById('formResult'),draft=document.getElementById('draft'),note=document.getElementById('copyNote');
  if (!form || !res || !draft) return;
  const MAIL='dvdesignstudio.eu@gmail.com';
  function copy(text,ok){
    const fb=()=>{draft.focus();draft.select();note.textContent='Selecteer en kopieer met Ctrl+C of Cmd+C.'};
    try{navigator.clipboard.writeText(text).then(()=>{note.textContent=ok},fb)}catch(e){fb()}
  }
  form.addEventListener('submit',function(e){
    e.preventDefault();
    const v=id=>document.getElementById(id).value||'-';
    draft.value='Naam: '+v('fName')+'\nE-mail: '+v('fMail')+'\nDienst: '+v('fService')+'\nBudget: '+v('fBudget')+'\n\n'+v('fMsg');
    form.style.display='none';res.classList.add('show');
  });
  document.getElementById('copyDraft').addEventListener('click',()=>copy(draft.value,'Bericht gekopieerd. Plak het in een e-mail.'));
  document.getElementById('copyMail').addEventListener('click',()=>copy(MAIL,'E-mailadres gekopieerd.'));
})();

// ═══════════════════════════════════════════════════════════
