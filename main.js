let carts = document.querySelectorAll('.add-cart');

// Product Data Array
let products = [
    { name: 'Mature Ram', tag: 'matureram', price: 250, inCart: 0 },
    { name: 'Young Ram', tag: 'youngram', price: 200, inCart: 0 },
    { name: 'Mature Ewe', tag: 'matureewe', price: 150, inCart: 0 },
    { name: 'Young Ewe', tag: 'youngewe', price: 100, inCart: 0 },
    { name: 'Napier Grass', tag: 'napiergrass', price: 20, inCart: 0 }
];

// Event Listeners for Add to Cart buttons
for (let i = 0; i < carts.length; i++) {
    carts[i].addEventListener('click', () => {
        cartNumbers(products[i]);
        totalCost(products[i]);
    });
}

// Load cart item numbers
function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem('cartNumbers');
    if (productNumbers) {
        document.querySelector('.cart span').textContent = productNumbers;
    }
}

// Update cart item count
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
}

// Update total cost
function totalCost(product) {
    let cartCost = localStorage.getItem('totalCost') || 0;
    cartCost = parseFloat(cartCost);  // Allow for decimal prices
    localStorage.setItem("totalCost", cartCost + product.price);
}

// Display cart items in the cart page
function displayCart() {
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);
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
            <div class="price">$${item.price}.00</div>
            <div class="quantity">
                <ion-icon name="caret-back-circle" class="decrement" data-tag="${item.tag}"></ion-icon>
                <span>${item.inCart}</span>
                <ion-icon name="caret-forward-circle" class="increment" data-tag="${item.tag}"></ion-icon>
            </div>
            <div class="total">
            $${item.inCart * item.price}.00
            </div>
            `;
        });

        productContainer.innerHTML += `
        <div class="basketTotalContainer">
            <h4 class="basketTotalTitle">Basket Total</h4>
            <h4 class="basketTotal">$${cartCost}.00</h4>
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

// Change product quantity (increment or decrement)
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
    displayCart();
}

// Remove item from cart
function removeItem(button) {
    let tag = button.getAttribute('data-tag');
    let cartItems = JSON.parse(localStorage.getItem('productsInCart'));
    delete cartItems[tag];

    // Update localStorage and the cart display
    localStorage.setItem('productsInCart', JSON.stringify(cartItems));
    localStorage.setItem('totalCost', calculateTotalCost(cartItems));

    // Update cart numbers in navbar
    let productNumbers = localStorage.getItem('cartNumbers') || 0;
    localStorage.setItem('cartNumbers', productNumbers - 1);
    document.querySelector('.cart span').textContent = productNumbers - 1;

    displayCart();
}

// Calculate total cost based on cart items
function calculateTotalCost(cartItems) {
    return Object.values(cartItems).reduce((total, item) => {
        return total + (item.price * item.inCart);
    }, 0);
}

// Initial calls
onLoadCartNumbers();
displayCart();

document.querySelector('.hamburger').addEventListener('click', function() {
    document.querySelector('nav ul').classList.toggle('active');
    this.classList.toggle('active');
});


