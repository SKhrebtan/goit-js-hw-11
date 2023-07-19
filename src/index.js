import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import fetchImages from './js/axios';

const searchImgForm = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const submitBtn = document.querySelector('.submit-btn');


let searchValue = '';
let currentPage = 1;
let currentTotalHits = 0;

const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

searchImgForm.addEventListener('submit', onFormSearch);
loadMoreBtn.addEventListener('click', onLoadMorePhotos);


async function onFormSearch(e) {
  e.preventDefault();
  searchValue = e.currentTarget.elements.searchQuery.value;
  galleryContainer.innerHTML = '';
  loadMoreBtn.style.display = 'none';
  currentPage = 1;
  if (searchValue === '') {
    return;
  }
 
  try {
    const response = await fetchImages(searchValue, currentPage);
    if (response.totalHits === 0) {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      return;
    }
    currentTotalHits = response.hits.length;
    Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
    if (currentTotalHits < 40) {
      Notiflix.Notify.info('We are sorry, but you have reached the end of search results');
        loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.disabled = false;
     loadMoreBtn.style.display = 'block';
  };
      return await onSearchRenderGallery(response);
  } catch (error) {
    console.log(error);
  } 
};

async function onLoadMorePhotos() {
  currentPage += 1;
  loadMoreBtn.disabled = true;
  loadMoreBtn.textContent = 'Loading...';
  try {
    const response = await fetchImages(searchValue, currentPage);
    if (response.totalHits === 0) {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      return;
    }
    currentTotalHits += response.hits.length;
    loadMoreBtn.disabled = false;
    loadMoreBtn.textContent = 'Load more';
    if (currentTotalHits === response.totalHits) {
       Notiflix.Notify.info('We are sorry, but you have reached the end of search results');
      loadMoreBtn.style.display = 'none';
    }
    return await onSearchRenderGallery(response);
   }
  catch (error) {
    console.log(error);
  }  
  };

function onSearchRenderGallery(response) {
 const markup = response.hits.map((item) => {
         return `<div class="photo-card">
         <a class="gallery-link" href="${item.largeImageURL}"><img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" /></a>
  <div class="info">
   <p class="info-item">
      <b>Likes: ${item.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${item.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${item.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${item.downloads}</b>
    </p>
  </div>
</div>`
            }
            ).join('');
          galleryContainer.insertAdjacentHTML('beforeend', markup);
          lightbox.refresh();
};