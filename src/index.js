import "./pages/index.css";
import { createCard } from "./components/card.js";
import {
  openModal,
  closeModal,
  createEventListeners,
} from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import {
  getCards,
  getProfile,
  postCard,
  editProfile,
  likeCardApi,
  unlikeCardApi,
  deleteCardApi,
  editAvatar,
} from "./components/api.js";

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
const submitEditProfile = formEditProfile.querySelector(".popup__button");

//DOM узлы для добавления карточки
const formCreateCard = document.forms["new-place"];
const cardNameInput = formCreateCard.elements["place-name"];
const cardUrlInput = formCreateCard.elements.link;
const submitCreateCard = formCreateCard.querySelector(".popup__button");

//DOM узел для отображения картинки в попап
const imageInPopupImage = popupImage.querySelector(".popup__image");

//DOM узлы для редактирования аватара
const popupAvatar = document.querySelector(".popup_type_edit-avatar");
const formEditAvatar = document.forms["new-avatar"];
const avatarUrlInput = formEditAvatar.elements["avatar-link"];
const submitEditAvatar = formEditAvatar.querySelector(".popup__button");

// Объект для валидации
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

let userId;

const promises = [getCards(), getProfile()];
// функция заполнения попапа картинки данными
const onOpenPreview = (cardInfo) => {
  imageInPopupImage.src = cardInfo.link;
  imageInPopupImage.alt = cardInfo.name;
  popupImage.querySelector(".popup__caption").textContent = cardInfo.name;
  openModal(popupImage);
};

function handleDeleteCard(cardElement) {
  const cardId = cardElement.dataset.cardId;

  deleteCardApi(cardId)
    .then(() => {
      //Удаляем карточку из DOM
      cardElement.remove();
    })
    .catch((err) => {
      console.error(err);
    });
}

function handleCardLike(event) {
  const likeButton = event.target;
  const cardElement = likeButton.closest(".card");
  const cardId = cardElement.dataset.cardId;
  const likeCounter = cardElement.querySelector(".card__like-number");

  //Проверяем состояние лайка
  const isLiked = likeButton.classList.contains("card__like-button_is-active");

  //Выбираем нужный метод API
  const apiMethod = isLiked ? unlikeCardApi : likeCardApi;

  // Блокируем кнопку на время запроса
  likeButton.disabled = true;

  apiMethod(cardId)
    .then((updatedCard) => {
      //Обновляем счетчик
      likeCounter.textContent = updatedCard.likes.length;

      // Обновляем состояние кнопки
      likeButton.classList.toggle("card__like-button_is-active");
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      //Разблокируем кнопку лайка
      likeButton.disabled = false;
    });
}

//Состояние кнопки для интерфейса
const setButtonState = (isLoading, button) => {
  button.textContent = isLoading ? "Сохранение..." : "Сохранить";
  button.disabled = isLoading;
};

// Обработчик «отправки» формы
const onEditProfileFormSubmit = (event) => {
  event.preventDefault();

  // Получаем значения полей jobInput и nameInput из свойства value
  let profileInfo = {
    name: nameInput.value,
    about: jobInput.value,
  };

  setButtonState(true, submitEditProfile);

  editProfile(profileInfo)
    .then(() => {
      // При успешном запросе вставляем новые значения в поле
      profileName.textContent = nameInput.value;
      profileAbout.textContent = jobInput.value;

      closeModal(popupEditProfile);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      // Восстанавливаем кнопку
      setButtonState(false, submitEditProfile);
    });
};

const onCreateCardFormSubmit = (event) => {
  event.preventDefault();

  // Получаем значения полей cardNameInput и cardUrlInput из свойства value
  let cardInfo = {
    name: cardNameInput.value,
    link: cardUrlInput.value,
  };

  setButtonState(true, submitCreateCard);

  postCard(cardInfo)
    .then((cardData) => {
      //если запрос успешный, добавляем карточку
      cardData.isMine = true;
      cardData.isLiked = false;
      cardData.numberLikes = 0;

      const newCard = createCard(
        cardData,
        handleDeleteCard,
        onOpenPreview,
        handleCardLike
      );
      placesList.prepend(newCard);
      closeModal(popupNewCard);
      formCreateCard.reset();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      // Восстанавливаем кнопку
      setButtonState(false, submitCreateCard);
    });
};

const onEditAvatarFormSubmit = (event) => {
  event.preventDefault();

  //Меняем состояние кнопки на время запроса
  setButtonState(true, submitEditAvatar);
  //Получаем URL нового аватара
  const avatarUrl = avatarUrlInput.value;

  editAvatar({ avatar: avatarUrl })
    .then((userData) => {
      // Обновляем аватар на странице
      profileImage.style.backgroundImage = `url('${userData.avatar}')`;

      closeModal(popupAvatar);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      // Восстанавливаем кнопку
      setButtonState(false, submitEditAvatar);
    });
};

Promise.all(promises)
  .then(([cardsData, userData]) => {
    userId = userData._id;
    //выводим карточки
    cardsData.forEach((item) => {
      //количество лайков карточки равно длине массива likes
      item.numberLikes = item.likes.length;
      if (item.owner._id === userId) {
        item.isMine = true;
      } else {
        item.isMine = false;
      }
      //проверяем, ставил ли юзер лайк данной карточке
      if (item.numberLikes > 0) {
        item.isLiked = item.likes.some((obj) => obj._id === userId);
      } else {
        item.isLiked = false;
      }

      let newCard = createCard(
        item,
        handleDeleteCard,
        onOpenPreview,
        handleCardLike
      );
      placesList.append(newCard);
    });

    //заполняем значениями с сервера профиль пользователя
    profileName.textContent = userData.name;
    profileAbout.textContent = userData.about;
    profileImage.style.backgroundImage = `url('${userData.avatar}')`;

    // Вешаем слушателей на попапы
    createEventListeners(popupEditProfile);
    createEventListeners(popupNewCard);
    createEventListeners(popupImage);
    createEventListeners(popupAvatar);

    buttonAddCard.addEventListener("click", () => {
      formCreateCard.reset();
      clearValidation(formCreateCard, validationConfig);

      openModal(popupNewCard);
    });

    buttonEditProfile.addEventListener("click", () => {
      nameInput.value = profileName.textContent;
      jobInput.value = profileAbout.textContent;

      clearValidation(formEditProfile, validationConfig);

      openModal(popupEditProfile);
    });

    profileImage.addEventListener("click", () => {
      // Очищаем форму и сбрасываем ошибки валидации
      formEditAvatar.reset();
      clearValidation(formEditAvatar, validationConfig);

      // Открываем попап
      openModal(popupAvatar);
    });

    formEditProfile.addEventListener("submit", onEditProfileFormSubmit);
    formCreateCard.addEventListener("submit", onCreateCardFormSubmit);
    formEditAvatar.addEventListener("submit", onEditAvatarFormSubmit);
    // включение валидации
    // параметром передаем настройки валидации
    enableValidation(validationConfig);
  })
  .catch((err) => {
    console.log(err); // выводим ошибку в консоль, если хотя бы один из промисов с ошибкой
  });
