import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import makeGalleryItem from './js/make-markup';

const API_KEY = '34207021-c15ce293e39f116dd33171e61';
const URL = 'https://pixabay.com/api/';

const refs = {
  formEl: document.querySelector('.search-form'),
  buttonEl: document.querySelector('[type="submit"]'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreBtnEl: document.querySelector('.load-button'),
};

let currentPage = 1;
let formValue = '';
const perPage = 40;

refs.formEl.addEventListener('submit', handleFormSubmit);
refs.loadMoreBtnEl.addEventListener('click', handleLodaMoreBtnClick);

async function handleFormSubmit(e) {
  e.preventDefault();

  formValue = e.target.elements.searchQuery.value;

  if (formValue === '') {
    Notiflix.Notify.info('Please fill in the input field for image search');
    return;
  }

  await fetchImages(formValue);
  makeGalleryUI();
  refs.loadMoreBtnEl.classList.remove('hidden');
  currentPage = 1;
  refs.galleryEl.innerHTML = '';
}

async function handleLodaMoreBtnClick(e) {
  currentPage += 1;
  await fetchImages(formValue);
  makeGalleryUI();
}

async function fetchImages(searchValue) {
  try {
    const response = await axios.get(`${URL}`, {
      params: {
        key: API_KEY,
        q: searchValue,
        image_type: 'photo',
        orientation: 'horizontal',
        page: currentPage,
        per_page: perPage,
        safesearch: true,
      },
    });

    makeGalleryUI(response.data.hits);
  } catch (error) {
    console.log(error);
  }
}

function makeGalleryUI(photos) {
  if (photos.length === 0) {
    refs.loadMoreBtnEl.classList.add('hidden');
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    return;
  }

  const markup = makeGalleryItem(photos);

  refs.galleryEl.insertAdjacentHTML('beforeend', markup);
  galleryModalWindow();
  Notiflix.Notify.success(`Hooray! We found ${document.querySelectorAll('.photo-card').length} images.`);
}

function galleryModalWindow() {
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 300,
  });
}