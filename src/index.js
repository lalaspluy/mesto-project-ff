import "./pages/index.css";
import { createCard, onDeleteCard, onLikeCard } from "./components/card.js";
import {
  openModal,
  closeModal,
  createEventListeners,
} from "./components/modal.js";
import { enableValidation, clearValidation} from "./components/validation.js";
import { getCards, getProfile, postCard, editProfile } from "./components/api.js";

// DOM узлы карточек, профиля
const places = document.querySelector(".places");
const placesList = places.querySelector(".places__list");
const profileName = document.querySelector(".profile__title");
const profileAbout = document.querySelector(".profile__description");
const profileImage = document.querySelector(".profile__image");

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

// Объект для валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

const promises = [getCards(), getProfile()];
// функция заполнения попапа картинки данными
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
  //const profileTitleElement = profileName;
  //const profileJobElement = profileAbout;

  let profileInfo = {};
  profileInfo.name = nameValue;
  profileInfo.about = jobValue;

  editProfile(profileInfo)
  .then(() => {
    // При успешном запросе вставляем новые значения в поле
    profileName.textContent = nameValue;
    profileAbout.textContent = jobValue;
  })
  .catch((err) => {
    console.log(err); 
  });

  closeModal(popupEditProfile);
};

const onCreateCardFormSubmit = (event) => {
  event.preventDefault();

  // Получаем значения полей cardNameInput и cardUrlInput из свойства value
  let cardInfo = {};
  cardInfo.name = cardNameInput.value;
  cardInfo.link = cardUrlInput.value;
  
  postCard(cardInfo)
  .then(() => {
    const isMine = true;
    const isLiked = false;
    const newCard = createCard(cardInfo, onDeleteCard, onOpenPreview, onLikeCard, isMine, isLiked);
    placesList.prepend(newCard);
  })
  .catch((err) => {
    console.log(err); 
  });

  //const newCard = createCard(cardInfo, onDeleteCard, onOpenPreview, onLikeCard);
  //placesList.prepend(newCard);

  closeModal(popupNewCard);
}; 

Promise.all(promises)
  .then((results) => {
    //выводим карточки
    results[0].forEach((item) => {
      let isMine = false;
      let isLiked = false;
      if (item.owner._id === results[1]._id) {
        isMine = true;
      }
      console.log(isMine);
      //количество лайков карточки равно длине массива likes
      let numberLikes = item.likes.length;
      //проверяем, ставили ли мы лайк данной карточке
      if (numberLikes > 0) {
        isLiked = item.likes.some(obj => obj[_id] === results[1]._id);
        console.log(isLiked);
      }
      let newCard = createCard(item, onDeleteCard, onOpenPreview, onLikeCard, isMine, numberLikes, isLiked);
      placesList.append(newCard);
    });
    
    //заполняем значениями с сервера профиль пользователя
    profileName.textContent = results[1].name;
    profileAbout.textContent = results[1].about;
    profileImage.style.backgroundImage = `url('${results[1].avatar}')`;
  })
  .catch((err) => {
    console.log(err); // выводим ошибку в консоль
  }); 

// Вешаем слушателей на попапы
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
  //const profileTitleElement = document.querySelector(".profile__title");
  //const profileJobElement = document.querySelector(".profile__description");

  nameInput.value = profileName.textContent;
  jobInput.value = profileAbout.textContent;
  
  clearValidation(formEditProfile, validationConfig);

  openModal(popupEditProfile);
});

formEditProfile.addEventListener("submit", onEditProfileFormSubmit);
formCreateCard.addEventListener("submit", onCreateCardFormSubmit);

// включение валидации
// параметром передаем настройки валидации
enableValidation(validationConfig);