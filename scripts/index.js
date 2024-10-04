const cardTemplate = document.querySelector('#card-template').content;
const placeList = document.querySelector('.places__list');

// Клонируем, находим там нужные элементы, заполняем контентом и вешаем обработчик на кнопку
function createCard (card, deleteCardFunc) {
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const cardDeleteButton = cardElement.querySelector('.card__delete-button');

    cardImage.src = card.link;
    cardImage.alt = card.name;
    cardTitle.textContent = card.name;

    cardDeleteButton.addEventListener('click', () => deleteCardFunc(cardElement));

    return cardElement;
}

const deleteCard = (cardElement) => cardElement.remove();

initialCards.forEach((item) => placeList.append(createCard(item, deleteCard)));
