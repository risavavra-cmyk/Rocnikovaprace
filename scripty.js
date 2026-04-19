const images = [
    'images/motorky1.jpg',
    'images/motorky2.jpg',
    'images/motorky3.jpg',
    'images/motorky4.jpg'
];

let currentIndex = 0;

function changeImage(event, src) {
    document.getElementById('mainImage').src = src;
    document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
    event.target.classList.add('active');
    currentIndex = images.indexOf(src);
}

function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateMainImage();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateMainImage();
}

function updateMainImage() {
    document.getElementById('mainImage').src = images[currentIndex];
    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
        if (index === currentIndex) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

function formatPrice(price) {
            return new Intl.NumberFormat('cs-CZ', {
                style: 'currency',
                currency: 'CZK',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(price);
        }

        function updateCartPrices() {
            const quantityInputs = document.querySelectorAll('.vstup-mnozstvi');
            let totalPrice = 0;
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            quantityInputs.forEach(input => {
                const quantity = parseInt(input.value) || 1;
                const unitPrice = parseInt(input.dataset.unitPrice) || 0;
                const itemTotal = quantity * unitPrice;
                
                // Aktualizuj cenu položky
                const priceElement = input.closest('.radek-kosiku').querySelector('.cena-polozky');
                if (priceElement) {
                    priceElement.textContent = formatPrice(itemTotal);
                }
                
                // Aktualizuj množství v localStorage
                const productId = parseInt(input.closest('.radek-kosiku').dataset.itemId);
                const productIndex = cart.findIndex(p => p.id === productId);
                if (productIndex !== -1) {
                    cart[productIndex].quantity = quantity;
                }
                
                totalPrice += itemTotal;
            });

            // Ulož aktualizovaný košík zpět do localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            // Aktualizuj mezisoučet a součet
            document.getElementById('subtotal').textContent = formatPrice(totalPrice);
            document.getElementById('total').textContent = formatPrice(totalPrice);
        }

        // Funkce pro přidávání produktu do košíku
        function addToCart(image, name, code, price, quantity) {
            // Pokud není quantity předáno, zkus najít z input pole (pro motorka1.html)
            if (quantity === undefined) {
                quantity = parseInt(document.getElementById('quantity').value) || 1;
            }
            
            // Vytvoř objekt produktu
            const product = {
                id: Date.now(), // Unikátní ID
                image: image,
                name: name,
                code: code,
                price: price,
                quantity: quantity
            };
            
            // Získej existující košík z localStorage
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Přidej produkt do košíku
            cart.push(product);
            
            // Ulož zpět do localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Přesměruj na košík
            window.location.href = 'kosik.html';
        }

        // Funkce pro mazání položek z košíku
        function deleteCartItem(button, productId) {
            // Získej košík z localStorage
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Odstraň produkt s daným ID
            cart = cart.filter(product => product.id !== productId);
            
            // Ulož zpět do localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Znovu načti košík
            loadCartFromStorage();
        }

        // Zavolej loadCartFromStorage při načtení stránky
        window.addEventListener('DOMContentLoaded', loadCartFromStorage);

        // Funkce pro načítání produktů z localStorage a vykreslení v košíku
        function loadCartFromStorage() {
            const cartContainer = document.getElementById('cartContainer');
            if (!cartContainer) return; // Nejsme na kosik.html
            
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Vyčisti obsah
            cartContainer.innerHTML = '';
            
            if (cart.length === 0) {
                // Košík je prázdný
                const emptyMessage = document.createElement('div');
                emptyMessage.id = 'emptyCartMessage';
                emptyMessage.className = 'text-center py-5';
                emptyMessage.innerHTML = '<h5 class="text-muted">Košík je prázdný</h5>';
                cartContainer.appendChild(emptyMessage);
            } else {
                // Přidej produkty z localStorage
                cart.forEach((product, index) => {
                    const itemRow = document.createElement('div');
                    itemRow.className = `d-flex justify-content-between align-items-center mb-3 kosik-produkt-box radek-kosiku ${index > 0 ? 'border-top pt-3' : ''}`;
                    itemRow.dataset.itemId = product.id;
                    itemRow.innerHTML = `
                        <div class="d-flex align-items-center kosik-obrazek-nazev">
                            <div class="col-md-3">                                   
                                <img src="images/${product.image}" alt="${product.name}" class="img-fluid rounded kosik-img">
                            </div>
                            <div class="ms-4 col-md-5">
                                <h5 class="mb-1">${product.name}</h5>
                                <p class="text-muted mb-0">Kód produktu: ${product.code}</p>
                            </div>    
                        </div>
                        <div class="col-md-2 kosik-obrazek-nazev kosik-mnozstvi-cena">
                            <label for="quantity-${product.id}" class="form-label">Množství:</label>
                            <input type="number" class="form-control kosik-obrazek-nazev vstup-mnozstvi" id="quantity-${product.id}" value="${product.quantity}" min="1" style="width: 80px;" data-unit-price="${product.price}">
                        </div>
                        <div class="text-end col-md-2 kosik-obrazek-nazev kosik-mnozstvi-cena">
                            <p class="h5 mb-0 fw-bold cena-polozky">${formatPrice(product.price * product.quantity)}</p> 
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteCartItem(this, ${product.id})">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    `;
                    cartContainer.appendChild(itemRow);
                });
                
                // Přidej event listenery na quantity inputy
                document.querySelectorAll('.vstup-mnozstvi').forEach(input => {
                    input.addEventListener('change', updateCartPrices);
                    input.addEventListener('input', updateCartPrices);
                });
            }
            
            // Aktualizuj ceny (vždy, i pro prázdný košík)
            updateCartPrices();
        }
