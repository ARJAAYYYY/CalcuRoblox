
const fareMatrix = {
    "bulTobal": { // BULAKAN - BALAGTAS (Top table)
        "samePrice":   { regular: [14, 28, 42, 56, 70], discounted: [12, 24, 36, 48, 60] },
        "WAWA":       { regular: [16, 32, 48, 64, 80], discounted:  [14, 28, 42, 56, 70] }
    },
    "balTobul": { // BALAGTAS - BULAKAN (Bottom table)
        "bagumbayan":      { regular: [16, 32, 48, 64, 80], discounted:  [14, 28, 42, 56, 70] },
        "samePrice":   { regular: [14, 28, 42, 56, 70], discounted:[12, 24, 36, 48, 60] }, // Panginay Balagtas

    }
};

const getSelectedValue = (name) => {
    const activeRadio = document.querySelector(`input[name="${name}"]:checked`);
    return activeRadio ? activeRadio.value : null;
};

// UI Label Elements
const labelSt1 = document.getElementById('lbl-st1');
const labelSt2 = document.getElementById('lbl-st2');
const routeRadios = document.querySelectorAll('input[name="route"]');

// 1. Text UI Swapping Hook based on Route Direction Direction
routeRadios.forEach(radio => {
    radio.addEventListener('change', (event) => {
        if (event.target.value === 'bulTobal') {
            // Bulakan to Balagtas: Bagumbayan/Matungao/Panginay/Balagtas are the base stops (Box 1). Wawa is the far terminal (Box 2).
            labelSt1.textContent = "Wawa";
            labelSt2.textContent = "Bagumbayan, Matungao, Panginay, Balagtas";
        } else { // balTobul
            // Balagtas to Bulakan: Matungao/Panginay/Balagtas/Wawa become the base stops (Box 1). Bagumbayan shifts to the far terminal (Box 2).
            labelSt1.textContent = "Bagumbayan";
            labelSt2.textContent = "Matungao, Panginay, Balagtas, Wawa";
        }
    });
});

// DOM Output Elements
const outputDiv = document.getElementById("output");
const expenseLi = document.getElementById("receiptForexpense");
const changeLi = document.getElementById("totalChange");

// Button Action Triggers
const btnSenior = document.getElementById("seniorDiscount");
const btnNormal = document.getElementById("regularFare");

// Calculation Processing
function calculateFare(isDiscounted) {
    const currentRoute = getSelectedValue("route");
    const checkedStationBox = getSelectedValue("station"); // Reads 'st1' or 'st2'
    const passengerCount = parseInt(getSelectedValue("passengers"));
    const cashReceived = parseFloat(getSelectedValue("money"));

    // Guard fallback checks if elements are missing
    if (!outputDiv || !expenseLi || !changeLi) {
        console.error("⚠️ UI Output boxes are missing from the HTML document.");
        return;
    }

    // Validate selections
    if (!currentRoute || !checkedStationBox || isNaN(passengerCount)) {
        outputDiv.innerHTML = "⚠️ Please select a route, station, and passenger count.";
        return;
    }

    if (isNaN(cashReceived) || cashReceived < 0) {
        outputDiv.innerHTML = "⚠️ Please select a valid cash amount.";
        return;
    }

    // 2. MATRIX TRANSLATION KEY MAPPING
    // Maps st1 and st2 selections to your matrix keys depending on the chosen route
    let currentStation = "";
    if (currentRoute === 'bulTobal') {
        currentStation = (checkedStationBox === 'st1') ? 'WAWA' : 'samePrice';
    } else { // balTobul
        currentStation = (checkedStationBox === 'st1') ? 'bagumbayan' : 'samePrice';
    }

    const passengerIndex = passengerCount - 1;
    const stationData = fareMatrix[currentRoute][currentStation];
    const exactFare = isDiscounted ? stationData.discounted[passengerIndex] : stationData.regular[passengerIndex];
    const totalChange = cashReceived - exactFare;

    if (totalChange < 0) {
        outputDiv.innerHTML = `⚠️ Insufficient cash! Needs ₱${Math.abs(totalChange).toFixed(2)} more.`;
        expenseLi.innerHTML = `<span>Expense:</span> <span>₱${exactFare.toFixed(2)}</span>`;
        changeLi.innerHTML = `<span>Total Change:</span> <span>₱0.00</span>`;
    } else {
        outputDiv.innerHTML = `✅ Calculation successful for ${passengerCount} passenger(s).`;
        expenseLi.innerHTML = `<span>Expense:</span> <span>₱${exactFare.toFixed(2)}</span>`;
        changeLi.innerHTML = `<span>Total Change:</span> <span>₱${totalChange.toFixed(2)}</span>`;
    }
}

// Event Listeners
btnSenior.addEventListener("click", () => calculateFare(true));
btnNormal.addEventListener("click", () => calculateFare(false));