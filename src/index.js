import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import makeGalleryItem from './js/makeGalleryItem';
import fetchImages from './js/fetchImages';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 300,
})

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

async function handleFormSubmit(e) {
  e.preventDefault();
  clearMarkup();

  formValue = e.target.elements.searchQuery.value.trim();

  if (!formValue) {
    hideLoadMoreBtn()
    Notiflix.Notify.info('Please fill in the input field for image search');
    return;
  }

  currentPage = 1;

  try {
    refs.loadMoreBtnEl.classList.remove('hidden');
    const response = await fetchImages(formValue, currentPage);
    makeGalleryUI(response);
  } catch (error) {
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

async function handleLoadMoreBtnClick() {
  currentPage += 1;
  try {
    const response = await fetchImages(formValue, currentPage);
    makeGalleryUI(response);
    smoothScroll();
  } catch (error) {
    hideLoadMoreBtn();
    Notiflix.Notify.info(
      `We're sorry, but you've reached the end of search results.`
    );
  }
}

function makeGalleryUI(photos) {
  if (!photos) {
    hideLoadMoreBtn();
    return;
  }

  if (photos.length < 40) {
    hideLoadMoreBtn();
  }

  if (photos.length === 0) {
    hideLoadMoreBtn();
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

  lightbox.refresh()
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function clearMarkup() {
  refs.galleryEl.innerHTML = '';
}

function hideLoadMoreBtn() {
  refs.loadMoreBtnEl.classList.add('hidden');
}