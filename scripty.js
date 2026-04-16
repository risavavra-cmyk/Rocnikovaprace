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
            const quantityInputs = document.querySelectorAll('.quantity-input');
            let totalPrice = 0;

            quantityInputs.forEach(input => {
                const cartRow = input.closest('.cart-item-row');
                const quantity = parseInt(input.value) || 1;
                const unitPrice = parseInt(input.dataset.unitPrice) || 0;
                const itemTotal = quantity * unitPrice;
                
                // Aktualizuj cenu položky
                const priceElement = cartRow.querySelector('.item-price');
                if (priceElement) {
                    priceElement.textContent = formatPrice(itemTotal);
                }
                
                totalPrice += itemTotal;
            });

            // Aktualizuj mezisoučet a součet
            document.getElementById('subtotal').textContent = formatPrice(totalPrice);
            document.getElementById('total').textContent = formatPrice(totalPrice);
        }

        // Přidej event listenery na všechny quantity inputy
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', updateCartPrices);
            input.addEventListener('input', updateCartPrices);
        });
