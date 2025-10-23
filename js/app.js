// ============================================
// DIGIGET - MAIN APPLICATION LOGIC
// ============================================

import {
  auth,
  db,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  GeoPoint,
  doc,
  getDoc
} from '../assets/firebase-config.js';

// ============================================
// GLOBAL STATE
// ============================================
let currentUser = null;
let currentView = 'customer';
let userLocation = { latitude: null, longitude: null };
let deals = [];

// Your merchant user ID from Firebase
const MERCHANT_USER_ID = 'RoMQAeKHY9RBy5Su279XKMFhpBl2';

// ============================================
// INITIALIZATION
// ============================================
window.addEventListener('load', () => {
  console.log('DigiGet app loading...');
  
  // Check authentication state
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    console.log('Auth state changed:', user ? `Logged in as ${user.email}` : 'Not logged in');
    
    if (user && currentView === 'merchant') {
      showMerchantDashboard();
    } else if (!user && currentView === 'merchant') {
      document.getElementById('merchant-dashboard').classList.add('hidden');
      document.getElementById('merchant-login').classList.remove('hidden');
    }
  });

  // Request location on load
  setTimeout(() => {
    document.getElementById('location-modal').classList.remove('hidden');
  }, 1000);
});

// ============================================
// VIEW SWITCHING
// ============================================
window.switchView = function(view) {
  console.log('Switching to view:', view);
  
  // Hide all views
  document.getElementById('customer-view').classList.add('hidden');
  document.getElementById('merchant-view').classList.add('hidden');
  document.getElementById('jobs-view').classList.add('hidden');

  // Update nav items
  document.querySelectorAll('nav button').forEach(btn => {
    btn.classList.remove('nav-item-active');
    btn.classList.add('text-gray-500');
  });

  // Show selected view
  if (view === 'customer') {
    document.getElementById('customer-view').classList.remove('hidden');
    document.getElementById('nav-home').classList.add('nav-item-active');
    document.getElementById('nav-home').classList.remove('text-gray-500');
    refreshDeals();
  } else if (view === 'merchant') {
    document.getElementById('merchant-view').classList.remove('hidden');
    document.getElementById('nav-merchant').classList.add('nav-item-active');
    document.getElementById('nav-merchant').classList.remove('text-gray-500');
  } else if (view === 'jobs') {
    document.getElementById('jobs-view').classList.remove('hidden');
    document.getElementById('nav-jobs').classList.add('nav-item-active');
    document.getElementById('nav-jobs').classList.remove('text-gray-500');
    loadJobs();
  }

  currentView = view;
};

// ============================================
// GEOLOCATION
// ============================================
window.requestLocation = function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.latitude = position.coords.latitude;
        userLocation.longitude = position.coords.longitude;
        document.getElementById('location-modal').classList.add('hidden');
        document.getElementById('location-text').textContent = 'Location enabled';
        console.log('Location:', userLocation);
        loadDeals();
      },
      (error) => {
        console.error('Location error:', error);
        // Use default location (New York) for demo
        userLocation.latitude = 40.7128;
        userLocation.longitude = -74.0060;
        document.getElementById('location-modal').classList.add('hidden');
        document.getElementById('location-text').textContent = 'Using default location';
        loadDeals();
      }
    );
  } else {
    alert('Geolocation is not supported by your browser');
  }
};

window.refreshDeals = function() {
  if (userLocation.latitude && userLocation.longitude) {
    loadDeals();
  }
};

// ============================================
// DEALS FUNCTIONS
// ============================================
async function loadDeals() {
  if (!userLocation.latitude || !userLocation.longitude) {
    return;
  }

  console.log('Loading deals for location:', userLocation);
  
  document.getElementById('deals-loading').classList.remove('hidden');
  document.getElementById('deals-grid').classList.add('hidden');
  document.getElementById('deals-empty').classList.add('hidden');

  try {
    const dealsQuery = query(
      collection(db, 'offers'),
      where('isActive', '==', true),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(dealsQuery);
    deals = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const dealLocation = data.location;
      
      if (dealLocation && dealLocation.latitude && dealLocation.longitude) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          dealLocation.latitude,
          dealLocation.longitude
        );

        if (distance <= 5) { // Within 5km
          deals.push({
            id: docSnap.id,
            ...data,
            distance: distance.toFixed(1)
          });
        }
      }
    });

    // Sort by distance
    deals.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    console.log(`Found ${deals.length} deals nearby`);
    displayDeals();
  } catch (error) {
    console.error('Error loading deals:', error);
    document.getElementById('deals-loading').classList.add('hidden');
    document.getElementById('deals-empty').classList.remove('hidden');
  }
}

function displayDeals() {
  document.getElementById('deals-loading').classList.add('hidden');

  if (deals.length === 0) {
    document.getElementById('deals-empty').classList.remove('hidden');
    return;
  }

  const grid = document.getElementById('deals-grid');
  grid.innerHTML = '';
  grid.classList.remove('hidden');

  deals.forEach(deal => {
    const card = createDealCard(deal);
    grid.appendChild(card);
  });
}

function createDealCard(deal) {
  const card = document.createElement('div');
  card.className = 'deal-card glass rounded-2xl overflow-hidden smooth-transition cursor-pointer';
  
  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in your offer: ${deal.title} - $${deal.price}`
  );
  const whatsappLink = `https://wa.me/${deal.merchantWhatsApp.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  card.innerHTML = `
    <div class="aspect-video bg-gradient-to-br from-blue-400 via-blue-500 to-purple-500 flex items-center justify-center">
      <span class="text-white text-4xl font-bold">$${deal.price}</span>
    </div>
    <div class="p-4">
      <h3 class="font-semibold text-gray-900 text-lg mb-1">${deal.title}</h3>
      <p class="text-sm text-gray-600 mb-3">${deal.description || 'Limited time offer'}</p>
      
      <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
        <span class="flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
          </svg>
          ${deal.distance} km away
        </span>
        <span class="flex items-center">
          <svg class="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
          </svg>
          ${deal.merchantName || 'Local Merchant'}
        </span>
      </div>

      <a href="${whatsappLink}" target="_blank" class="block w-full brand-color text-white text-center font-medium py-3 rounded-xl hover:opacity-90 smooth-transition">
        Order via WhatsApp
      </a>
    </div>
  `;

  return card;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// ============================================
// MERCHANT FUNCTIONS
// ============================================
window.handleMerchantLogin = async function(event) {
  event.preventDefault();
  
  const email = document.getElementById('merchant-email').value;
  const password = document.getElementById('merchant-password').value;
  const errorDiv = document.getElementById('merchant-login-error');
  errorDiv.classList.add('hidden');

  try {
    console.log('Attempting login for:', email);
    await signInWithEmailAndPassword(auth, email, password);
    
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
    
    if (userDoc.exists() && userDoc.data().role === 'merchant') {
      console.log('Merchant login successful');
      showMerchantDashboard();
    } else {
      errorDiv.textContent = 'This account is not registered as a merchant.';
      errorDiv.classList.remove('hidden');
      await signOut(auth);
    }
  } catch (error) {
    console.error('Login error:', error);
    errorDiv.textContent = error.message;
    errorDiv.classList.remove('hidden');
  }
};

function showMerchantDashboard() {
  currentUser = auth.currentUser;
  console.log('Showing merchant dashboard for:', currentUser?.email);
  
  document.getElementById('merchant-login').classList.add('hidden');
  document.getElementById('merchant-dashboard').classList.remove('hidden');
  
  if (currentUser) {
    document.getElementById('merchant-name').textContent = `Welcome back, ${currentUser.email}`;
  }
  
  loadMerchantData();
}

async function loadMerchantData() {
  if (!auth.currentUser) return;
  
  console.log('Loading merchant data...');
  
  try {
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.merchantData && userData.merchantData.businessName) {
        document.getElementById('merchant-name').textContent = 
          `Welcome back, ${userData.merchantData.businessName}`;
      }
    }
    
    // Load active offers count
    const offersQuery = query(
      collection(db, 'offers'),
      where('merchantId', '==', auth.currentUser.uid),
      where('isActive', '==', true)
    );
    const offersSnapshot = await getDocs(offersQuery);
    document.getElementById('stat-active-offers').textContent = offersSnapshot.size;
    
    // Load orders count
    const ordersQuery = query(
      collection(db, 'orders'),
      where('merchantId', '==', auth.currentUser.uid)
    );
    const ordersSnapshot = await getDocs(ordersQuery);
    document.getElementById('stat-orders').textContent = ordersSnapshot.size;
    
    // Set rating (placeholder)
    document.getElementById('stat-rating').textContent = '4.5';
    
    console.log('Merchant data loaded successfully');
  } catch (error) {
    console.error('Error loading merchant data:', error);
  }
}

window.handleCreateOffer = async function(event) {
  event.preventDefault();
  
  const successDiv = document.getElementById('create-offer-success');
  const errorDiv = document.getElementById('create-offer-error');
  successDiv.classList.add('hidden');
  errorDiv.classList.add('hidden');

  // Check if user is authenticated
  if (!auth.currentUser) {
    console.error('No user logged in');
    errorDiv.textContent = 'Please sign in first.';
    errorDiv.classList.remove('hidden');
    return;
  }

  console.log('Creating offer for user:', auth.currentUser.email);

  try {
    const offerLocation = userLocation.latitude 
      ? { latitude: userLocation.latitude, longitude: userLocation.longitude }
      : { latitude: 40.7128, longitude: -74.0060 }; // Default to NYC

    const offerData = {
      merchantId: auth.currentUser.uid,
      merchantName: 'Your Business',
      merchantWhatsApp: document.getElementById('offer-whatsapp').value,
      title: document.getElementById('offer-title').value,
      description: document.getElementById('offer-description').value,
      price: parseFloat(document.getElementById('offer-price').value),
      location: new GeoPoint(offerLocation.latitude, offerLocation.longitude),
      locationAddress: document.getElementById('offer-address').value,
      category: document.getElementById('offer-category').value,
      createdAt: serverTimestamp(),
      isActive: true,
      status: 'approved'
    };

    console.log('Offer data:', offerData);

    const docRef = await addDoc(collection(db, 'offers'), offerData);
    console.log('Offer created with ID:', docRef.id);
    
    successDiv.textContent = 'Offer created successfully!';
    successDiv.classList.remove('hidden');
    
    document.getElementById('create-offer-form').reset();
    loadMerchantData();
  } catch (error) {
    console.error('Create offer error:', error);
    errorDiv.textContent = error.message;
    errorDiv.classList.remove('hidden');
  }
};

window.handleMerchantLogout = async function() {
  try {
    await signOut(auth);
    document.getElementById('merchant-dashboard').classList.add('hidden');
    document.getElementById('merchant-login').classList.remove('hidden');
    console.log('Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

window.showMerchantSignup = function() {
  alert('Merchant signup flow - Contact admin to create your account');
};

// ============================================
// JOBS FUNCTIONS
// ============================================
async function loadJobs() {
  console.log('Loading jobs...');
  // Placeholder for jobs loading
}

// ============================================
// CONSOLE GREETING
// ============================================
console.log('%c🔷 DigiGet', 'font-size: 24px; color: #5B7FFF; font-weight: bold;');
console.log('%cHyperlocal Marketplace - v1.0', 'font-size: 12px; color: #666;');
console.log('Firebase Project: digiget-l9');
console.log('---');
