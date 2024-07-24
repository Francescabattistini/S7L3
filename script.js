/* classe per i libri */
class Book {
  constructor(title, price) {
    this.title = title;
    this.price = price;
  }
}

/* array per gestire i libri nel carrello */
const cartBooks = [];

/* funzione che aggiunge un oggetto in un container */
const cartItemGen = (obj, container) => {
  const li = document.createElement("li");
  li.classList.add(
    "navbar-item",
    "mx-3",
    "d-flex",
    "justify-content-between",
    "align-items-start",
    "border-bottom",
    "mt-2",
    "pb-1"
  );

  const titleLi = document.createElement("p");
  titleLi.classList.add("me-5", "mb-1");
  titleLi.innerText = obj.title;

  const priceLi = document.createElement("p");
  priceLi.innerText = obj.price;

  const delBtn = document.createElement("button");
  delBtn.classList.add("fa-solid", "fa-trash", "btn", "btn-danger", "ms-1");
  delBtn.onclick = deleteCartBook;

  li.append(titleLi, priceLi, delBtn);
  container.appendChild(li);

  cartBooks.push(obj);
  const cart = document.getElementById("cart");
  cart.innerText = ` ${cartBooks.length}`;

  localStorage.setItem("Cart Books", JSON.stringify(cartBooks));
};

/* funzione che aggiunge un libro al carrello */
const buyElement = (event) => {
  const cartList = document.getElementById("cart-list");
  const title = event.currentTarget.parentElement.childNodes[0].innerText;
  const price = event.currentTarget.parentElement.childNodes[1].innerText;
  const book = new Book(title, price);
  cartItemGen(book, cartList);
};

/* funzione che genera il carrello partendo dal local storage */
const cartGen = () => {
  const books = localStorage.getItem("Cart Books");
  const booksRetrieved = JSON.parse(books);
  const cartList = document.getElementById("cart-list");
  cartList.style.width = "300px";
  const cart = document.getElementById("cart");
  cart.innerText = ` ${booksRetrieved.length}`;
  for (let i = 0; i < booksRetrieved.length; i++) {
    const currentBook = booksRetrieved[i];
    cartItemGen(currentBook, cartList);
  }
};

/* funzione che scarta un libro */
const deleteElement = (event) => {
  const currentCard = event.currentTarget.closest(".col-md-6");
  currentCard.remove();
};

/* funzione che toglie un libro dal carrello */
const deleteCartBook = (event) => {
  const book = event.currentTarget.parentElement;
  book.remove();
  const bookTitle = event.currentTarget.parentElement.childNodes[0].innerText;
  for (let i = 0; i < cartBooks.length; i++) {
    const currentBook = cartBooks[i];
    if (currentBook.title === bookTitle) {
      cartBooks.splice(i, 1);
      break;
    }
  }

  const cart = document.getElementById("cart");
  cart.innerText = ` ${cartBooks.length}`;
  localStorage.setItem("Cart Books", JSON.stringify(cartBooks));
};

/* funzione che genera le card */
const cardGen = (book, container) => {
  /* Creazione card */
  const col = document.createElement("div");
  col.classList.add("col-md-6", "col-lg-4", "col-xl-3");

  const card = document.createElement("div");
  card.classList.add("card");

  const img = document.createElement("img");
  img.src = book.img;
  img.style.height = "430px";
  img.style.objectFit = "cover";
  img.classList.add("card-img-top");

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const h5 = document.createElement("h5");
  h5.classList.add("card-title");
  h5.innerText = book.title;
  h5.style.display = "-webkit-box";
  h5.style.webkitBoxOrient = "vertical";
  h5.style.webkitLineClamp = "1";
  h5.style.overflow = "hidden";

  const price = document.createElement("p");
  price.classList.add("card-text");
  price.innerText = book.price + "$";

  const delBtn = document.createElement("a");
  delBtn.classList.add("btn", "btn-outline-danger", "me-1");
  delBtn.innerText = "Scarta";
  delBtn.onclick = deleteElement;

  const buyBtn = document.createElement("a");
  buyBtn.classList.add("btn", "btn-primary");
  buyBtn.innerText = "Compra";
  buyBtn.onclick = buyElement;

  cardBody.append(h5, price, delBtn, buyBtn);
  card.append(img, cardBody);
  col.appendChild(card);
  container.appendChild(col);
};

/* Funzione che prende i libri dall'API e genera le card */
const bookGen = () => {
  fetch("https://striveschool-api.herokuapp.com/books")
    .then((resp) => {
      if (resp.ok) {
        return resp.json();
      } else {
        throw new Error("Errore nel reperimento dei dati");
      }
    })
    .then((booksArray) => {
      const row = document.getElementById("card-space");
      for (let i = 0; i < booksArray.length; i++) {
        const currentBook = booksArray[i];
        cardGen(currentBook, row);
      }
    })
    .catch((err) => {
      console.log(err);
      bookGen();
    });
};

window.addEventListener("DOMContentLoaded", bookGen);
window.addEventListener("DOMContentLoaded", cartGen);
