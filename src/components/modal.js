// слушатели popup.addEventListener... можно было бы добавить однажды (вне функции)
//  и потом не удалять их и не добавлять, поскольку они не сработают при закрытом модальном окне,
//  но по фэншую вроде как лучше их добавлять и удалять.


const openPopup = (popup) => {
    popup.classList.add('popup_is-opened');
    // Добавляем возможность закрыть разными способами модальные окна
    document.addEventListener('keydown', handleEscKeydownPopup);
    popup.addEventListener('click', handleOverlayClickPopup);
    popup.addEventListener('click', handleCloseButton);

}

const closePopup = (popup) => {
    popup.classList.remove('popup_is-opened');
    // Убираем возможность закрыть разными способами модальные окна
    document.removeEventListener('keydown', handleEscKeydownPopup);
    popup.removeEventListener('click', handleOverlayClickPopup);
    popup.removeEventListener('click', handleCloseButton);
}


// ОБРАБОТЧИКИ ЗАКРЫТИЯ МОДАЛЬНОГО ОКНА

// Обрабатываем нажатие клавиши 'Esc'
const handleEscKeydownPopup = (event) => {
    if (event.key === 'Escape') {
        closePopup(document.querySelector('.popup_is-opened'));
    }
};

// Обрабатываем нажатие за пределами модального окна
const handleOverlayClickPopup = (event) => {
    if (event.target.classList.contains('popup_is-opened')) {
        closePopup(event.target);
    }
};

// Обрабатываем клик на кнопку закрытия окна (крестик в правом верхнем углу)
const handleCloseButton = (event) => {
    if (event.target.classList.contains('popup__close')) {
        closePopup(event.currentTarget);
    }
};

export {openPopup, closePopup};
