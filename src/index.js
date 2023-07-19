import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import fetchImages from './js/axios';

const searchImgForm = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const spinner = document.querySelector('.spinner-border');


let searchValue = '';
let currentPage = 1;

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
  const response = await fetchImages(searchValue, currentPage)
  return await onSearchRenderGallery(response);
};

async function onLoadMorePhotos() {
   currentPage += 1;
   loadMoreBtn.disabled = true;
   loadMoreBtn.textContent = 'Loading...';
  const response = await fetchImages(searchValue, currentPage);
  return await onSearchRenderGallery(response);
}

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
          loadMoreBtn.style.display = 'block';
          loadMoreBtn.disabled = false;
          loadMoreBtn.textContent = 'Load more';
          lightbox.refresh();
}