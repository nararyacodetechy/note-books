const menuBar = document.querySelector("nav .menu-bar input");
const nav = document.querySelector("nav .nav-links");

const addHide = document.querySelector("header .jumbotron");

menuBar.addEventListener("click", function () {
  nav.classList.toggle("slide-active");
  addHide.classList.toggle("jumbotron-hidden");
});
