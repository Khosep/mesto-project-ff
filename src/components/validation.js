const enableValidation = (settingsObj) => {
  const formElementList = document.querySelectorAll(settingsObj.formSelector);
  formElementList.forEach((formElement) =>
    setEventListeners(formElement, settingsObj)
  );
};

// Устанавливает кастомное сообщение об ошибке (невалидность), если нет соответсnвия паттерну (заданному в html);
//  иначе - назначается стандартное сообщение (невалидность по кастомной ошибке снимается).
const setErrorMessage = (inputElement) => {
  if (inputElement.validity.patternMismatch) {
    // кастомное сообщение об ошибке из атрибута data-error-message (camelCase: errorMessage)
    // и установим тем самым inputElement.validity.customError = true
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    // если передать пустую строку, то 1)будут доступны стандартные браузерные сообщения
    // 2)кроме того, вернем/подтвердим customError = false (открывая путь к валидности)
    inputElement.setCustomValidity('');
  }
};

// Если невалидный ввод на элементе, то отображает ошибку, иначе - скрывает ошибку.
const toggleVisibilityInputError = (formElement, inputElement, settingsObj) => {
  setErrorMessage(inputElement);
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, settingsObj);
  } else {
    hideInputError(formElement, inputElement, settingsObj);
  }
};

// Показывает сообщение об ошибке
const showInputError = (formElement, inputElement, settingsObj) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}_error`);
  // Добавляем класс ошибки (подчеркивает красным поле ввода)
  inputElement.classList.add(settingsObj.inputErrorClass);
  // Показываем сообщение об ошибке
  errorElement.textContent = inputElement.validationMessage;
};

// Скрывает сообщение об ошибке (удаляеет оформление для ошибки и текст ошибки)
const hideInputError = (formElement, inputElement, settingsObj) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}_error`);
  // Удаляем класс ошибки (снимаем подчеркивание поля красным)
  inputElement.classList.remove(settingsObj.inputErrorClass);
  errorElement.textContent = '';
  inputElement.setCustomValidity('');
};

// Устанавливает обработчики событий 'input' для всех полей формы
const setEventListeners = (formElement, settingsObj) => {
  const inputList = Array.from(
    formElement.querySelectorAll(settingsObj.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    settingsObj.submitButtonSelector
  );
  // Вызываем toggleButtonState, чтобы кнопка блокировалась сразу - до ввода, а не только при неправильных данных.
  toggleButtonState(inputList, buttonElement, settingsObj);
  // Каждому полю добавляем обработчик события 'input'
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      // Показываем ошибку, если она есть
      toggleVisibilityInputError(formElement, inputElement, settingsObj);
      // Вызываем toggleButtonState, чтобы кнопка разблокировалась, если ввод валиден
      toggleButtonState(inputList, buttonElement, settingsObj);
    });
  });
};

// Возвращает true, если хотя бы одно поле невалидно; false, если все валидны.
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

// Если есть хотя бы одно невалидное поле, то отключает кнопку, иначе - делает кнопку активной
const toggleButtonState = (inputList, buttonElement, settingsObj) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(settingsObj.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(settingsObj.inactiveButtonClass);
  }
};

// Очищает ошибки валидации формы и делает кнопку неактивной
const clearValidation = (formElement, settingsObj) => {
  const inputList = Array.from(
    formElement.querySelectorAll(settingsObj.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    settingsObj.submitButtonSelector
  );
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, settingsObj);
  });
  toggleButtonState(inputList, buttonElement, settingsObj);
};

export { enableValidation, clearValidation };
