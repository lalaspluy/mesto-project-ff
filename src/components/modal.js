//функция закрытия попап по клавише Esc
const handleKeyEscape = (event) => {
  if (event.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened"); // находим открытый попап
    if (openedPopup) closeModal(openedPopup);
  }
};

export const createEventListeners = (popup) => {
  // Слушатель на закрытие popup на крестик
  popup.querySelector(".popup__close").addEventListener("click", () => {
    closeModal(popup);
  });

  // Слушатель на клик по оверлею
  popup.addEventListener("mousedown", (event) => {
    if (event.target.classList.contains("popup")) {
      closeModal(popup);
    }
  });
};

export const openModal = (popup) => {
  popup.classList.add("popup_is-opened");

  //добавляем в слушатель клавиатуры ссылку на функцию закрытия попап по клавише Esc
  document.addEventListener("keydown", handleKeyEscape);
};

export const closeModal = (popup) => {
  popup.classList.remove("popup_is-opened");

  //удаляем слушатель на клавишу Esc
  document.removeEventListener("keydown", handleKeyEscape);
};
