import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import makeGalleryUI from './js/make-markup'

const API_KEY = '34207021-c15ce293e39f116dd33171e61';
const URL = 'https://pixabay.com/api/';

const refs = {
  formEl: document.querySelector('.search-form'),
  buttonEl: document.querySelector('[type="submit"]'),
};

refs.formEl.addEventListener('submit', handleFormSubmit);

function handleFormSubmit(e) {
  e.preventDefault();

  const formValue = e.target.elements.searchQuery.value.trim();

  if (formValue === '') {
    Notiflix.Notify.info('Please fill in the input field for image search');
    return;
  }

  fetchImages(formValue).then(makeGalleryUI);
  
}

async function fetchImages(searchValue) {
  const response = await axios.get(`${URL}`, {
    params: {
      key: API_KEY,
      q: searchValue,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  });

  return response.data.hits;
}