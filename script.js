let navbar = document.querySelector('.navbar');
let searchForm = document.querySelector('.search-form');
let cartItem = document.querySelector('.shopping-cart');
let loginForm = document.querySelector('.login-form');

// Product categories and their products
const productCategories = {
    'vegetables': ['fresh onion', 'fresh cabbage', 'fresh potato', 'fresh carrot', 'fresh tomato'],
    'fresh fruits': ['fresh orange', 'fresh avocado', 'green lemon', 'fresh apple'],
    'dairy products': ['fresh milk', 'fresh cheese', 'fresh yogurt'],
    'fresh meat': ['fresh meat', 'chicken breast', 'mutton pieces'],
    'sea food': ['fresh prawns', 'fresh fish', 'crab'],
    'Fast Food': ['burger', 'pizza', 'french fries']
};

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let total = 0;

function updateCart() {
    const cartContainer = document.querySelector('.shopping-cart');
    const cartContent = cartContainer.querySelector('.box-container') || document.createElement('div');
    cartContent.className = 'box-container';
    cartContent.innerHTML = '';
    
    total = 0;
    
    cart.forEach((item, index) => {
        const box = document.createElement('div');
        box.className = 'box';
        box.innerHTML = `
            <i class="fas fa-trash" data-index="${index}"></i>
            <img src="${item.image}" alt="${item.name}">
            <div class="content">
                <h3>${item.name}</h3>
                <span class="price">${item.price}/-</span>
                <span class="quantity">qty : ${item.quantity}</span>
            </div>
        `;
        cartContent.appendChild(box);
        total += item.price * item.quantity;
    });
    
    // Add total and checkout button
    const totalElement = document.createElement('div');
    totalElement.className = 'total';
    totalElement.textContent = `total : ${total}/-`;
    
    const checkoutBtn = document.createElement('a');
    checkoutBtn.href = 'checkout.html';
    checkoutBtn.className = 'btn';
    checkoutBtn.textContent = 'checkout';
    checkoutBtn.onclick = function() {
        localStorage.setItem('cart', JSON.stringify(cart));
    };
    
    cartContainer.innerHTML = '';
    cartContainer.appendChild(cartContent);
    cartContainer.appendChild(totalElement);
    cartContainer.appendChild(checkoutBtn);
    
    // Add delete functionality
    const deleteButtons = cartContainer.querySelectorAll('.fa-trash');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.dataset.index);
            cart.splice(index, 1);
            updateCart();
            localStorage.setItem('cart', JSON.stringify(cart));
        });
    });
}

// Add to cart functionality
document.querySelectorAll('.products .box .btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const box = button.closest('.box');
        const name = box.querySelector('h3').textContent;
        const price = parseInt(box.querySelector('.price').textContent);
        const image = box.querySelector('img').src;
        
        // Check if item already exists in cart
        const existingItem = cart.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name,
                price,
                image,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
        
        // Show cart
        cartItem.classList.add('active');
        
        // Remove active class after 2 seconds
        setTimeout(() => {
            cartItem.classList.remove('active');
        }, 2000);
    });
});

// Category navigation functionality
document.querySelectorAll('.categories .box .btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const category = this.parentElement.querySelector('h3').textContent.toLowerCase();
        const productSection = document.querySelector('.products');
        const targetHeading = Array.from(productSection.querySelectorAll('.sub-heading')).find(heading => 
            heading.textContent.toLowerCase().includes(category)
        );
        
        if (targetHeading) {
            targetHeading.scrollIntoView({ behavior: 'smooth' });
            // Highlight the target section
            targetHeading.style.color = 'var(--orange)';
            setTimeout(() => {
                targetHeading.style.color = 'var(--black)';
            }, 2000);
        }
    });
});

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
    loginForm.classList.remove('active');
}

document.querySelector('#search-btn').onclick = () =>{
    searchForm.classList.toggle('active');
    navbar.classList.remove('active');
    cartItem.classList.remove('active');
    loginForm.classList.remove('active');
}

document.querySelector('#cart-btn').onclick = () =>{
    cartItem.classList.toggle('active');
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
    loginForm.classList.remove('active');
}

document.querySelector('#login-btn').onclick = () =>{
    loginForm.classList.toggle('active');
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
}

window.onscroll = () =>{
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
    loginForm.classList.remove('active');
}

// Search functionality
const searchBox = document.querySelector('#search-box');
const searchFormElement = document.querySelector('.search-form');

searchFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchBox.value.toLowerCase().trim();
    
    // Get all product boxes
    const productBoxes = document.querySelectorAll('.products .box');
    let found = false;
    
    productBoxes.forEach(box => {
        const productName = box.querySelector('h3').textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
            found = true;
            box.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
    
    if (!found) {
        alert('No products found matching your search.');
    }
    
    searchForm.classList.remove('active');
    searchBox.value = '';
});

// Chatbot functionality
const chatbotIcon = document.querySelector('.chatbot-icon');
const chatbot = document.querySelector('.chatbot');
const closeChat = document.querySelector('.close-chat');
const chatbotInput = document.querySelector('.chatbot-input');
const chatbotSendBtn = document.querySelector('.chatbot-send-btn');

chatbotIcon.addEventListener('click', () => {
    chatbot.classList.add('active');
    chatbotIcon.style.display = 'none';
});

closeChat.addEventListener('click', () => {
    chatbot.classList.remove('active');
    chatbotIcon.style.display = 'flex';
});

chatbotSendBtn.addEventListener('click', () => {
    const message = chatbotInput.value.trim();
    if (message) {
        addMessage('user', message);
        chatbotInput.value = '';
        // Simulate bot response
        setTimeout(() => {
            addMessage('bot', 'Thank you for your message! Our team will get back to you soon.');
        }, 1000);
    }
});

function addMessage(type, message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    messageDiv.textContent = message;
    chatbot.querySelector('.chatbot-messages').appendChild(messageDiv);
    chatbot.querySelector('.chatbot-messages').scrollTop = chatbot.querySelector('.chatbot-messages').scrollHeight;
}

// Image Slider functionality
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    // Show first slide
    slides[0].classList.add('active');

    // Change slide every 5 seconds
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000);
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', initSlider);

// Modal Functions
function showDeliveryForm() {
    document.getElementById('deliveryModal').style.display = 'block';
}

function closeDeliveryForm() {
    document.getElementById('deliveryModal').style.display = 'none';
}

function showPaymentForm() {
    document.getElementById('paymentModal').style.display = 'block';
}

function closePaymentForm() {
    document.getElementById('paymentModal').style.display = 'none';
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.className === 'modal') {
        event.target.style.display = 'none';
    }
}

// Handle form submissions
document.getElementById('deliveryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Here you would typically send the form data to your server
    alert('Delivery details submitted successfully!');
    closeDeliveryForm();
});

document.getElementById('paymentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Here you would typically send the payment details to your payment processor
    alert('Payment processed successfully!');
    closePaymentForm();
});

// Format card number input
document.querySelector('#paymentForm input[type="text"]').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    e.target.value = value.replace(/(\d{4})/g, '$1 ').trim();
});

// Format expiry date input
document.querySelector('#paymentForm input[placeholder="MM/YY"]').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    e.target.value = value;
}); 