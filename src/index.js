import "./pages/index.css";
import { initialCards } from "./components/cards.js";
import { createCard, onDeleteCard, onLikeCard } from "./components/card.js";
import {
  openModal,
  closeModal,
  createEventListeners,
} from "./components/modal.js";
import { enableValidation, clearValidation} from "./components/validation.js";

// DOM узлы, карточки
const places = document.querySelector(".places");
const placesList = places.querySelector(".places__list");

//DOM узлы кнопки открытия
const buttonAddCard = document.querySelector(".profile__add-button");
const buttonEditProfile = document.querySelector(".profile__edit-button");

//DOM узлы popups
const popupNewCard = document.querySelector(".popup_type_new-card");
const popupEditProfile = document.querySelector(".popup_type_edit");
const popupImage = document.querySelector(".popup_type_image");

//DOM узлы для редактирования профиля
const formEditProfile = document.forms["edit-profile"];
const nameInput = formEditProfile.elements.name;
const jobInput = formEditProfile.elements.description;

//DOM узлы для добавления карточки
const formCreateCard = document.forms["new-place"];
const cardNameInput = formCreateCard.elements["place-name"];
const cardUrlInput = formCreateCard.elements.link;

//DOM узел для отображения картинки в попап
const imageInPopupImage = popupImage.querySelector(".popup__image");

//Объект для валидаций
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

//функция заполнения попапа картинки данными
const onOpenPreview = (cardInfo) => {
  imageInPopupImage.src = cardInfo.link;
  imageInPopupImage.alt = cardInfo.name;
  popupImage.querySelector(".popup__caption").textContent = cardInfo.name;
  openModal(popupImage);
};

// Обработчик «отправки» формы
const onEditProfileFormSubmit = (event) => {
  event.preventDefault();

  // Получаем значения полей jobInput и nameInput из свойства value
  const nameValue = nameInput.value;
  const jobValue = jobInput.value;

  // Выбираем элементы, куда должны быть вставлены значения полей
  const profileTitleElement = document.querySelector(".profile__title");
  const profileJobElement = document.querySelector(".profile__description");

  // Вставляем новые значения
  profileTitleElement.textContent = nameValue;
  profileJobElement.textContent = jobValue;

  closeModal(popupEditProfile);
};

const onCreateCardFormSubmit = (event) => {
  event.preventDefault();

  // Получаем значения полей cardNameInput и cardUrlInput из свойства value
  let cardInfo = {};
  cardInfo.name = cardNameInput.value;
  cardInfo.link = cardUrlInput.value;

  const newCard = createCard(cardInfo, onDeleteCard, onOpenPreview, onLikeCard);
  placesList.prepend(newCard);

  closeModal(popupNewCard);

  //clearValidation(formCreateCard, validationConfig);
};

// Вывести карточки на страницу
initialCards.forEach((item) => {
  let newCard = createCard(item, onDeleteCard, onOpenPreview, onLikeCard);
  placesList.append(newCard);
});

//Вешаем слушателей на попапы
createEventListeners(popupEditProfile);
createEventListeners(popupNewCard);
createEventListeners(popupImage);

buttonAddCard.addEventListener("click", () => {
  formCreateCard.reset();
  clearValidation(formCreateCard, validationConfig);

  openModal(popupNewCard);
});

buttonEditProfile.addEventListener("click", () => {
  // Выбираем элементы, откуда возьмем значения полей
  const profileTitleElement = document.querySelector(".profile__title");
  const profileJobElement = document.querySelector(".profile__description");

  nameInput.value = profileTitleElement.textContent;
  jobInput.value = profileJobElement.textContent;
  
  clearValidation(formEditProfile, validationConfig);

  openModal(popupEditProfile);
});

formEditProfile.addEventListener("submit", onEditProfileFormSubmit);
formCreateCard.addEventListener("submit", onCreateCardFormSubmit);

// включение валидации вызовом enableValidation
// параметром передаются настройки валидации
enableValidation(validationConfig);