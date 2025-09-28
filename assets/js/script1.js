// assets/js/script1.js
function wrapLetters(el) {
  const text = el.textContent;
  el.textContent = '';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'letter';
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    span.style.animationDelay = (i * 60) + 'ms';
    el.appendChild(span);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('script1.js loaded');
  const targets = document.querySelectorAll('.stagger-grow');
  console.log('found targets:', targets.length);

  targets.forEach(wrapLetters);

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        obs.unobserve(entry.target); // play once
      }
    });
  }, { threshold: 0.3 });

  targets.forEach(el => io.observe(el));
});
