import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import makeGalleryItem from './js/makeGalleryItem';

const API_KEY = '34207021-c15ce293e39f116dd33171e61';
const URL = 'https://pixabay.com/api/';

const refs = {
  formEl: document.querySelector('.search-form'),
  buttonEl: document.querySelector('[type="submit"]'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreBtnEl: document.querySelector('.load-button'),
};

refs.formEl.addEventListener('submit', handleFormSubmit);
refs.loadMoreBtnEl.addEventListener('click', handleLodaMoreBtnClick);

let currentPage = 1;
let formValue = '';

async function handleFormSubmit(e) {
  e.preventDefault();
  clearMarkup();

  formValue = e.target.elements.searchQuery.value;

  if (formValue === '') {
    Notiflix.Notify.info('Please fill in the input field for image search');
    return;
  }

  currentPage = 1;
  refs.loadMoreBtnEl.classList.remove('hidden');
  await fetchImages(formValue);
  makeGalleryUI();
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
        per_page: 40,
        safesearch: true,
      },
    });

    makeGalleryUI(response.data.hits);
  } catch (error) {
    refs.loadMoreBtnEl.classList.add('hidden');
    Notiflix.Notify.info(
      `We're sorry, but you've reached the end of search results.`
    );
    console.log(error);
  }
}

function makeGalleryUI(photos) {
  if (!photos) {
    return;
  }

  if (photos.length === 0) {
    refs.loadMoreBtnEl.classList.add('hidden');
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  Notiflix.Notify.success(
    `Hooray! We found ${
      document.querySelectorAll('.photo-card').length
    } images.`
  );

  const markup = makeGalleryItem(photos);
  refs.galleryEl.insertAdjacentHTML('beforeend', markup);

  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 300,
  });
}

function clearMarkup() {
  refs.galleryEl.innerHTML = '';
}
