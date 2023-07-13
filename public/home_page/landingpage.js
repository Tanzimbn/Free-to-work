const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

menu.addEventListener('click', function() {
  menu.classList.toggle('is-active');
  menuLinks.classList.toggle('active');
});

const productContainers = [...document.querySelectorAll('.product-container')];
const nxtBtn = [...document.querySelectorAll('.nxt-btn')];
const preBtn = [...document.querySelectorAll('.pre-btn')];

productContainers.forEach((item, i) => {
    let containerDimensions = item.getBoundingClientRect();
    let containerWidth = containerDimensions.width;

    nxtBtn[i].addEventListener('click', () => {
        item.scrollLeft += containerWidth;
    })

    preBtn[i].addEventListener('click', () => {
        item.scrollLeft -= containerWidth;
    })
})
document.querySelector(".nav_home").style.color="#fc6060";
function nav_home(){
    document.querySelector(".nav_home").style.color="#fc6060";
    document.querySelector(".nav_tech").style.color="white";
    document.querySelector(".nav_jobs").style.color="white";
}
function nav_tech(){
    document.querySelector(".nav_home").style.color="white";
    document.querySelector(".nav_tech").style.color="#fc6060";
    document.querySelector(".nav_jobs").style.color="white";
}
function nav_jobs(){
    document.querySelector(".nav_home").style.color="white";
    document.querySelector(".nav_tech").style.color="white";
    document.querySelector(".nav_jobs").style.color="#fc6060";
}