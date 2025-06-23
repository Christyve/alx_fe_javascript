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

// Load from localStorage
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  quotes = stored ? JSON.parse(stored) : defaultQuotes;
  saveQuotes(); // ensure structure
}

// Save to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show random quote
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filtered = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.textContent = `"${randomQuote.text}"`;

  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// Add quote
function addQuote(text, category) {
  if (!text || !category) {
    alert("Please provide both quote and category.");
    return;
  }

  quotes.push({ text, category: category.toLowerCase() });
  saveQuotes();
  updateCategoryOptions();
  alert("Quote added!");
}

// Category dropdown
const categorySelect = document.createElement("select");
categorySelect.id = "categorySelect";
document.body.insertBefore(categorySelect, quoteDisplay);

// Update dropdown options
function updateCategoryOptions() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = `<option value="all">All</option>`;
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categorySelect.appendChild(opt);
  });
}

// Add form via JS
function createAddQuoteForm() {
  const container = document.createElement("div");
  container.style.marginTop = "20px";

  const title = document.createElement("h2");
  title.textContent = "Add a New Quote";
  container.appendChild(title);

  const quoteInput = document.createElement("input");
  quoteInput.placeholder = "Enter a new quote";
  quoteInput.id = "newQuoteText";
  container.appendChild(quoteInput);

  const categoryInput = document.createElement("input");
  categoryInput.placeholder = "Enter quote category";
  categoryInput.id = "newQuoteCategory";
  container.appendChild(categoryInput);

  const btn = document.createElement("button");
  btn.textContent = "Add Quote";
  btn.addEventListener("click", () => {
    addQuote(quoteInput.value.trim(), categoryInput.value.trim());
    quoteInput.value = "";
    categoryInput.value = "";
  });
  container.appendChild(btn);

  document.body.appendChild(container);
}

// Export quotes
exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Import quotes
importInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error("Invalid JSON structure");
      quotes.push(...imported);
      saveQuotes();
      updateCategoryOptions();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Failed to import: " + err.message);
    }
  };
  reader.readAsText(file);
});

// INIT
loadQuotes();
updateCategoryOptions();
createAddQuoteForm();
newQuoteBtn.addEventListener("click", showRandomQuote);

// Restore last quote using sessionStorage
const last = sessionStorage.getItem("lastQuote");
if (last) {
  const lastObj = JSON.parse(last);
  quoteDisplay.textContent = `"${lastObj.text}"`;
} else {
  showRandomQuote();
}
