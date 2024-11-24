import { deleteCardAPI, addLikeAPI, deleteLikeAPI } from './api.js';

const cardTemplate = document.querySelector('#card-template').content;

// Функция для создания и добавления карточки
// card - объект со свойствами 'id_, 'name', 'link', likes, 'owner', 'createdAt'
function createCard(
  card,
  profileID,
  deleteCardFunc,
  openImageFunc,
  clickLikeFunc
) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');
  const cardLikeButton = cardElement.querySelector('.card__like-button');
  const cardLikeCounter = cardElement.querySelector('.card__like-counter');

  cardImage.src = card.link;
  cardImage.alt = card.name;
  cardTitle.textContent = card.name;
  cardLikeCounter.textContent = card.likes.length;
  // Кнопка удаления и обработка этой кнопки - только на свои карточки
  if (card.owner._id === profileID) {
    cardDeleteButton.addEventListener('click', () =>
      deleteCardFunc(cardElement, card._id, deleteCardAPI)
    );
  } else {
    cardDeleteButton.remove();
  }
  // Помечаем свои лайки цветом
  if (card.likes.some((obj) => obj._id === profileID)) {
    cardLikeButton.classList.add('card__like-button_is-active');
  }
  cardImage.addEventListener('click', () => openImageFunc(card));
  cardLikeButton.addEventListener('click', () =>
    clickLikeFunc(
      cardLikeButton,
      card._id,
      cardLikeCounter,
      addLikeAPI,
      deleteLikeAPI
    )
  );

  return cardElement;
}

// ФУНКЦИИ, СВЯЗАННЫЕ С КАРТОЧКОЙ (ПЕРЕДАЮТСЯ В createCard)

// 1. Обрабатывает клик по delete-кнопке (передается в функцию createCard)
const deleteCard = async (cardElement, cardID, deleteCardAPI) => {
  if (await deleteCardAPI(cardID)) {
    cardElement.remove();
  }
};

// 2. Обрабатывает клик по like-кнопке (передается в функцию createCard)
const handleLikeClick = async (
  likeButton,
  cardID,
  likeCounter,
  addLikeAPI,
  deleteLikeAPI
) => {
  const classes = likeButton.classList;
  const activeClass = 'card__like-button_is-active';
  classes.toggle(activeClass);
  const card = classes.contains(activeClass)
    ? await addLikeAPI(cardID)
    : await deleteLikeAPI(cardID);
  likeCounter.textContent = card.likes.length;
};

// 3. Обрабатываем открытие попапа с картинкой (передается в функцию createCard)
// СОГЛАСНО ЗАДАНИЮ, перенесена в index.js

// Создает partial функцию
function createPartialCreateCard(deleteCardFunc, openImageFunc, clickLikeFunc) {
  return function (card, profileID) {
    return createCard(
      card,
      profileID,
      deleteCardFunc,
      openImageFunc,
      clickLikeFunc
    );
  };
}

export { createPartialCreateCard, deleteCard, handleLikeClick };
