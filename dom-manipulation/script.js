// Initial Quotes
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Don't cry because it's over, smile because it happened.", category: "Inspiration" }
];

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect");


// Display a random quote
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
  
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<em>No quotes in this category.</em>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `<blockquote>"${randomQuote.text}"</blockquote><small>- ${randomQuote.category}</small>`;
}

// Add a new quote dynamically
function createAddQuoteForm() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!quoteText || !quoteCategory) {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuote = { text: quoteText, category: quoteCategory };
  quotes.push(newQuote);

  // Add category to dropdown if new
  if (![...categorySelect.options].some(opt => opt.value.toLowerCase() === quoteCategory.toLowerCase())) {
    const newOption = document.createElement("option");
    newOption.value = quoteCategory;
    newOption.textContent = quoteCategory;
    categorySelect.appendChild(newOption);
  }

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("New quote added!");
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Initial setup
function init() {
  // Populate category dropdown
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  showRandomQuote();
}


// Export quotes to JSON
function exportToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// Import quotes from JSON
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
        initCategoryOptions();
      } else {
        alert("Invalid JSON format.");
      }
    } catch (error) {
      alert("Failed to import quotes: " + error.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initialize category dropdown
function initCategoryOptions() {
  // Clear and reset dropdown
  categorySelect.innerHTML = `<option value="all">All</option>`;
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// Load last viewed quote (optional)
function loadLastViewedQuote() {
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    quoteDisplay.innerHTML = `<blockquote>"${quote.text}"</blockquote><small>- ${quote.category}</small>`;
  }
}

// Initialization
function init() {
  loadQuotes();
  initCategoryOptions();
  loadLastViewedQuote();
}

// Event Listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
window.addEventListener("DOMContentLoaded", init);
