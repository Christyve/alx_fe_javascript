let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { id: 1, text: "The best way to get started is to quit talking and begin doing.", category: "motivation" },
  { id: 2, text: "Success is not in what you have, but who you are.", category: "success" }
];

let lastSelectedCategory = localStorage.getItem("selectedCategory") || "all";
sessionStorage.setItem("lastViewedQuote", "");

document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  showRandomQuote();
  document.getElementById("categoryFilter").value = lastSelectedCategory;
  setInterval(syncWithServer, 10000); // Sync every 10 seconds
});

function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];
  select.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });
}

function showRandomQuote() {
  const filter = document.getElementById("categoryFilter").value;
  const filteredQuotes = filter === "all" ? quotes : quotes.filter(q => q.category === filter);
  const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  const display = document.getElementById("quoteDisplay");
  display.textContent = quote ? quote.text : "No quotes available for this category.";
  sessionStorage.setItem("lastViewedQuote", quote?.text || "");
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) return alert("Please enter both quote and category.");

  const newQuote = {
    id: Date.now(),
    text,
    category
  };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  postQuoteToServer(newQuote); // Send to mock API
  alert("Quote added successfully!");
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);
  showRandomQuote();
}

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ✅ POST to Mock Server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });

    if (!response.ok) throw new Error("Failed to post quote to server");
    const result = await response.json();
    console.log("Quote posted to server:", result);
  } catch (error) {
    console.error("Error posting quote:", error);
    notifyUser("Failed to sync new quote to server.");
  }
}

// ✅ GET from Mock Server
async function fetchQuotesFromServer() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
  const serverData = await response.json();
  return serverData.map((post, index) => ({
    id: 1000 + post.id,
    text: post.title,
    category: ["motivation", "success", "humor", "life", "wisdom"][index % 5]
  }));
}

// ✅ Sync and Conflict Resolution
async function syncWithServer() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
    let conflictCount = 0;

    serverQuotes.forEach(serverQuote => {
      const localIndex = quotes.findIndex(q => q.id === serverQuote.id);
      if (localIndex !== -1) {
        const localQuote = quotes[localIndex];
        if (localQuote.text !== serverQuote.text || localQuote.category !== serverQuote.category) {
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
    notifyUser("Sync with server failed.");
  }
}

function notifyUser(message) {
  const div = document.createElement("div");
  div.textContent = message;
  div.style.background = "#d1e7dd";
  div.style.padding = "10px";
  div.style.marginTop = "10px";
  div.style.border = "1px solid #badbcc";
  div.style.color = "#0f5132";
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 4000);
}
