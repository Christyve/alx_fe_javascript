let quotes = [];
const defaultQuotes = [
  { id: 1, text: "The best way to get started is to quit talking and begin doing.", category: "motivation" },
  { id: 2, text: "Success usually comes to those who are too busy to be looking for it.", category: "success" },
  { id: 3, text: "Creativity is intelligence having fun.", category: "creativity" },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const importInput = document.getElementById("importFile");
const exportBtn = document.getElementById("exportBtn");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");

// Util
function notifyUser(message) {
  notification.textContent = message;
  setTimeout(() => (notification.textContent = ""), 4000);
}

// Load/save quotes
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  quotes = stored ? JSON.parse(stored) : defaultQuotes;
  saveQuotes();
}

// ID generator
function generateId() {
  return Date.now();
}

// UI
function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  const selected = localStorage.getItem("lastSelectedCategory") || "all";

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(option);
  });

  categoryFilter.value = selected;
}

function filterQuotes() {
  localStorage.setItem("lastSelectedCategory", categoryFilter.value);
  showRandomQuote();
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

function createAddQuoteForm() {
  const container = document.createElement("div");
  container.style.marginTop = "20px";

  const heading = document.createElement("h2");
  heading.textContent = "Add a New Quote";
  container.appendChild(heading);

  const quoteInput = document.createElement("input");
  quoteInput.placeholder = "Enter a new quote";
  container.appendChild(quoteInput);

  const categoryInput = document.createElement("input");
  categoryInput.placeholder = "Enter quote category";
  container.appendChild(categoryInput);

  const btn = document.createElement("button");
  btn.textContent = "Add Quote";
  btn.addEventListener("click", () => {
    const text = quoteInput.value.trim();
    const category = categoryInput.value.trim();
    if (!text || !category) {
      alert("Please fill in both fields.");
      return;
    }

    const newQuote = { id: generateId(), text, category: category.toLowerCase() };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    notifyUser("Quote added!");
    quoteInput.value = "";
    categoryInput.value = "";
  });
  container.appendChild(btn);

  document.body.appendChild(container);
}

// Export
exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Import
importInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error("Invalid JSON");
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      notifyUser("Quotes imported successfully!");
    } catch (err) {
      alert("Import failed: " + err.message);
    }
  };
  reader.readAsText(file);
});

// === Server Sync Simulation ===
// Simulate fetching from server every 10s
setInterval(syncWithServer, 10000);

async function syncWithServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const serverData = await response.json();

    const newQuotes = serverData.map((post, index) => ({
      id: 1000 + post.id, // ensure no ID collision with local data
      text: post.title,
      category: ["motivation", "success", "humor", "life", "wisdom"][index % 5]
    }));

    let conflictCount = 0;

    newQuotes.forEach(serverQuote => {
      const localIndex = quotes.findIndex(q => q.id === serverQuote.id);
      if (localIndex !== -1) {
        const localQuote = quotes[localIndex];
        if (localQuote.text !== serverQuote.text || localQuote.category !== serverQuote.category) {
          // Conflict: Server wins
          quotes[localIndex] = serverQuote;
          conflictCount++;
        }
      } else {
        quotes.push(serverQuote);
      }
    });

    saveQuotes();
    populateCategories();

    if (conflictCount > 0) {
      notifyUser(`${conflictCount} conflicts resolved from server.`);
    } else {
      notifyUser("Synced with server.");
    }
  } catch (err) {
    console.error("Sync failed:", err);
  }
}

// === INIT ===
loadQuotes();
populateCategories();
createAddQuoteForm();
newQuoteBtn.addEventListener("click", showRandomQuote);

// Restore last session quote
const last = sessionStorage.getItem("lastQuote");
if (last) {
  quoteDisplay.textContent = `"${JSON.parse(last).text}"`;
} else {
  showRandomQuote();
}
