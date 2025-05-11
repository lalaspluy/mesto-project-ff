import "./index.css";
import { initialCards } from "./components/cards.js";
import { createCard, deleteCard } from "./components/card.js";
import {
  openModal,
  closeModal,
  createEventListeners,
} from "./components/modal.js";

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
const formEditProfile = popupEditProfile.querySelector(".popup__form");
const nameInput = formEditProfile.querySelector(".popup__input_type_name");
const jobInput = formEditProfile.querySelector(
  ".popup__input_type_description"
);

//DOM узлы для добавления карточки
const formCreateCard = popupNewCard.querySelector(".popup__form");
const cardNameInput = formCreateCard.querySelector(
  ".popup__input_type_card-name"
);
const cardUrlInput = formCreateCard.querySelector(".popup__input_type_url");

//DOM узлы для отображения картинки в попап
const imageInPopupImage = popupImage.querySelector(".popup__image");

//функция заполнения попапа картинки данными
const openImage = (event) => {
  const image = event.target;
  const card = image.closest(".card");
  const title = card.querySelector(".card__title").textContent;

  //заполняем popupImage данными из карточки
  imageInPopupImage.src = image.src;
  imageInPopupImage.alt = image.alt;
  popupImage.querySelector(".popup__caption").textContent = title;
  openModal(popupImage);
};

const clickLike = (event) => {
  const like = event.target;
  like.classList.toggle("card__like-button_is-active");
};

// Обработчик «отправки» формы
const handleFormSubmit = (event) => {
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

const handleFormCreateSubmit = (event) => {
  event.preventDefault();

  // Получаем значения полей cardNameInput и cardUrlInput из свойства value
  let cardInfo = {};
  cardInfo.name = cardNameInput.value;
  cardInfo.link = cardUrlInput.value;

  const newCard = createCard(cardInfo, deleteCard, openImage, clickLike);
  placesList.prepend(newCard);

  closeModal(popupNewCard);
};

// Вывести карточки на страницу
initialCards.forEach((item) => {
  let newCard = createCard(item, deleteCard, openImage, clickLike);
  placesList.append(newCard);
});

//Вешаем слушателей на попапы
createEventListeners(popupEditProfile);
createEventListeners(popupNewCard);
createEventListeners(popupImage);

buttonAddCard.addEventListener("click", () => {
  cardNameInput.value = "";
  cardUrlInput.value = "";

  openModal(popupNewCard);
});

buttonEditProfile.addEventListener("click", () => {
  // Выбираем элементы, откуда возьмем значения полей
  const profileTitleElement = document.querySelector(".profile__title");
  const profileJobElement = document.querySelector(".profile__description");

  nameInput.value = profileTitleElement.textContent;
  jobInput.value = profileJobElement.textContent;

  openModal(popupEditProfile);
});

formEditProfile.addEventListener("submit", handleFormSubmit);
formCreateCard.addEventListener("submit", handleFormCreateSubmit);
