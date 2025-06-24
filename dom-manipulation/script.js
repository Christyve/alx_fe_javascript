// Initial set of quotes
const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
  { text: "Creativity is intelligence having fun.", category: "Creativity" }
];

// Reference DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const quoteFormContainer = document.getElementById("quoteFormContainer");

// ✅ Function: Display a random quote using innerHTML
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"<em>${quote.text}</em>"<br><small>— ${quote.category}</small>`;
}

// ✅ Create and display the form to add new quotes
function createAddQuoteForm() {
  const form = document.createElement("div");

  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  form.appendChild(inputText);
  form.appendChild(inputCategory);
  form.appendChild(addButton);

  quoteFormContainer.appendChild(form);
}

// ✅ Add new quote to array and update UI
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!quoteText || !quoteCategory) {
    alert("Both fields are required.");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("New quote added successfully!");
}

// ✅ Event listener to show random quote
newQuoteBtn.addEventListener("click", displayRandomQuote);

// ✅ Initialize form on page load
createAddQuoteForm();
