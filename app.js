let map;
let service;
let infowindow;
let markers = [];
let cart = [];

// Initialize the map
function initMap() {
    const defaultLocation = { lat: 40.7128, lng: -74.006 }; // New York City
    map = new google.maps.Map(document.getElementById("map"), {
        center: defaultLocation,
        zoom: 14,
    });

    infowindow = new google.maps.InfoWindow();

    document.querySelectorAll(".filter-button").forEach((button) => {
        button.addEventListener("click", () => {
            findPlaces(button.getAttribute("data-type"));
        });
    });

    document.getElementById("search-button").addEventListener("click", () => {
        const query = document.getElementById("location-search").value;
        if (query) searchLocation(query);
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                map.setCenter({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            () => console.error("Geolocation permission denied.")
        );
    }
}

// Find places based on type
function findPlaces(type) {
    clearMarkers();
    const request = {
        location: map.getCenter(),
        radius: 5000,
        type: type,
    };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(createMarker);
        }
    });
}

// Create a marker on the map
function createMarker(place) {
    const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
        title: place.name,
    });
    google.maps.event.addListener(marker, "click", () => {
        infowindow.setContent(`<strong>${place.name}</strong><br>${place.vicinity}`);
        infowindow.open(map, marker);
    });
    markers.push(marker);
}

// Clear all markers
function clearMarkers() {
    markers.forEach((marker) => marker.setMap(null));
    markers = [];
}

// Search for a specific location
function searchLocation(query) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: query }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
        }
    });
}

// Shopping Cart Functionality
document.querySelectorAll(".add-to-cart").forEach((button, index) => {
    button.addEventListener("click", () => {
        const item = button.parentElement.querySelector("h3").innerText;
        const price = parseInt(
            button.parentElement.querySelector("p").innerText.replace("$", "")
        );
        cart.push({ item, price });
        updateCart();
    });
});

// Update Cart UI
function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    cartItems.innerHTML = "";
    let total = 0;
    cart.forEach(({ item, price }) => {
        total += price;
        const li = document.createElement("li");
        li.innerText = `${item} - $${price}`;
        cartItems.appendChild(li);
    });
    cartTotal.innerText = `Total: $${total}`;
}

window.onload = initMap;