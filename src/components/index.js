import '../pages/index.css'; // для webpack (и убрать подключение css в index.html)
import {
  createPartialCreateCard,
  deleteCard,
  handleLikeClick,
} from './card.js';
import { openPopup, closePopup } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';
import {
  getAllDataAPI,
  editProfileDataAPI,
  createCardAPI,
  editAvatarAPI,
} from './api.js';

// Задаем постоянные (неизменяемые) параметры для partial функции создания карточки
const partialCreateCard = createPartialCreateCard(
  deleteCard,
  handleOpenImagePopup,
  handleLikeClick
);
// Место, куда вставляем карточки
const placeList = document.querySelector('.places__list');

// Кнопки
const editProfileButton = document.querySelector('.profile__edit-button');
const editAvatarButton = document.querySelector('.profile__image_button');
const addCartButton = document.querySelector('.profile__add-button');

// Модальные окна
const editProfilePopup = document.querySelector('.popup_type_edit');
const editAvatarPopup = document.querySelector('.popup_type_edit-avatar');
const addCardPopup = document.querySelector('.popup_type_new-card');
const openImagePopup = document.querySelector('.popup_type_image');

// Переменные профиля
const profileAvatar = document.querySelector('.profile__image');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
// Глобальная переменная (будет получена внутри функции)
let profileID;

// Переменные форм
// Переменные для формы редактирования профиля
const profileForm = document.forms['edit-profile'];
const profileNameField = profileForm.name;
const profileDescriptionField = profileForm.description;
// Переменные для формы редактирования профиля
const avatarForm = document.forms['edit-avatar'];
const avatarLinkField = avatarForm['avatar-link'];
// Переменные для формы создания карточки
const cardForm = document.forms['new-place'];
const cardNameField = cardForm['place-name'];
const cardLinkField = cardForm.link;

// Настройки валидации
const validationSettingsObj = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
};

// ФУНКЦИИ

// Заполняет форму редактирования профиля текущими значениями
const fillProfileForm = () => {
  profileNameField.value = profileTitle.textContent;
  profileDescriptionField.value = profileDescription.textContent;
};

// Обрабатывает отправку формы редактирования профиля (name и description)
const handleProfileFormSubmit = async (event) => {
  event.preventDefault();
  try {
    setLoadingStatus(editProfilePopup);
    const remoteProfileData = await editProfileDataAPI({
      name: profileNameField.value,
      about: profileDescriptionField.value,
    });
    placeProfileData(remoteProfileData, ['name', 'about']);
    closePopup(editProfilePopup);
  } catch (error) {
    console.error('Error in handleProfileFormSubmit', error);
  } finally {
    setLoadingStatus(editProfilePopup, false);
  }
};

// Обрабатывает отправку формы редактирования аватара
const handleAvatarFormSubmit = async (event) => {
  event.preventDefault();
  try {
    setLoadingStatus(editAvatarPopup);
    const remoteProfileData = await editAvatarAPI({
      avatar: avatarLinkField.value,
    });
    placeProfileData(remoteProfileData, ['avatar']);
    closePopup(editAvatarPopup);
  } catch (error) {
    console.error('Error in handleAvatarFormSubmit', error);
  } finally {
    setLoadingStatus(editAvatarPopup, false);
  }
};

// Обрабатывает отправку формы создания карточки
const handleCardFormSubmit = async (event) => {
  event.preventDefault();
  const card = { name: cardNameField.value, link: cardLinkField.value };
  try {
    setLoadingStatus(addCardPopup);
    const remoteNewCard = await createCardAPI(card);
    placeList.prepend(partialCreateCard(remoteNewCard, profileID));
    closePopup(document.querySelector('.popup_type_new-card'));
    cardForm.reset(); // очищаем форму
  } catch (error) {
    console.error('Error in handleCardFormSubmit', error);
  } finally {
    setLoadingStatus(addCardPopup, false);
  }
};

// Обрабатывает открытие попапа с картинкой (передается в функцию createCard)
function handleOpenImagePopup(card) {
  const imagePopup = document.querySelector('.popup__image');
  const titlePopup = document.querySelector('.popup__caption');
  imagePopup.src = card.link;
  imagePopup.alt = titlePopup.textContent = card.name;
  openPopup(openImagePopup);
}

// Загружает карточки на страницу
const placeCards = (cardsDataArray) => {
  cardsDataArray.forEach((card) =>
    placeList.append(partialCreateCard(card, profileID))
  );
};

// Загружает профиль на страницу
const placeProfileData = (
  ProfileDataObj,
  props = ['name', 'about', 'avatar']
) => {
  props.includes('name') && (profileTitle.textContent = ProfileDataObj.name);
  props.includes('about') &&
    (profileDescription.textContent = ProfileDataObj.about);
  props.includes('avatar') &&
    (profileAvatar.style.backgroundImage = `url('${ProfileDataObj.avatar}')`);
};

// Обрабатывает полученные с сервера данные и вставляет на страницу
const handleFetchedInintialData = async (promise) => {
  try {
    const [cardsData, ProfileObj] = await promise;
    // Записываем в глобальную переменную id профиля
    profileID = ProfileObj._id;
    const userID = ProfileObj._id;
    placeCards(cardsData);
    placeProfileData(ProfileObj);
  } catch (error) {
    console.error('Error in handleFetchedInintialData', error);
  }
};

// Устанавливает статус 'Сохранение...' на кнопке (по умолчанию), либо 'Сохранение' (если false)
function setLoadingStatus(popup, flag = true) {
  const popupButton = popup.querySelector('.popup__button');
  popupButton.textContent = flag ? 'Сохранение...' : 'Сохранить';
}

// ОБРАБОТЧИКИ СОБЫТИЙ

// Обработчик клика на кнопку открытия модального окна для редактирования профиля
editProfileButton.addEventListener('click', () => {
  fillProfileForm();
  clearValidation(editProfilePopup, validationSettingsObj);
  openPopup(editProfilePopup);
});

// Обработчик клика на кнопку открытия модального окна для редактирования аватара
editAvatarButton.addEventListener('click', () => {
  clearValidation(editAvatarPopup, validationSettingsObj);
  openPopup(editAvatarPopup);
});

// Обработчик события клика на кнопку открытия модального окна для добавления карточки
addCartButton.addEventListener('click', () => {
  clearValidation(addCardPopup, validationSettingsObj);
  openPopup(addCardPopup);
});

// Обработчик события submit при редактировании профиля
profileForm.addEventListener('submit', handleProfileFormSubmit);

// Обработчик события submit при редактировании аватара
avatarForm.addEventListener('submit', handleAvatarFormSubmit);

// Обработчик события submit при добавлении новой карточки
cardForm.addEventListener('submit', handleCardFormSubmit);

// Обработчики событий на действия внутри карточек (лайк, удаление, открытие картинки)
//  находятся внутри функции createCard (см. модуль card.js)

// ДЕЙСТВИЯ

//Получаем промис с данными карточек и профиля
const allDatapromise = getAllDataAPI();

//Обрабатываем полученные данные: загружаем на страницу (карточки и профиль)
handleFetchedInintialData(allDatapromise);

// Запускаем валидацию форм
enableValidation(validationSettingsObj);
