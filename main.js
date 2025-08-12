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

document.querySelectorAll('.add-cart').forEach(button => {
  button.addEventListener('click', function (e) {
    e.preventDefault();

    // Show green notification
    const notification = document.getElementById('cart-notification');
    notification.classList.add('show');

    // Hide after 2.5 seconds
    setTimeout(() => {
      notification.classList.remove('show');
    }, 2500);

    // Here you would also handle adding the product to cart logic
  });
});


let carts = document.querySelectorAll('.add-cart');

// Product Data Array
let products = [
    { name: 'Dorper Ram', tag: 'matureram', price: 25000, inCart: 0 },
    { name: 'Dorper Ewe', tag: 'matureewe', price: 15000, inCart: 0 },
    { name: 'Galla Buck', tag: 'gallabuck', price: 20000, inCart: 0 },
    { name: 'Galla Doe', tag: 'galladoe', price: 12000, inCart: 0 },
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
    // Convert to number safely by stripping commas and spaces
    let num = parseFloat(String(price).replace(/,/g, ''));
    if (isNaN(num)) return price;
    return num.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
            <div class="price"> ${formatPrice(item.price)}</div>
            <div class="quantity">
                <ion-icon name="caret-back-circle" class="decrement" data-tag="${item.tag}"></ion-icon>
                <span>${item.inCart}</span>
                <ion-icon name="caret-forward-circle" class="increment" data-tag="${item.tag}"></ion-icon>
            </div>
            <div class="total">
                 ${formatPrice(item.inCart * item.price)}
            </div>
            `;
        });

        productContainer.innerHTML += `
    <div class="basketTotalContainer">
        <h4 class="basketTotalTitle">Basket Total</h4>
        <h4 class="basketTotal"> ${formatPrice(cartCost)}</h4>
    </div>
    <div class="checkout-btn-container">
        <button id="checkout-btn">Proceed to Checkout →</button>
    </div>
`;

// Add event listeners for increment, decrement, remove
document.querySelectorAll('.increment').forEach(button => {
    button.addEventListener('click', () => changeQuantity(button, 'increment'));
});
document.querySelectorAll('.decrement').forEach(button => {
    button.addEventListener('click', () => changeQuantity(button, 'decrement'));
});
document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', () => removeItem(button));
});

// Checkout button click
document.getElementById('checkout-btn').addEventListener('click', () => {
    window.location.href = "checkout.html"; // Change to your checkout page
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
displayCheckout(); // NEW — load checkout items if on checkout.html

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
  setTimeout(showSlides, 4000); // Change image every 2 seconds
}

function displayCheckout() {
    let checkoutContainer = document.querySelector(".order-summary");
    let cartItems = JSON.parse(localStorage.getItem("productsInCart"));
    let cartCost = localStorage.getItem("totalCost");

    if (checkoutContainer && cartItems) {
        checkoutContainer.innerHTML = "<h2>Order Summary</h2>"; // reset

        Object.values(cartItems).forEach(item => {
            checkoutContainer.innerHTML += `
                <div class="checkout-item" style="display:flex;align-items:center;margin-bottom:10px;">
                    <img src="./images/${item.tag}.jpg" alt="${item.name}" style="object-fit:cover;margin-right:10px;">
                    <span>${item.name}</span>
                    <span style="margin-left:auto;">${item.inCart} x ${formatPrice(item.price)}</span>
                </div>
            `;
        });

        checkoutContainer.innerHTML += `
            <div class="checkout-total" style="margin-top:15px;font-weight:bold;">
                Total: ${formatPrice(cartCost)}
            </div>
        `;
    }
}