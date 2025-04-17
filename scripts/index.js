// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// @todo: DOM узлы
const places = document.querySelector(".places");
const placesList = places.querySelector(".places__list");

// @todo: Функция создания карточки
function createCard(cardInfo, funcDelete) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardImage.src = cardInfo.link;
  cardImage.alt = cardInfo.name;
  cardTitle.textContent = cardInfo.name;
  deleteButton.addEventListener("click", funcDelete);

  return cardElement;
}
// @todo: Функция удаления карточки
function deleteCard(event) {
  const eventTarget = event.target;
  const listItem = eventTarget.closest(".places__item");

  listItem.remove();
}
// @todo: Вывести карточки на страницу

initialCards.forEach((item) => {
  let newCard = createCard(item, deleteCard);

  placesList.append(newCard);
});
