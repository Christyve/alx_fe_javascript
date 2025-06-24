// Initial quotes array
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Simplicity is the soul of efficiency.", category: "Productivity" }
];

// Function to show a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
}

// Event listener for the 'Show New Quote' button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Function to add a new quote
function addQuote() {
  const quoteTextInput = document.getElementById("newQuoteText");
  const quoteCategoryInput = document.getElementById("newQuoteCategory");
  const text = quoteTextInput.value.trim();
  const category = quoteCategoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    quoteTextInput.value = "";
    quoteCategoryInput.value = "";
    alert("Quote added successfully!");
  } else {
    alert("Please fill in both the quote and the category.");
  }
}
