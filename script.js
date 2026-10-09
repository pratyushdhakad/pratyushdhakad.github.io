const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const progress = document.querySelector('.progress');
const header = document.querySelector('.site-header');
const manifesto = document.querySelector('.manifesto');
const manifestoText = document.querySelector('.manifesto-text');
const beyondOrb = document.querySelector('.beyond-orb');

function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${maxScroll > 0 ? window.scrollY / maxScroll * 100 : 0}%`;
    header.classList.toggle('scrolled', window.scrollY > 30);
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
