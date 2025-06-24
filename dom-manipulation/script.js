const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "motivation" },
  { text: "Success usually comes to those who are too busy to be looking for it.", category: "success" },
  { text: "Creativity is intelligence having fun.", category: "creativity" },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.createElement("select");
categorySelect.id = "categorySelect";

function updateCategoryOptions() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = `<option value="all">All</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categorySelect.appendChild(option);
  });
}

function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}"`;
}

function addQuote(text, category) {
  if (!text || !category) {
    alert("Please provide both quote text and category.");
    return;
  }

  quotes.push({ text, category: category.toLowerCase() });
  updateCategoryOptions();
  alert("Quote added successfully!");
}

function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const heading = document.createElement("h2");
  heading.textContent = "Add a New Quote";
  formContainer.appendChild(heading);

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";
  formContainer.appendChild(quoteInput);

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  formContainer.appendChild(categoryInput);

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.addEventListener("click", () => {
    const quote = quoteInput.value.trim();
    const category = categoryInput.value.trim();
    addQuote(quote, category);
    quoteInput.value = "";
    categoryInput.value = "";
  });
  formContainer.appendChild(addBtn);

  document.body.appendChild(document.createElement("hr"));
  document.body.appendChild(formContainer);
}

// === INITIALIZATION ===
document.body.insertBefore(categorySelect, quoteDisplay);
updateCategoryOptions();
showRandomQuote();
createAddQuoteForm();

newQuoteBtn.addEventListener("click", showRandomQuote);
