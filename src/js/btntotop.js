const myButton = document.getElementById("myBtn");
const btnToBottom = document.querySelector('.btntobottom');
myButton.addEventListener('click', onPageTop);
btnToBottom.addEventListener('click', onPageBottom);

window.onscroll = function () {
  if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
    myButton.style.display = "block";
  } else {
    myButton.style.display = "none";
  }
  if ((document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) && document.documentElement.scrollHeight > 3000) {
    btnToBottom.style.display = "none";
  } else {
    btnToBottom.style.display = "block";
  }};

function onPageTop() {
  window.scrollTo({top: 0, behavior: 'smooth'});
};

function onPageBottom() {
 window.scrollTo({top: document.documentElement.scrollHeight
, behavior: 'smooth'});
}

