import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const button = document.querySelector('button');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
const apiKey = '34999463-77daba834ec561a295c4940af';
let currentPage = 1;
let searchQuery = '';

form.style.display = 'flex';
form.style.backgroundColor = '#483D8B';
form.style.justifyContent = 'center';
form.style.alignItems = 'center';
form.style.height = '50px';
form.style.position = 'fixed';
form.style.top = '-1px';
form.style.width = '100%';
form.style.zIndex = '999';
input.style.display = 'inline-flex';
input.style.justifyContent = 'center';
input.style.alignItems = 'center';
input.style.height = '30px';
button.style.height = '30px';

const lightbox = new SimpleLightbox('.gallery a', {
  closeText: 'x',
  navText: ['<', '>'],
});

form.addEventListener('submit', handleSubmit);
loadMoreButton.addEventListener('click', handleLoadMore);

async function handleSubmit(event) {
  event.preventDefault();

  searchQuery = event.target.searchQuery.value.trim();
  currentPage = 1;

  if (searchQuery === '') {
    return;
  }

  try {
    const images = await fetchImages(searchQuery);
    showImages(images);
    loadMoreButton.style.display = 'flex';
    loadMoreButton.style.justifyContent = 'center';
    loadMoreButton.style.marginTop = '50px';
    loadMoreButton.style.marginBottom = '50px';
    loadMoreButton.style.backgroundColor = '#483D8B';
    loadMoreButton.style.color = 'white';
    loadMoreButton.style.height = '50px';
    loadMoreButton.style.width = '150px';
    loadMoreButton.style.alignItems = 'center';
    loadMoreButton.style.marginLeft = 'auto';
    loadMoreButton.style.marginRight = 'auto';
  } catch (error) {
    console.error(error);
    showNotification('Sorry, there was an error. Please try again.');
  }
}

async function handleLoadMore() {
  try {
    const images = await fetchImages(searchQuery);
    showImages(images);
  } catch (error) {
    console.error(error);
    showNotification('Sorry, there was an error. Please try again.');
  }
}

async function fetchImages(searchQuery) {
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const { hits, totalHits } = await response.json();
  const totalPages = Math.ceil(totalHits / 40);

  if (currentPage === totalPages) {
    loadMoreButton.style.display = 'none';
    showNotification(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    currentPage += 1;
  }

  return hits;
}

function showImages(images) {
  if (currentPage === 1) {
    gallery.innerHTML = '';
  }

  if (images.length === 0 && currentPage === 1) {
    showNotification(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    loadMoreButton.style.display = 'none';
    return;
  } else if (images.length === 0) {
    return;
  }

  const cards = images.map(image => createCard(image));
  gallery.insertAdjacentHTML('beforeend', cards.join(''));

  lightbox.refresh();
}

function createCard(image) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = image;

  const card = document.createElement('div');
  card.classList.add('photo-card');

  card.innerHTML = `
  <a href="${encodeURI(largeImageURL)}">
    <img style="width: 420px; height: 280px;" src="${encodeURI(
      webformatURL
    )}" alt="${encodeURI(tags)}" loading="lazy" />
  </a>
    <div style="display: flex; width: 320px;" class="info">
      <p style="display: flex; flex-direction: column; align-content: center; padding: 10px;" class="info-item">
        <b style="display: flex; align-i: center">Likes:</b> ${likes}
      </p>
      <p style="display: flex; flex-direction: column; align-content: center; padding: 10px;" class="info-item">
        <b style="display: flex; align-content: center">Views:</b> ${views}
      </p>
      <p style="display: flex; flex-direction: column; align-content: center; padding: 10px;" class="info-item">
        <b style="display: flex; align-content: center">Comments:</b> ${comments}
      </p>
      <p style="display: flex; flex-direction: column; align-content: center; padding: 10px;" class="info-item">
        <b style="display: flex; justify-content: center;">Downloads:</b> ${downloads}
      </p>
    </div>
  `;

  const container = document.querySelector('.gallery');
  container.appendChild(card);
  container.style.marginTop = '60px';
  container.style.display = 'flex';
  container.style.flexDirection = 'row';
  container.style.flexWrap = 'wrap';
  container.style.justifyContent = 'center';
  card.style.boxShadow = '0px 0px 15px 0px rgba(66, 68, 90, 0.59)';
  card.style.width = '420px';
}

function showNotification(message) {
  Notiflix.Notify.failure(message, {
    position: 'center',
    timeout: 3000,
  });
}
