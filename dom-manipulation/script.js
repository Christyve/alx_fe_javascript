function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // Default quotes if none saved
    quotes = [
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "Don't cry because it's over, smile because it happened.", category: "Inspiration" }
    ];
    saveQuotes(); // Save the default to localStorage
  }
}

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

function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");

  // Reset filter dropdown
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  }
}

function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);

  const filteredQuotes = selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<em>No quotes in this category.</em>";
    return;
  }

  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.innerHTML = `<blockquote>"${randomQuote.text}"</blockquote><small>- ${randomQuote.category}</small>`;

  // Save last viewed quote in session
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

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

  populateCategories(); // Refresh category dropdowns

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

function notifyUser(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  setTimeout(() => {
    notification.textContent = "";
  }, 5000);
}

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock endpoint

// Simulate fetching quotes from server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    // Simulate quote format: { text, category }
    const serverQuotes = serverData.map(post => ({
      text: post.title,
      category: "Server"
    }));

    // Conflict resolution: Server data takes precedence
    const mergedQuotes = mergeQuotes(serverQuotes);
    quotes = mergedQuotes;
    saveQuotes();
    populateCategories();
    filterQuotes();
    notifyUser("Quotes synced from server.");
  } catch (error) {
    console.error("Failed to fetch server quotes:", error);
  }
}

async function syncQuotesToServer() {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quotes)
    });

    if (response.ok) {
      notifyUser("Local quotes synced to server successfully.");
    }
  } catch (error) {
    console.error("Failed to sync quotes to server:", error);
  }
}

function mergeQuotes(serverQuotes) {
  const existingTexts = new Set(quotes.map(q => q.text));
  const newQuotes = serverQuotes.filter(q => !existingTexts.has(q.text));
  return [...quotes, ...newQuotes];
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

function loadLastSelectedCategory() {
  const lastSelected = localStorage.getItem("selectedCategory");
  if (lastSelected) {
    document.getElementById("categoryFilter").value = lastSelected;
    filterQuotes(); // Show filtered quote on load
  }
}

// Initialization
function init() {
  loadQuotes();
  initCategoryOptions();
  populateCategories();
  loadLastViewedQuote();
  setInterval(fetchQuotesFromServer, 30000); // Check every 30s
}

// Event Listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
window.addEventListener("DOMContentLoaded", init);
