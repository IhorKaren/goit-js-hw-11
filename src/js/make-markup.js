export default function makeGalleryUI(photos) {
  const galleryEl = document.querySelector('.gallery');
  galleryEl.innerHTML = ''

  if (photos.length === 0) {
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  const markup = photos
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes ${likes}</b>
            </p>
            <p class="info-item">
              <b>Views ${views}</b>
            </p>
            <p class="info-item">
              <b>Comments ${comments}</b>
            </p>
            <p class="info-item">
              <b>Downloads ${downloads}</b>
            </p>
          </div>
        </div>`;
      }
    )
    .join('');
  return galleryEl.insertAdjacentHTML('afterbegin', markup);
}
