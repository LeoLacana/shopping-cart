function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function removeValueLocalStorager(id) {
  const allStorageCart = localStorage.getItem('Product');
  const cartRemove = (allStorageCart.split(',')).filter((valueCart) => valueCart !== id);
  localStorage.setItem('Product', cartRemove);
}

function elementPrice() {
  return document.querySelector('.total-price');
}

function subtractionTotalPrice(priceTotal, priceProduct) {
  const getPriceProduct = priceProduct.target.innerText.split('$');
  const getPriceProductConverted = getPriceProduct[getPriceProduct.length - 1];
  const elementTotalPrice = elementPrice();
  elementTotalPrice.innerText = priceTotal - parseFloat(getPriceProductConverted);
}

function cartItemClickListener(event) {
  const currentTotalPrice = elementPrice();
  subtractionTotalPrice(currentTotalPrice.innerText, event);
  const id = event.target.innerText.split(':')[1];
  event.target.remove();
  removeValueLocalStorager(id);
}

function saveProductStorage(id) {
  let currentItems = localStorage.getItem('Product');
  if (currentItems) {
    currentItems += `,${id}`;
  } else {
    currentItems = `${id}`;
  }
  localStorage.setItem('Product', currentItems);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  saveProductStorage(sku);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

/* function requisitionEndPoist (){
} */

function searchItens() {
  const productsSelect = document.querySelector('.items');   
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(API_URL)
  .then((response) => response.json())
  .then((data) => {
      data.results.forEach((object) => {
        const objectCreated = {
          sku: object.id,
          name: object.title,
          image: object.thumbnail,
        };
        productsSelect.appendChild(createProductItemElement(objectCreated));
      });
  });
}

function creatTotalPrice() {
  const elementeTotalPrice = document.createElement('p');
  const elementePrice = document.createElement('span');
  elementeTotalPrice.innerText = 'Pre??o Total: ';
  elementePrice.className = 'total-price';
  const elementeTittleCart = document.querySelector('.cart__title');
  elementeTittleCart.appendChild(elementeTotalPrice);
  elementeTotalPrice.appendChild(elementePrice);
}

function sumPrice(price) {
  const elementTotalPrice = elementPrice();
  if (!elementTotalPrice.innerText) {
    elementTotalPrice.innerText = price;
  } else {
    const elementToralPriceConverted = parseFloat(elementTotalPrice.innerText, 10);
    elementTotalPrice.innerText = elementToralPriceConverted + price;
  }
}

function addObjectCart(evento) {
  const itemId = getSkuFromProductItem(evento.target.parentNode);
  const API_URL = `https://api.mercadolibre.com/items/${itemId}`;
  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  }; 
  fetch(API_URL, myObject)
  .then((response) => response.json())
  .then((data) => {
    const objectCart = {
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    };
    sumPrice(data.price);
    const elementOl = document.querySelector('.cart__items');
    elementOl.appendChild(createCartItemElement(objectCart));
  });
}

  function loadCart() {
  const localSotageCart = localStorage.getItem('Product');
  if (localSotageCart) {
    localSotageCart.split(',').forEach((cart) => {
      console.log(cart);
      const API_URL = `https://api.mercadolibre.com/items/${cart}`;
      fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        const objectLoadCart = {
          sku: data.id,
          name: data.title,
          salePrice: data.price,
        };
        const elementOl = document.querySelector('.cart__items');
        elementOl.appendChild(createCartItemElement(objectLoadCart));
      });
    });
  }
  }

function buttonClear() {
  localStorage.clear();
  const li = document.querySelectorAll('.cart__item');
  li.forEach((element) => element.remove());
}

window.onload = function onload() {
  searchItens();
  const buttonElemento = document.querySelector('.items');
  const elementButtonClear = document.querySelector('.empty-cart');
  buttonElemento.addEventListener('click', addObjectCart);  
  loadCart();
  elementButtonClear.addEventListener('click', buttonClear);

  creatTotalPrice();
};