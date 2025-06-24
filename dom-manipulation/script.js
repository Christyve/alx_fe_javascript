// Array to store quote objects
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "Business" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
  { text: "Strive not to be a success, but rather to be of value.", category: "Life" },
  { text: "The mind is everything. What you think you become.", category: "Mindset" }
];

// Get references to DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
const quoteTextElement = document.getElementById('quoteText');
const quoteCategoryElement = document.getElementById('quoteCategory');

/**
 * Displays a random quote from the 'quotes' array in the 'quoteDisplay' div.
 * If the quotes array is empty, it displays a message.
 */
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteTextElement.textContent = "No quotes available. Add some!";
    quoteCategoryElement.textContent = "";
    return;
  }

  // Generate a random index
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Update the text content of the quote elements
  quoteTextElement.textContent = `"${randomQuote.text}"`;
  quoteCategoryElement.textContent = `- ${randomQuote.category}`;
}

/**
 * Adds a new quote to the 'quotes' array based on user input from the form fields.
 * It validates inputs, adds the quote, clears the input fields, and then
 * displays a random quote (which might be the newly added one).
 */
function addQuote() {
  const quoteText = newQuoteTextInput.value.trim();
  const quoteCategory = newQuoteCategoryInput.value.trim();

  // Validate that both fields are not empty
  if (quoteText === "" || quoteCategory === "") {
    // Instead of alert, we'll display a message in the quote display area temporarily
    quoteTextElement.textContent = "Please enter both quote text and category.";
    quoteCategoryElement.textContent = "";
    // Clear message after a few seconds
    setTimeout(showRandomQuote, 3000);
    return;
  }

  // Create a new quote object
  const newQuote = {
    text: quoteText,
    category: quoteCategory
  };

  // Add the new quote to the array
  quotes.push(newQuote);

  // Clear the input fields
  newQuoteTextInput.value = "";
  newQuoteCategoryInput.value = "";

  // Optionally, show the newly added quote or a confirmation.
  // For this implementation, we'll just show a random quote which might be the new one.
  quoteTextElement.textContent = `"${newQuote.text}"`;
  quoteCategoryElement.textContent = `- ${newQuote.category} (New!)`;
  setTimeout(showRandomQuote, 3000); // Revert to random after 3 seconds
}

// Event listener for the "Show New Quote" button
newQuoteButton.addEventListener('click', showRandomQuote);

// Initial display of a random quote when the page loads
document.addEventListener('DOMContentLoaded', showRandomQuote);
