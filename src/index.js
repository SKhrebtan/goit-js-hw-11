import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

axios.defaults.headers.common["x-api-key"] = "38328283-3432d4ee282ba2126186b7660";

const API_KEY = '38328283-3432d4ee282ba2126186b7660';
const searchImgForm = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const spinner = document.querySelector('.spinner-border');

// axios.get(BASE_URL).then(console.log)
let searchValue = '';
let currentPage = 1;

const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

searchImgForm.addEventListener('submit', onFormSearch);
loadMoreBtn.addEventListener('click', onLoadMorePhotos);




function onFormSearch(e) {
  e.preventDefault();
    searchValue = e.currentTarget.elements.searchQuery.value;
  galleryContainer.innerHTML = '';
  loadMoreBtn.style.display = 'block';
  currentPage = 1;
    const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}&q=${searchValue}&image_type=photo&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`;
    fetch(BASE_URL)
    .then(response => response.json())
        .then(onSearchRenderGallery) 
};

function onLoadMorePhotos() {
  currentPage += 1;
   loadMoreBtn.disabled = true;
   loadMoreBtn.textContent = 'Loading...';
  spinner.classList.remove('is-hidden');
    const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}&q=${searchValue}&image_type=photo&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`;
    fetch(BASE_URL)
    .then(response => response.json())
        .then(onSearchRenderGallery )
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
           loadMoreBtn.disabled = false;
          loadMoreBtn.textContent = 'Load more';
          spinner.classList.add('visually-hidden');
           lightbox.refresh();
}