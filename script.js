const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const progress = document.querySelector('.progress');
const header = document.querySelector('.site-header');
const manifesto = document.querySelector('.manifesto');
const manifestoText = document.querySelector('.manifesto-text');
const beyondOrb = document.querySelector('.beyond-orb');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('#site-nav');
const chapterName = document.querySelector('.chapter-name');
const chapterCount = document.querySelector('.chapter-count');
const chapterFill = document.querySelector('.chapter-fill');
const chapters = [
  ['top', 'INTRO'], ['approach', 'APPROACH'], ['experience', 'EXPERIENCE'],
  ['work', 'PROJECTS'], ['story', 'STORY'], ['beyond', 'BEYOND'], ['contact', 'CONTACT']
].map(([id, label]) => ({ element: document.getElementById(id), id, label }));

function closeMenu(returnFocus = false) {
  if (menuToggle.getAttribute('aria-expanded') !== 'true') return;
  header.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
  if (returnFocus) menuToggle.focus();
}
menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  if (isOpen) { closeMenu(); return; }
  header.classList.add('menu-open');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Close menu');
  siteNav.querySelector('a').focus();
});
siteNav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(true); });
document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });

function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${maxScroll > 0 ? window.scrollY / maxScroll * 100 : 0}%`;
    header.classList.toggle('scrolled', window.scrollY > 30);
    const activeIndex = chapters.reduce((found, chapter, index) =>
      chapter.element.getBoundingClientRect().top <= window.innerHeight * .42 ? index : found, 0);
    chapterName.textContent = chapters[activeIndex].label;
    chapterCount.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(chapters.length).padStart(2, '0')}`;
    chapterFill.style.height = `${maxScroll > 0 ? window.scrollY / maxScroll * 100 : 0}%`;
    siteNav.querySelectorAll('a[href^="#"]').forEach(link => {
      if (link.getAttribute('href') === `#${chapters[activeIndex].id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (window.innerWidth > 760) closeMenu();
    if (!reducedMotion) {
      const m = manifesto.getBoundingClientRect();
      const p = clamp(-m.top / Math.max(1, m.height - window.innerHeight), 0, 1);
      manifestoText.style.transform = `translateY(${-p * 22}px)`;
      manifestoText.style.opacity = String(0.55 + p * 0.45);
      const b = document.querySelector('.beyond').getBoundingClientRect();
      const bp = clamp((window.innerHeight - b.top) / (window.innerHeight + b.height), 0, 1);
      beyondOrb.style.transform = `translateY(calc(-50% + ${(bp - 0.5) * 90}px)) rotate(${(bp - 0.5) * 14}deg)`;
    }
    ticking = false;
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });
onScroll();

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  reveals.forEach(el => observer.observe(el));
} else {
  reveals.forEach(el => el.classList.add('visible'));
}
document.querySelector('#year').textContent = new Date().getFullYear();
