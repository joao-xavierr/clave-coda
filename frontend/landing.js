const faders = document.querySelectorAll('.fade-in');

window.addEventListener('scroll', () => {
  faders.forEach(el => {
    const top = el.getBoundingClientRect().top;
    const height = window.innerHeight;
    if (top < height - 50) {
      el.classList.add('visible');
    }
  });
});
