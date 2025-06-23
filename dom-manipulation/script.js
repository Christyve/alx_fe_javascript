let quotes = [];
const defaultQuotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "motivation" },
  { text: "Success usually comes to those who are too busy to be looking for it.", category: "success" },
  { text: "Creativity is intelligence having fun.", category: "creativity" },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const importInput = document.getElementById("importFile");
const exportBtn = document.getElementById("exportBtn");
const categoryFilter = document.getElementById("categoryFilter");

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  quotes = stored ? JSON.parse(stored) : defaultQuotes;
  saveQuotes();
}

function saveFilterSelection(category) {
  localStorage.setItem("lastSelectedCategory", category);
}

function getFilterSelection() {
  return localStorage.getItem("lastSelectedCategory") || "all";
}

function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filtered = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.textContent = `"${randomQuote.text}"`;
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

function addQuote(text, category) {
  if (!text || !category) {
    alert("Please provide both quote and category.");
    return;
  }

  quotes.push({ text, category: category.toLowerCase() });
  saveQuotes();
  populateCategories(); // Update dropdown
  alert("Quote added!");
}

function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  const selected = getFilterSelection();

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(option);
  });

  categoryFilter.value = selected;
}

// Triggered when dropdown changes
function filterQuotes() {
  const selected = categoryFilter.value;
  saveFilterSelection(selected);
  showRandomQuote();
}

function createAddQuoteForm() {
  const container = document.createElement("div");
  container.style.marginTop = "20px";

  const heading = document.createElement("h2");
  heading.textContent = "Add a New Quote";
  container.appendChild(heading);

  const quoteInput = document.createElement("input");
  quoteInput.placeholder = "Enter a new quote";
  quoteInput.id = "newQuoteText";
  container.appendChild(quoteInput);

  const categoryInput = document.createElement("input");
  categoryInput.placeholder = "Enter quote category";
  categoryInput.id = "newQuoteCategory";
  container.appendChild(categoryInput);

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.addEventListener("click", () => {
    const quote = quoteInput.value.trim();
    const category = categoryInput.value.trim();
    addQuote(quote, category);
    quoteInput.value = "";
    categoryInput.value = "";
  });
  container.appendChild(addBtn);

  document.body.appendChild(container);
}

// Export Quotes
exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Import Quotes
importInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error("Invalid JSON format");
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Import failed: " + err.message);
    }
  };
  reader.readAsText(file);
});

// === INIT ===
loadQuotes();
populateCategories();
createAddQuoteForm();

newQuoteBtn.addEventListener("click", showRandomQuote);

// Restore last quote from session
const last = sessionStorage.getItem("lastQuote");
if (last) {
  const lastObj = JSON.parse(last);
  quoteDisplay.textContent = `"${lastObj.text}"`;
} else {
  showRandomQuote();
}
