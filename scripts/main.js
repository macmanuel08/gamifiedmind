const currentYear = new Date().getFullYear();
document.querySelector('.current-year').textContent = currentYear;

const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('header nav');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    nav.classList.toggle('open');
});