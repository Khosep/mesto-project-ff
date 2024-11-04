import {openPopup} from './modal.js';

const cardTemplate = document.querySelector('#card-template').content;

// Функция для создания и добавления карточки
// card = {'name': ..., 'link': ...}
function createCard (card, deleteCardFunc, openImageFunc, clickLikeFunc) {
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const cardDeleteButton = cardElement.querySelector('.card__delete-button');
    const cardLikeButton = cardElement.querySelector('.card__like-button');

    cardImage.src = card.link;
    cardImage.alt = card.name;
    cardTitle.textContent = card.name;

    cardDeleteButton.addEventListener('click', () => deleteCardFunc(cardElement));
    cardImage.addEventListener('click', () => openImageFunc(card));
    cardLikeButton.addEventListener('click', () => clickLikeFunc(cardLikeButton));

    return cardElement;
}

// ФУНКЦИИ, СВЯЗАННЫЕ С КАРТОЧКОЙ (ПЕРЕДАЮТСЯ В createCard)

// 1. Обрабатываем клик по delete-кнопке (передается в функцию createCard)
const deleteCard = (cardElement) => cardElement.remove();

// 2. Обрабатываем клик по like-кнопке (передается в функцию createCard)
function handleLikeClick(likeButton) {
    const classes = likeButton.classList;
    classes.toggle('card__like-button_is-active');
}

// 3. Обрабатываем открытие попапа с картинкой (передается в функцию createCard)
function handleOpenImagePopup(card) {
    const imagePopup = document.querySelector('.popup__image');
    const titlePopup = document.querySelector('.popup__caption');
    imagePopup.src = card.link;
    imagePopup.alt = titlePopup.textContent = card.name;
    openPopup(document.querySelector('.popup_type_image'));
}

// Создаем partial функцию
function createPartialCreateCard(deleteCardFunc, openImageFunc, clickLikeFunc) {
    return function(card) {
        return createCard (card, deleteCardFunc, openImageFunc, clickLikeFunc)
    };
}
// Задаем постоянные (неизменяемые) параметры для partial функции создания карточки
const partialCreateCard = createPartialCreateCard(deleteCard, handleOpenImagePopup, handleLikeClick);

export {partialCreateCard};
