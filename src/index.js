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
refs.loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);

let currentPage = 1;
let formValue = '';
let lightbox = null;

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
  const response = await fetchImages(formValue);
  makeGalleryUI(response);
}

async function handleLoadMoreBtnClick() {
  currentPage += 1;
  const response = await fetchImages(formValue);
  makeGalleryUI(response);
  smoothScroll()
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

    return response.data.hits;
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

  const markup = makeGalleryItem(photos);
  refs.galleryEl.insertAdjacentHTML('beforeend', markup);

  Notiflix.Notify.success(
    `Hooray! We found ${
      document.querySelectorAll('.photo-card').length
    } images.`
  );

  modalSimpleLightBox()
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}

function clearMarkup() {
  refs.galleryEl.innerHTML = '';
}

function modalSimpleLightBox() {
  // Fix double backdrop
  if (lightbox) {
    lightbox.destroy();
    lightbox = null;
  }

 return lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 300,
  });
}
