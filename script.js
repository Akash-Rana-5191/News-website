const apiKey = "140fd2f3691e4bb89143764b4001bf71";

// APIs
const apiTechCrunch = `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${apiKey}`;
const apiIndia = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}`;

// DOM Elements
const newsContainer = document.getElementById("newsContainer");
const searchInput = document.getElementById("searchInput");

// Combine results from both APIs
async function fetchNews(query = "") {
  const urls = query
    ? [
        `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`
      ]
    : [apiTechCrunch, apiIndia];

  try {
    const allArticles = [];

    for (const url of urls) {
      const res = await fetch(url);
      const data = await res.json();
      if (data.articles) allArticles.push(...data.articles);
    }

    showNews(allArticles);
  } catch (error) {
    console.error("Failed to fetch news:", error);
    newsContainer.innerHTML = "<p>Error loading news. Please try again later.</p>";
  }
}

// Render news cards
function showNews(articles) {
  newsContainer.innerHTML = "";

  if (!articles || articles.length === 0) {
    newsContainer.innerHTML = "<p>No articles found.</p>";
    return;
  }

  articles.forEach((article) => {
    const card = document.createElement("div");
    card.className = "news-card";
    card.innerHTML = `
      <img src="${article.urlToImage || 'https://via.placeholder.com/300x180'}" alt="News Image">
      <div class="news-content">
        <h3>${article.title}</h3>
        <p>${article.description || 'No description available.'}</p>
        <a href="${article.url}" target="_blank">Read More →</a>
      </div>
    `;
    newsContainer.appendChild(card);
  });
}

// Real-time Date & Time
function updateDateTime() {
  const now = new Date();
  document.getElementById("datetime").textContent = now.toLocaleString();
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Search functionality
searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) {
      fetchNews(query);
    } else {
      fetchNews();
    }
  }
});

// Load news on page load
fetchNews();
