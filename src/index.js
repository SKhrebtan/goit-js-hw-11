import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import fetchImages from './js/axios';
import {Spinner} from 'spin.js';

const searchImgForm = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const spinner = document.querySelector('.spin');
const btnSpinner = document.querySelector('.spinner-border');
const loadSpan = document.querySelector('.load-span');
let searchValue = '';
let currentPage = 1;
let currentTotalHits = 0;

const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});
const target = document.querySelector('.spin');
const opts = {
  lines: 10, // The number of lines to draw
  length: 6, // The length of each line
  width: 4, // The line thickness
  radius: 4, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#fc8a11', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  zIndex: 2000000000, // The z-index (defaults to 2e9)
  className: 'spinner', // The CSS class to assign to the spinner
 };
new Spinner(opts).spin(target);

searchImgForm.addEventListener('submit', onFormSearch);
loadMoreBtn.addEventListener('click', onLoadMorePhotos);

async function onFormSearch(e) {
  e.preventDefault();
  searchValue = e.currentTarget.elements.searchQuery.value;
  spinner.style.display = 'none';
  btnSpinner.classList.add('is-hidden');
  loadMoreBtn.style.display = 'none';
  currentPage = 1;
  if (searchValue === '') {
    Notiflix.Notify.info('Буляска уведіть запит');
    return;
  }
  try {
    const response = await fetchImages(searchValue, currentPage);
    if (response.totalHits === 0) {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      return;
    }
    galleryContainer.innerHTML = '';
    currentTotalHits = response.hits.length;
    Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
    if (currentTotalHits < 40) {
      Notiflix.Notify.info('We are sorry, but you have reached the end of search results');
           } else {
      loadMoreBtn.disabled = false;
      loadMoreBtn.style.display = 'block';
  };
      return await onSearchRenderGallery(response);
  } catch (error) {
    Notiflix.Notify.warning('Щось пішло не так');
    console.log(error);
  } 
};

async function onLoadMorePhotos() {
  currentPage += 1;
  loadMoreBtn.disabled = true;
  spinner.style.display = 'block';
  btnSpinner.classList.remove('is-hidden');
  loadSpan.textContent = 'Loading...';
  try {
    const response = await fetchImages(searchValue, currentPage);
    if (response.totalHits === 0) {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      return;
    }
    currentTotalHits += response.hits.length;
    loadMoreBtn.disabled = false;
    spinner.style.display = 'none';
    btnSpinner.classList.add('is-hidden');
    loadSpan.textContent = 'Load more';
    if (currentTotalHits === response.totalHits) {
       Notiflix.Notify.info('We are sorry, but you have reached the end of search results');
      loadMoreBtn.style.display = 'none';
    }
    return await onSearchRenderGallery(response);
   }
  catch (error) {
    Notiflix.Notify.warning('Щось пішло не так');
    console.log(error);
  }  
  };

function onSearchRenderGallery(response) {
 const markup = response.hits.map((item) => {
   return `<div class="photo-card">
                            <a class="gallery-link" href="${item.largeImageURL}"><img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" /></a>
  <div class="info">
   <p class="info-item">
      <b>Likes  ${item.likes}</b>
    </p>
    <p class="info-item">
      <b>Views  ${item.views}</b>
    </p>
    <p class="info-item">
      <b>Comments  ${item.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads  ${item.downloads}</b>
    </p>
  </div>       
</div>`
            }
            ).join('');
          galleryContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
   onRenderScroll();
 };

function onRenderScroll() {
  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 15,
    behavior: "smooth",
  });
};

// const options = {
//     // root: document.querySelector('.gallery'),
//     rootMargin: '0px',
//     threshold: 1.0
// }

// const observer = new IntersectionObserver(callback, options);

// observer.observe('.photo-card');

// const callback = function(entries, observer) {
// 	entries.forEach((entry) => {
		
// 	});
// }












