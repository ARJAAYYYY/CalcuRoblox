
const fareMatrix = {
    "bulTobal": { // BULAKAN - BALAGTAS (Top table)
        "bagumbayan": { regular: [14, 28, 42, 56, 70], discounted: [12, 24, 36, 48, 60] },
        "Matungao":   { regular: [14, 28, 42, 56, 70], discounted: [12, 24, 36, 48, 60] },
        "Panginay":   { regular: [14, 28, 42, 56, 70], discounted: [12, 24, 36, 48, 60] }, // Panginay GGT
        "balagtas":   { regular: [14, 28, 42, 56, 70], discounted: [12, 24, 36, 48, 60] }, // Panginay Balagtas
        "WAWA":       { regular: [16, 32, 48, 64, 80], discounted:  [14, 28, 42, 56, 70] }
    },
    "balTobul": { // BALAGTAS - BULAKAN (Bottom table)
        "WAWA":       { regular: [14, 28, 42, 56, 70], discounted: [12, 24, 36, 48, 60] },
        "balagtas":   { regular: [14, 28, 42, 56, 70], discounted:[12, 24, 36, 48, 60] }, // Panginay Balagtas
        "Panginay":   { regular: [14, 28, 42, 56, 70], discounted: [12, 24, 36, 48, 60] }, // Panginay GGT
        "Matungao":   { regular: [14, 28, 42, 56, 70], discounted: [12, 24, 36, 48, 60] },
        "bagumbayan": { regular:  [16, 32, 48, 64, 80], discounted: [14, 28, 42, 56, 70] }
    }
};

const getSelectedValue = (name) => {
    const activeRadio = document.querySelector(`input[name="${name}"]:checked`);
    return activeRadio ? activeRadio.value : null;
};

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
    const currentStation = getSelectedValue("station");
    const passengerCount = parseInt(getSelectedValue("passengers"));
    const cashReceived = parseFloat(getSelectedValue("money"));

    // Guard fallback checks if elements are missing
    if (!outputDiv || !expenseLi || !changeLi) {
        console.error("⚠️ UI Output boxes are missing from the HTML document.");
        return;
    }

    // Validate selections
    if (!currentRoute || !currentStation || isNaN(passengerCount)) {
        outputDiv.innerHTML = "⚠️ Please select a route, station, and passenger count.";
        return;
    }

    if (isNaN(cashReceived) || cashReceived < 0) {
        outputDiv.innerHTML = "⚠️ Please select a valid cash amount.";
        return;
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