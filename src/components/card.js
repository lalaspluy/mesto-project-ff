// @todo: Функция создания карточки
const createCard = (cardInfo, onDeleteCard, onOpenPreview, onLikeCard) => {
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
    onDeleteCard(event.target.closest(".places__item"));
  });
  //cardImage.addEventListener("click", (event) => onOpenPreview(event));
  cardImage.addEventListener("click", () => onOpenPreview(cardInfo));
  likeButton.addEventListener("click", (event) => onLikeCard(event));
  return cardElement;
};

// @todo: Функция удаления карточки
const onDeleteCard = (cardItem) => {
  cardItem.remove();
};

const onLikeCard = (event) => {
  const like = event.target;
  like.classList.toggle("card__like-button_is-active");
};

export { createCard, onDeleteCard, onLikeCard };
