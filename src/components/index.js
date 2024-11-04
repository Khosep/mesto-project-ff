import '../pages/index.css'; // для webpack (и убрать подключение css в index.html)

import {partialCreateCard} from './card.js';
import {openPopup, closePopup} from './modal.js';
import {initialCards} from './cards.js';

const placeList = document.querySelector('.places__list');

// Первоначальная загрузка карточек
initialCards.forEach((card) => placeList.append(partialCreateCard(card)));

// Кнопки
const editProfileButton = document.querySelector('.profile__edit-button');
const addCartButton = document.querySelector('.profile__add-button');

// Модальные окна
const editProfilePopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
//const openImagePopup = document.querySelector('.popup_type_image');

// Переменные профиля
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');


// РАБОТА С ФОРМАМИ

// Переменные для формы редактирования профиля
const profileForm = document.forms['edit-profile'];
const profileNameField= profileForm.name;
const profileDescriptionField= profileForm.description;
// Переменные для формы создания карточки
const cardForm = document.forms['new-place'];
const cardNameField= cardForm['place-name'];
const cardLinkField= cardForm.link;

// Заполняем форму редактирования профиля текущими значениями
const fillProfileForm = () => {
    profileNameField.value = profileTitle.textContent;
    profileDescriptionField.value = profileDescription.textContent;
}

// Обрабатываем отправку формы редактирования профиля
const handleProfileFormSubmit = (event) => {
    event.preventDefault();
    profileTitle.textContent = profileNameField.value;
    profileDescription.textContent = profileDescriptionField.value;
    closePopup(editProfilePopup);
}

// Обрабатываем отправку формы создания карточки
const handleCardFormSubmit = async (event) => {
    event.preventDefault();
    const card = {name: cardNameField.value, link: cardLinkField.value};
    placeList.prepend(partialCreateCard(card));
    closePopup(document.querySelector('.popup_type_new-card'));
    cardForm.reset() // очищаем форму
}


// ОБРАБОТЧИКИ СОБЫТИЙ

// Обработчик клика на кнопку открытия модального окна для редактирования профиля
editProfileButton.addEventListener('click', () => {
    fillProfileForm();
    openPopup(editProfilePopup);
});

// Обработчик события клика на кнопку открытия модального окна для добавления карточки
addCartButton.addEventListener('click', () => openPopup(addCardPopup));

// Обработчик события submit при редактировании профиля
profileForm.addEventListener('submit', handleProfileFormSubmit);

// Обработчик события submit при добавлении новой карточки
cardForm.addEventListener('submit', handleCardFormSubmit);

// Обработчики событий на действия внутри карточек (лайк, удаление, открытие картинки)
//  находятся внутри функции createCard (см. модуль card.js)
