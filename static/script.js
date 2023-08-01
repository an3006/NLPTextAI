

function compareText() {
    const text1 = document.getElementById("text1").value;
    const text2 = document.getElementById("text2").value;

    const data = { text1: text1, text2: text2 };

    console.log("Data being sent in the POST request:", data);

    fetch("http://127.0.0.1:5000/compare", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Data being sent in the POST response:", data);
        document.getElementById("result").innerHTML = `
        <p class="similarity-text">Similarity: <span class="black">${data.similarity.toFixed(2)}%</span></p>
        <p class="word-count-text">Word Count in Text 1: <span class="black">${data.word_count_text1}</span></p>
        <p class="word-count-text">Word Count in Text 2: <span class="black">${data.word_count_text2}</span></p>
        <div class="summary-container">
            <h3>Summary of Text 1:</h3>
            <p id="summary-text1" class="summary-text">${data.summary_text1}</p>
        </div>
        <div class="summary-container">
            <h3>Summary of Text 2:</h3>
            <p id="summary-text2" class="summary-text">${data.summary_text2}</p>
        </div>`;
          // Typewriter effect for Summary of Text 1
          typewriterEffect("summary-text1", data.summary_text1);

          // Typewriter effect for Summary of Text 2
          typewriterEffect("summary-text2", data.summary_text2);
  
           // Make sure the result section is visible
           const resultSection = document.getElementById("result");
           resultSection.style.display = "block";
    })
    .catch(error => console.error("Error:", error));
}



// Function to set the default color selection to "green" on page load
function setDefaultColorSelection() {
    // Get the selected color from the browser's local storage
    const selectedColor = localStorage.getItem("selectedColor");

    // Get the color selection dropdown element
    const colorSelect = document.getElementById("dashboard-color");

    if (selectedColor) {
        // If a color was previously selected, update the dropdown selection
        colorSelect.value = selectedColor;
    } else {
        // If no color was previously selected, set the default to "green"
        colorSelect.value = "green";

        // Update the local storage with the default value of "green"
        localStorage.setItem("selectedColor", "green");
    }

    // Call the changeDashboardColor() function to update the dashboard color
    changeDashboardColor();
}

// Call the setDefaultColorSelection() function on page load
document.addEventListener("DOMContentLoaded", setDefaultColorSelection);

// Function to change the dashboard color
function changeDashboardColor() {
    const colorSelect = document.getElementById("dashboard-color");
    const selectedColor = colorSelect.value;

    const dashboard = document.querySelector(".dashboard");

    // Update the CSS class of the dashboard based on the selected color
    dashboard.className = "dashboard " + selectedColor;

    // Update the selected color in the local storage
    localStorage.setItem("selectedColor", selectedColor);
}


// Function to clear text and hide result section
function clearText() {
    // Clear the textareas
    document.getElementById("text1").value = "";
    document.getElementById("text2").value = "";

    // Clear the summary texts
    document.getElementById("summary-text1").textContent = "";
    document.getElementById("summary-text2").textContent = "";

    // Clear the similarity text and word counts
    document.querySelector(".similarity-text span").textContent = "";
    document.querySelectorAll(".word-count-text span").forEach(span => span.textContent = "");


    // Clear the result section and hide it
    const resultSection = document.getElementById("result");
    resultSection.style.display = "none";
}

// Typewriter effect function
function typewriterEffect(elementId, text) {
    const element = document.getElementById(elementId);
    element.textContent = "";

    const typingSpeed = 5; // Adjust the typing speed here (lower value means faster typing)
    let charIndex = 0;

    function typeNextChar() {
        if (charIndex < text.length) {
            element.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(typeNextChar, typingSpeed);
        }
    }

    typeNextChar();
}

