// @todo: Функция создания карточки
const createCard = (cardInfo, funcDelete, openImage, clickLike) => {
  // @todo: Темплейт карточки
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");

  cardImage.src = cardInfo.link;
  cardImage.alt = cardInfo.name;
  cardTitle.textContent = cardInfo.name;

  //обработчик на кнопку удаления
  deleteButton.addEventListener("click", (event) => {
    funcDelete(event.target.closest(".places__item"));
  });
  cardImage.addEventListener("click", (event) => openImage(event));
  likeButton.addEventListener("click", (event) => clickLike(event));
  return cardElement;
};

// @todo: Функция удаления карточки
const deleteCard = (cardItem) => {
  cardItem.remove();
};

export { createCard, deleteCard };
