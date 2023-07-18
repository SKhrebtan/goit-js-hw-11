import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

axios.defaults.headers.common["x-api-key"] = "38328283-3432d4ee282ba2126186b7660";
const API_KEY = '38328283-3432d4ee282ba2126186b7660';

const searchImgForm = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');
// axios.get(BASE_URL).then(console.log)
searchImgForm.addEventListener('submit', onFormSearch);

function onFormSearch(e) {
    e.preventDefault();
    const searchRequest = e.currentTarget.elements.searchQuery.value;
    const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}&q=${searchRequest}&image_type=photo&image_type=photo&orientation=horizontal&safesearch=true`;
    fetch(BASE_URL)
    .then(response => response.json())
        .then(response => {
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
            galleryContainer.innerHTML = markup;


    })
}

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});
