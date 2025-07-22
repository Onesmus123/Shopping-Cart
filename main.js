// main.js

document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector("nav ul");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }
});


let carts = document.querySelectorAll('.add-cart');

// Product Data Array
let products = [
    { name: 'Mature Ram', tag: 'matureram', price: 25000, inCart: 0 },
    { name: 'Young Ram', tag: 'youngram', price: 15000, inCart: 0 },
    { name: 'Mature Ewe', tag: 'matureewe', price: 15000, inCart: 0 },
    { name: 'Young Ewe', tag: 'youngewe', price: 10000, inCart: 0 },
    { name: 'Napier Grass', tag: 'napiergrass', price: 20, inCart: 0 }
];

// Event Listeners for Add to Cart buttons
for (let i = 0; i < carts.length; i++) {
    carts[i].addEventListener('click', () => {
        cartNumbers(products[i]);
        totalCost(products[i]);
    });
}

// Update cart item count on page load and whenever the cart changes
function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem('cartNumbers');
    if (productNumbers) {
        document.querySelector('.cart span').textContent = productNumbers;
    }
}

// Update the cart numbers when an item is added to the cart
function cartNumbers(product) {
    let productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);

    if (productNumbers) {
        localStorage.setItem('cartNumbers', productNumbers + 1);
        document.querySelector('.cart span').textContent = productNumbers + 1;
    } else {
        localStorage.setItem('cartNumbers', 1);
        document.querySelector('.cart span').textContent = 1;
    }

    setItems(product);
}

// Set cart items in localStorage
function setItems(product) {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if (cartItems != null) {
        if (cartItems[product.tag] == undefined) {
            cartItems = { ...cartItems, [product.tag]: product };
        }
        cartItems[product.tag].inCart += 1;
    } else {
        product.inCart = 1;
        cartItems = { [product.tag]: product };
    }

    localStorage.setItem("productsInCart", JSON.stringify(cartItems));
    updateCartNumbers();
}

// Calculate the total number of items in the cart
function updateCartNumbers() {
    let cartItems = JSON.parse(localStorage.getItem('productsInCart'));
    let totalCartNumbers = 0;

    if (cartItems) {
        totalCartNumbers = Object.values(cartItems).reduce((acc, item) => acc + item.inCart, 0);
    }

    localStorage.setItem('cartNumbers', totalCartNumbers);
    document.querySelector('.cart span').textContent = totalCartNumbers;
}

// Update total cost when an item is added or changed
function totalCost(product) {
    let cartCost = localStorage.getItem('totalCost') || 0;
    cartCost = parseFloat(cartCost);  // Allow for decimal prices
    localStorage.setItem("totalCost", cartCost + product.price);
}

// Change quantity of items in the cart (increment/decrement)
function changeQuantity(button, action) {
    let tag = button.getAttribute('data-tag');
    let cartItems = JSON.parse(localStorage.getItem('productsInCart'));
    let product = cartItems[tag];

    if (action === 'increment') {
        product.inCart += 1;
    } else if (action === 'decrement' && product.inCart > 1) {
        product.inCart -= 1;
    }

    // Update localStorage and the cart display
    localStorage.setItem('productsInCart', JSON.stringify(cartItems));
    localStorage.setItem('totalCost', calculateTotalCost(cartItems));

    updateCartNumbers();  // Update cart item count in navbar
    displayCart();        // Re-render the cart page
}

// Format price with commas for readability
function formatPrice(price) {
    return price.toLocaleString();
}

// Calculate the total cost based on cart items
function calculateTotalCost(cartItems) {
    return Object.values(cartItems).reduce((total, item) => total + (item.price * item.inCart), 0);
}

// Display cart items in the cart page
function displayCart() {
    let cartItems = JSON.parse(localStorage.getItem('productsInCart'));
    let productContainer = document.querySelector(".products");
    let cartCost = localStorage.getItem('totalCost');

    if (cartItems && productContainer) {
        productContainer.innerHTML = '';
        Object.values(cartItems).map(item => {
            productContainer.innerHTML += `
            <div class="product">
                <ion-icon name="close-circle-outline" class="remove-item" data-tag="${item.tag}"></ion-icon>
                <img src="./images/${item.tag}.jpg" alt="${item.name}">
                <span>${item.name}</span>
            </div>
            <div class="price"> ${formatPrice(item.price)}.00</div>
            <div class="quantity">
                <ion-icon name="caret-back-circle" class="decrement" data-tag="${item.tag}"></ion-icon>
                <span>${item.inCart}</span>
                <ion-icon name="caret-forward-circle" class="increment" data-tag="${item.tag}"></ion-icon>
            </div>
            <div class="total">
                 ${formatPrice(item.inCart * item.price)}.00
            </div>
            `;
        });

        productContainer.innerHTML += `
        <div class="basketTotalContainer">
            <h4 class="basketTotalTitle">Basket Total</h4>
            <h4 class="basketTotal"> ${formatPrice(cartCost)}.00</h4>
        </div>`;

        // Add event listeners for increment, decrement, and remove actions
        document.querySelectorAll('.increment').forEach(button => {
            button.addEventListener('click', () => changeQuantity(button, 'increment'));
        });
        document.querySelectorAll('.decrement').forEach(button => {
            button.addEventListener('click', () => changeQuantity(button, 'decrement'));
        });
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => removeItem(button));
        });
    }
}

// Remove item from the cart when the X icon is clicked
function removeItem(button) {
    let tag = button.getAttribute('data-tag');
    let cartItems = JSON.parse(localStorage.getItem('productsInCart'));
    delete cartItems[tag];

    // Update localStorage and the cart display
    localStorage.setItem('productsInCart', JSON.stringify(cartItems));
    localStorage.setItem('totalCost', calculateTotalCost(cartItems));

    // Update cart numbers in navbar
    updateCartNumbers();
    
    // Re-render the cart display
    displayCart();
}

// Initialize cart display and cart numbers
onLoadCartNumbers();
displayCart();

//Carousel

let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
  setTimeout(showSlides, 2000); // Change image every 2 seconds
}
