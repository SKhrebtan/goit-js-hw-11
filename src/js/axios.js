import axios from 'axios';

export default async function fetchImages(searchValue, page) {
  const url = 'https://pixabay.com/api/';
  const API_KEY = '38328283-3432d4ee282ba2126186b7660';
  const searchFilter = `?key=${API_KEY}&q=${searchValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  return await axios.get(`${url}${searchFilter}`).then(response => response.data);
}