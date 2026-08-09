// ========================================
// SMART FOOD TRUCK TRACKING SYSTEM
// ========================================


// ========================================
// 1. CREATE MAP
// ========================================

const map =
    L.map("map").setView(
        [14.0, 77.0],
        10
    );


// ========================================
// 2. OPEN STREET MAP
// ========================================

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:
            "&copy; OpenStreetMap contributors"
    }
).addTo(map);


// ========================================
// 3. FOOD TRUCK ICON
// ========================================

const foodTruckIcon =
    L.divIcon({

        html: "🚚",

        className:
            "food-truck-marker",

        iconSize:
            [45, 45],

        iconAnchor:
            [22, 22],

        popupAnchor:
            [0, -20]

    });


// ========================================
// 4. VARIABLES
// ========================================

let userMarker = null;

let truckMarkers = [];

let foodTrucks = [];


// ========================================
// 5. FIND TRUCKS NEAR ME
// ========================================

const locationButton =
    document.getElementById(
        "location-button"
    );


locationButton.addEventListener(
    "click",
    function () {

        if (!navigator.geolocation) {

            alert(
                "Your browser does not support location."
            );

            return;
        }


        navigator.geolocation.getCurrentPosition(

            function (position) {

                const userLatitude =
                    position.coords.latitude;

                const userLongitude =
                    position.coords.longitude;


                // Remove old user marker

                if (userMarker) {

                    map.removeLayer(
                        userMarker
                    );

                }


                // Create user marker

                userMarker =
                    L.marker([

                        userLatitude,
                        userLongitude

                    ]).addTo(map);


                userMarker.bindPopup(`

                    <h3>
                        📍 You are here
                    </h3>

                    <p>
                        Your current location
                    </p>

                    <p>
                        Latitude:
                        ${userLatitude.toFixed(5)}
                    </p>

                    <p>
                        Longitude:
                        ${userLongitude.toFixed(5)}
                    </p>

                `);


                // Remove old truck markers

                truckMarkers.forEach(
                    function (marker) {

                        map.removeLayer(
                            marker
                        );

                    }
                );


                truckMarkers = [];


                // ========================================
                // CREATE 3 TRUCKS
                // ========================================

                foodTrucks = [

                    {

                        name:
                            "Spice Express",

                        latitude:
                            userLatitude + 0.015,

                        longitude:
                            userLongitude,

                        status:
                            "Online",

                        food:
                            "🍔 Burgers • 🌯 Wraps",

                        rating:
                            4.8

                    },


                    {

                        name:
                            "Tasty Wheels",

                        latitude:
                            userLatitude,

                        longitude:
                            userLongitude + 0.015,

                        status:
                            "Online",

                        food:
                            "🍕 Pizza • 🍟 Fries",

                        rating:
                            4.6

                    },


                    {

                        name:
                            "Street Bites",

                        latitude:
                            userLatitude - 0.015,

                        longitude:
                            userLongitude,

                        status:
                            "Online",

                        food:
                            "🌮 Tacos • 🍔 Burgers",

                        rating:
                            4.7

                    }

                ];


                // ========================================
                // ADD TRUCK MARKERS
                // ========================================

                foodTrucks.forEach(
                    function (truck) {

                        const marker =
                            L.marker(

                                [
                                    truck.latitude,
                                    truck.longitude
                                ],

                                {
                                    icon:
                                        foodTruckIcon
                                }

                            ).addTo(map);


                        marker.bindPopup(`

                            <h3>
                                🚚 ${truck.name}
                            </h3>

                            <p>
                                🟢 ${truck.status}
                            </p>

                            <p>
                                ${truck.food}
                            </p>

                            <p>
                                ⭐ Rating:
                                ${truck.rating}
                            </p>

                        `);


                        truckMarkers.push(
                            marker
                        );

                    }
                );


                // ========================================
                // SHOW USER + TRUCKS
                // ========================================

                const locations = [

                    [
                        userLatitude,
                        userLongitude
                    ]

                ];


                foodTrucks.forEach(
                    function (truck) {

                        locations.push([

                            truck.latitude,
                            truck.longitude

                        ]);

                    }
                );


                map.fitBounds(

                    L.latLngBounds(
                        locations
                    ),

                    {

                        padding:
                            [80, 80],

                        maxZoom:
                            14

                    }

                );


                // Find nearest truck

                findNearestTruck(

                    userLatitude,
                    userLongitude

                );


                // Display trucks

                displayFoodTrucks(

                    userLatitude,
                    userLongitude

                );

            },


            function () {

                alert(
                    "Please allow location access."
                );

            }

        );

    }
);


// ========================================
// 6. CALCULATE DISTANCE
// ========================================

function calculateDistance(

    latitude1,
    longitude1,

    latitude2,
    longitude2

) {

    const R = 6371;


    const dLat =
        (latitude2 - latitude1)
        * Math.PI / 180;


    const dLon =
        (longitude2 - longitude1)
        * Math.PI / 180;


    const a =

        Math.sin(dLat / 2) *
        Math.sin(dLat / 2)

        +

        Math.cos(
            latitude1 *
            Math.PI / 180
        )

        *

        Math.cos(
            latitude2 *
            Math.PI / 180
        )

        *

        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);


    const c =
        2 *
        Math.atan2(

            Math.sqrt(a),

            Math.sqrt(1 - a)

        );


    return R * c;

}


// ========================================
// 7. FIND NEAREST TRUCK
// ========================================

function findNearestTruck(

    userLatitude,
    userLongitude

) {

    let nearestTruck =
        null;

    let shortestDistance =
        Infinity;


    foodTrucks.forEach(
        function (truck) {

            const distance =
                calculateDistance(

                    userLatitude,
                    userLongitude,

                    truck.latitude,
                    truck.longitude

                );


            if (
                distance <
                shortestDistance
            ) {

                shortestDistance =
                    distance;

                nearestTruck =
                    truck;

            }

        }
    );


    if (!nearestTruck) {
        return;
    }


    document.getElementById(
        "nearest-truck"
    ).textContent =
        nearestTruck.name;


    document.getElementById(
        "nearest-distance"
    ).textContent =
        "Distance: " +
        shortestDistance.toFixed(2) +
        " km";


    const averageSpeed =
        30;


    const eta =
        Math.ceil(

            (shortestDistance /
                averageSpeed) *
            60

        );


    document.getElementById(
        "nearest-eta"
    ).textContent =
        "ETA: " +
        eta +
        " min";

}


// ========================================
// 8. DISPLAY FOOD TRUCK CARDS
// ========================================

function displayFoodTrucks(

    userLatitude,
    userLongitude

) {

    const truckList =
        document.getElementById(
            "truck-list"
        );


    truckList.innerHTML = "";


    foodTrucks.forEach(
        function (truck, index) {

            const distance =
                calculateDistance(

                    userLatitude,
                    userLongitude,

                    truck.latitude,
                    truck.longitude

                );


            const eta =
                Math.ceil(

                    (distance / 30) *
                    60

                );


            const truckCard =
                document.createElement(
                    "div"
                );


            truckCard.className =
                "truck-card";


            truckCard.dataset.search =

                (

                    truck.name +
                    " " +
                    truck.food

                ).toLowerCase();


            truckCard.addEventListener(
                "click",
                function () {

                    map.setView(

                        [
                            truck.latitude,
                            truck.longitude
                        ],

                        15

                    );


                    if (
                        truckMarkers[index]
                    ) {

                        truckMarkers[index]
                            .openPopup();

                    }

                }
            );


            truckCard.innerHTML = `

                <h3>
                    🚚 ${truck.name}
                </h3>

                <p>
                    🟢 ${truck.status}
                </p>

                <p>
                    ${truck.food}
                </p>

                <p>
                    ⭐ Rating:
                    ${truck.rating}
                </p>

                <p>
                    📏 Distance:
                    ${distance.toFixed(2)}
                    km
                </p>

                <p>
                    ⏱️ ETA:
                    ${eta}
                    min
                </p>

            `;


            truckList.appendChild(
                truckCard
            );

        }
    );

}


// ========================================
// 9. SEARCH FOOD TRUCKS
// ========================================

document.addEventListener(
    "input",
    function (event) {

        if (
            event.target.id !==
            "truck-search"
        ) {

            return;

        }


        const searchText =
            event.target.value
                .toLowerCase()
                .trim();


        const cards =
            document.querySelectorAll(
                ".truck-card"
            );


        cards.forEach(
            function (card, index) {

                const cardText =
                    card.textContent
                        .toLowerCase();


                if (
                    cardText.includes(
                        searchText
                    )
                ) {

                    card.style.display =
                        "";

                } else {

                    card.style.display =
                        "none";

                }


                if (
                    truckMarkers[index]
                ) {

                    const truck =
                        foodTrucks[index];


                    const truckText = (

                        truck.name +
                        " " +
                        truck.food

                    ).toLowerCase();


                    if (
                        truckText.includes(
                            searchText
                        )
                    ) {

                        if (
                            !map.hasLayer(
                                truckMarkers[index]
                            )
                        ) {

                            truckMarkers[index]
                                .addTo(map);

                        }

                    } else {

                        if (
                            map.hasLayer(
                                truckMarkers[index]
                            )
                        ) {

                            map.removeLayer(
                                truckMarkers[index]
                            );

                        }

                    }

                }

            }
        );

    }
);


// ========================================
// 10. CLEAR SEARCH
// ========================================

const clearSearch =
    document.getElementById(
        "clear-search"
    );


clearSearch.addEventListener(
    "click",
    function () {

        const searchInput =
            document.getElementById(
                "truck-search"
            );


        searchInput.value = "";


        const cards =
            document.querySelectorAll(
                ".truck-card"
            );


        cards.forEach(
            function (card) {

                card.style.display =
                    "";

            }
        );


        truckMarkers.forEach(
            function (marker) {

                if (
                    !map.hasLayer(marker)
                ) {

                    marker.addTo(map);

                }

            }
        );

    }
);


// ========================================
// 11. SHOPPING CART
// ========================================

let cart = [];


// ========================================
// 12. ADD TO CART
// ========================================

document.addEventListener(
    "click",
    function (event) {

        if (
            !event.target.classList
                .contains("add-cart")
        ) {

            return;

        }


        const button =
            event.target;


        const foodName =
            button.getAttribute(
                "data-name"
            );


        const foodPrice =
            Number(

                button.getAttribute(
                    "data-price"
                )

            );


        cart.push({

            name:
                foodName,

            price:
                foodPrice

        });


        updateCartCount();


        button.textContent =
            "✅ Added";


        setTimeout(
            function () {

                button.textContent =
                    "🛒 Add to Cart";

            },
            1000
        );

    }
);


// ========================================
// 13. UPDATE CART COUNT
// ========================================

function updateCartCount() {

    const cartCount =
        document.querySelector(
            ".cart span"
        );


    cartCount.textContent =
        cart.length;

}


// ========================================
// 14. CART ELEMENTS
// ========================================

const cartLink =
    document.querySelector(
        ".cart"
    );


const cartModal =
    document.getElementById(
        "cart-modal"
    );


const closeCart =
    document.getElementById(
        "close-cart"
    );


const cartItems =
    document.getElementById(
        "cart-items"
    );


const cartTotal =
    document.getElementById(
        "cart-total"
    );


// ========================================
// 15. OPEN CART
// ========================================

cartLink.addEventListener(
    "click",
    function (event) {

        event.preventDefault();


        cartModal.style.display =
            "flex";


        displayCart();

    }
);


// ========================================
// 16. CLOSE CART
// ========================================

closeCart.addEventListener(
    "click",
    function () {

        cartModal.style.display =
            "none";

    }
);


// ========================================
// 17. DISPLAY CART
// ========================================

function displayCart() {

    cartItems.innerHTML = "";

    let total = 0;


    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";


        cartTotal.textContent =
            "₹0";


        return;

    }


    cart.forEach(
        function (item, index) {

            const itemElement =
                document.createElement(
                    "div"
                );


            itemElement.className =
                "cart-item";


            itemElement.innerHTML = `

                <div>

                    <strong>
                        ${item.name}
                    </strong>

                    <p>
                        ₹${item.price}
                    </p>

                </div>

                <button
                    class="remove-item"
                    data-index="${index}">
                    ❌
                </button>

            `;


            cartItems.appendChild(
                itemElement
            );


            total +=
                Number(item.price);

        }
    );


    cartTotal.textContent =
        "₹" + total;

}


// ========================================
// 18. REMOVE ITEM
// ========================================

document.addEventListener(
    "click",
    function (event) {

        if (
            !event.target.classList
                .contains("remove-item")
        ) {

            return;

        }


        const index =
            Number(

                event.target.getAttribute(
                    "data-index"
                )

            );


        cart.splice(
            index,
            1
        );


        updateCartCount();


        displayCart();

    }
);

// ========================================
// PAYMENT MODE
// ========================================

const paymentSection =
    document.getElementById("payment-section");

const confirmPayment =
    document.getElementById("confirm-payment");


// ========================================
// 19. CHECKOUT - SHOW PAYMENT OPTIONS
// ========================================

document.addEventListener("click", function (event) {

    if (event.target.id !== "checkout-button") {
        return;
    }

    if (cart.length === 0) {

        alert("🛒 Your cart is empty!");

        return;
    }

    // Hide checkout button
    event.target.style.display = "none";

    // Show payment options
    paymentSection.style.display = "block";

});
// ========================================
// 19. CHECKOUT + ORDER TRACKING
// ========================================

document.addEventListener("click", function (event) {

    // Check if Checkout button was clicked
    if (event.target.id !== "checkout-button") {
        return;
    }


    // Check empty cart
    if (cart.length === 0) {

        alert("🛒 Your cart is empty!");

        return;
    }

// ========================================
// GET PAYMENT MODE
// ========================================

const selectedPayment =
    document.querySelector(
        'input[name="payment"]:checked'
    );

const paymentMode =
    selectedPayment
        ? selectedPayment.value
        : "Cash on Delivery";
    // ========================================
    // CALCULATE TOTAL
    // ========================================

    let total = 0;

    cart.forEach(function (item) {

        total += Number(item.price);

    });


    // ========================================
    // GENERATE ORDER ID
    // ========================================

    const orderId =
        "FT" +
        Math.floor(
            100000 + Math.random() * 900000
        );
        // ========================================
// SAVE ORDER TO ORDER HISTORY
// ========================================

let orderTotal = 0;

cart.forEach(function (item) {

    orderTotal += Number(item.price);

});


orderHistory.push({

    orderId: orderId,

    items: [...cart],

    total: orderTotal,

    date: new Date().toLocaleString(),

    status: "Order Placed"

});


    // ========================================
    // CREATE ORDER DETAILS
    // ========================================

    let orderDetails = "";

    cart.forEach(function (item) {

        orderDetails +=
            "🍴 " +
            item.name +
            " - ₹" +
            item.price +
            "\n";

    });

// ========================================
// SHOW PAYMENT OPTIONS
// ========================================

const paymentSection =
    document.getElementById("payment-section");

if (paymentSection) {

    paymentSection.style.display = "block";

}
    // ========================================
    // CLOSE CART
    // ========================================

    cartModal.style.display = "none";


    // ========================================
    // SHOW ORDER CONFIRMATION
    // ========================================

    alert(

        "🎉 ORDER PLACED SUCCESSFULLY!\n\n" +

        "🧾 Order ID: " +
        orderId +
        "\n\n" +

        orderDetails +

        "\n💰 Total Amount: ₹" +
        total +

        "\n\n⏱️ Ready in approximately 15 minutes." +

        "\n\n🚚 Your food is being prepared!"

    );


    // ========================================
    // SHOW ORDER TRACKING
    // ========================================

    const trackingSection =
        document.getElementById(
            "order-tracking"
        );

    const trackingOrderId =
        document.getElementById(
            "tracking-order-id"
        );

    const trackingStatus =
        document.getElementById(
            "tracking-status"
        );


    // Show tracking section

    trackingSection.style.display =
        "block";


    // Show order ID

    trackingOrderId.textContent =
        "🧾 Order ID: " +
        orderId;


    // Initial status

    trackingStatus.textContent =
        "🧾 Order Placed";


    // ========================================
    // TRACKING STEPS
    // ========================================

    const trackingSteps =
        document.querySelectorAll(
            ".tracking-step"
        );


    // Remove old active states

    trackingSteps.forEach(
        function (step) {

            step.classList.remove(
                "active"
            );

        }
    );


    // First step active

    if (trackingSteps[0]) {

        trackingSteps[0]
            .classList.add("active");

    }


    // ========================================
    // PREPARING
    // ========================================

    setTimeout(function () {

        if (trackingSteps[1]) {

            trackingSteps[1]
                .classList.add("active");

        }

        trackingStatus.textContent =
            "👨‍🍳 Your food is being prepared.";

    }, 5000);


    // ========================================
    // READY
    // ========================================

    setTimeout(function () {

        if (trackingSteps[2]) {

            trackingSteps[2]
                .classList.add("active");

        }

        trackingStatus.textContent =
            "🍱 Your order is ready!";

    }, 10000);


    // ========================================
    // ON THE WAY
    // ========================================

    setTimeout(function () {

        if (trackingSteps[3]) {

            trackingSteps[3]
                .classList.add("active");

        }

        trackingStatus.textContent =
            "🚚 Your food is on the way!";

    }, 15000);


    // ========================================
    // DELIVERED
    // ========================================

    setTimeout(function () {

        if (trackingSteps[4]) {

            trackingSteps[4]
                .classList.add("active");

        }

        trackingStatus.textContent =
            "✅ Order delivered successfully!";

    }, 20000);


    // ========================================
    // CLEAR CART
    // ========================================
// ========================================
// SAVE ORDER TO MY ORDERS
// ========================================

saveOrderToMyOrders(
    orderId,
    total,
    orderDetails
);
    cart = [];


    updateCartCount();


    displayCart();

});
// ========================================
// CLOSE CART WHEN CLICKING OUTSIDE
// ========================================

cartModal.addEventListener("click", function (event) {

    if (event.target === cartModal) {

        cartModal.style.display = "none";

    }

});
// ========================================
// 20. MY ORDERS / ORDER HISTORY
// ========================================

let orderHistory = [];


// ========================================
// DISPLAY ORDER HISTORY
// ========================================

function displayOrderHistory() {

    const ordersList =
        document.getElementById("orders-list");

    if (!ordersList) {
        return;
    }

    ordersList.innerHTML = "";


    // No orders

    if (orderHistory.length === 0) {

        ordersList.innerHTML = `
            <p class="no-orders">
                🛒 No orders yet.
            </p>
        `;

        return;
    }


    // Display orders

    orderHistory.forEach(function (order) {

        const orderCard =
            document.createElement("div");

        orderCard.className =
            "order-card";


        let itemsHTML = "";


        order.items.forEach(function (item) {

            itemsHTML += `
                <p>
                    🍴 ${item.name}
                    - ₹${item.price}
                </p>
            `;

        });


        orderCard.innerHTML = `

            <h3>
                🧾 Order ID: ${order.orderId}
            </h3>

            <p>
                📅 ${order.date}
            </p>

            <div class="order-items">
                ${itemsHTML}
            </div>

            <h3>
                💰 Total: ₹${order.total}
            </h3>

            <p>
                📦 Status:
                <strong>${order.status}</strong>
            </p>

        `;


        ordersList.appendChild(
            orderCard
        );

    });

}


// ========================================
// MY ORDERS BUTTON
// ========================================

const ordersLink =
    document.getElementById("orders-link");


if (ordersLink) {

    ordersLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            const ordersSection =
                document.getElementById(
                    "orders-section"
                );

            ordersSection.scrollIntoView({
                behavior: "smooth"
            });

            displayOrderHistory();

        }
    );

}
// ========================================
// SAVE ORDER TO MY ORDERS
// ========================================

function saveOrderToMyOrders(orderId, total, orderDetails) {

    const ordersList =
        document.getElementById("orders-list");

    if (!ordersList) {
        return;
    }

    const orderCard =
        document.createElement("div");

    orderCard.className = "order-card";

    orderCard.innerHTML = `

        <h3>📦 Order ID: ${orderId}</h3>

        <p>
            ${orderDetails.replace(/\n/g, "<br>")}
        </p>

        <h3>
            💰 Total Amount: ₹${total}
            "\n💳 Payment Mode: " +
paymentMode +
        </h3>

        <p>
            🟢 Order Placed Successfully
        </p>

    `;

    // Remove "No orders yet"
    const noOrders =
        ordersList.querySelector(".no-orders");

    if (noOrders) {
        noOrders.remove();
    }

    // Add newest order at the top
    ordersList.prepend(orderCard);
}
// ========================================
// PAYMENT BUTTON
// ========================================

const payButton =
    document.getElementById("pay-button");

if (payButton) {

    payButton.addEventListener("click", function () {

        const selectedPayment =
            document.querySelector(
                'input[name="payment"]:checked'
            );

        if (!selectedPayment) {

            alert("💳 Please select a payment mode.");

            return;
        }

        alert(
    "🎉 PAYMENT SUCCESSFUL!\n\n" +
    "💳 Payment Mode: " +
    selectedPayment.value +
    "\n\n" +
    "Your order will now be placed."
);

    });

}
