import Notiflix from 'notiflix';

const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const button = document.querySelector('button');
const gallery = document.querySelector('.gallery');
const apiKey = '34999463-77daba834ec561a295c4940af';

form.addEventListener('submit', handleSubmit);

async function handleSubmit(event) {
  event.preventDefault();

  const searchQuery = event.target.searchQuery.value.trim();

  if (searchQuery === '') {
    return;
  }

  try {
    const images = await fetchImages(searchQuery);
    showImages(images);
  } catch (error) {
    console.error(error);
    showNotification('Sorry, there was an error. Please try again.');
  }
}

async function fetchImages(searchQuery) {
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const { hits } = await response.json();

  return hits;
}

function showImages(images) {
  gallery.innerHTML = '';

  if (images.length === 0) {
    showNotification(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  const cards = images.map(image => createCard(image));
  gallery.insertAdjacentHTML('beforeend', cards.join(''));
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

  return `
    <div class="photo-card">
      <img src="${encodeURI(webformatURL)}" alt="${encodeURI(
    tags
  )}" loading="lazy" data-source="${encodeURI(largeImageURL)}" />
      <div class="info">
        <p class="info-item">
          <b>Likes:</b> ${likes}
        </p>
        <p class="info-item">
          <b>Views:</b> ${views}
        </p>
        <p class="info-item">
          <b>Comments:</b> ${comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b> ${downloads}
        </p>
      </div>
    </div>
  `;
}

function showNotification(message) {
  Notiflix.Notify.failure(message, {
    position: 'center',
    timeout: 3000,
  });
}

form.style.display = 'flex';
form.style.backgroundColor = '#483D8B';
form.style.justifyContent = 'center';
form.style.alignItems = 'center';
form.style.height = '50px';
form.sttyle.position = 'fixed';
form.style.zIndex = '999';
input.style.display = 'inline-flex';
input.style.justifyContent = 'center';
input.style.alignItems = 'center';
input.style.height = '30px';
button.style.height = '30px';
gallery.style.marginTop = '50px';
