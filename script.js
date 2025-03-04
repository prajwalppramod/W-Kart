document.addEventListener("DOMContentLoaded", function () {
    const productList = document.getElementById("product-list");
    const productImage = document.getElementById("product-image");
    const productTitle = document.getElementById("product-title");
    const productDescription = document.getElementById("product-description");
    const productPrice = document.getElementById("product-price");
    const addToCartButton = document.querySelector(".btn-custom"); 
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    if (productList) {
        fetch("https://fakestoreapi.com/products")
            .then(response => response.json())
            .then(products => {
                productList.innerHTML = products.map(product => `
                <div class="col-md-4">
                    <div class="card shadow-sm h-100" style="display: flex; flex-direction: column;">
                        <div style="width: 100%; height: 250px; display: flex; align-items: center; justify-content: center; background: #f8f9fa;">
                            <img src="${product.image}" class="card-img-top" alt="${product.title}" 
                                style="max-width: 100%; max-height: 100%; object-fit: contain;">
                        </div>
                        <div class="card-body text-center d-flex flex-column" style="flex-grow: 1;">
                            <h5 class="card-title" style="flex-grow: 1;">${product.title}</h5>
                            <p class="card-text text-danger">Rs. ${product.price}</p>
                            <a href="details.html?id=${product.id}" class="btn btn-primary mt-auto">View Details</a>
                        </div>
                    </div>
                </div>
                `).join("");
            })
            .catch(error => console.error("Error fetching products:", error));
    }


    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (productId) {
        fetch(`https://fakestoreapi.com/products/${productId}`)
            .then(response => response.json())
            .then(product => {
                productImage.src = product.image;
                productImage.alt = product.title;
                productTitle.textContent = product.title;
                productDescription.textContent = product.description;
                productPrice.textContent = `Rs. ${product.price}`;

                addToCartButton.addEventListener("click", function () {
                    addToCart(product);
                });
            })
            .catch(error => console.error("Error fetching product details:", error));
    }

    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Product added to cart!");
    }

    function displayCart() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = "";
            let total = 0;

            cart.forEach(item => {
                total += item.price * item.quantity;

                const cartItem = document.createElement("div");
                cartItem.classList.add("row", "mb-3", "align-items-center");

                cartItem.innerHTML = `
                    <div class="col-md-2">
                        <img src="${item.image}" class="img-fluid" style="max-height: 80px;">
                    </div>
                    <div class="col-md-4">
                        <h5>${item.title}</h5>
                        <p class="text-danger">Rs. ${item.price}</p>
                    </div>
                    <div class="col-md-3">
                        <input type="number" value="${item.quantity}" min="1" class="form-control quantity-input" data-id="${item.id}">
                    </div>
                    <div class="col-md-3">
                        <button class="btn btn-danger btn-sm remove-item" data-id="${item.id}">Remove</button>
                    </div>
                `;

                cartItemsContainer.appendChild(cartItem);
            });

            cartTotal.textContent = `Total: Rs. ${total.toFixed(2)}`;

            document.querySelectorAll(".quantity-input").forEach(input => {
                input.addEventListener("change", function () {
                    updateCartItem(this.dataset.id, this.value);
                });
            });

            document.querySelectorAll(".remove-item").forEach(button => {
                button.addEventListener("click", function () {
                    removeCartItem(this.dataset.id);
                });
            });
        }
    }

    function updateCartItem(productId, quantity) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let item = cart.find(product => product.id == productId);

        if (item) {
            item.quantity = parseInt(quantity);
            localStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
        }
    }

    function removeCartItem(productId) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart = cart.filter(product => product.id != productId);
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
    }

    if (cartItemsContainer) {
        displayCart();
    }
});
