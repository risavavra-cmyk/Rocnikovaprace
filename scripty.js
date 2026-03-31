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
