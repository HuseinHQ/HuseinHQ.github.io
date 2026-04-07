// Navbar fixed
window.onscroll = function () {
  const header = document.querySelector("header");
  const fixedNav = header.offsetTop;
  const toTop = document.querySelector("#to-top");

  if (window.pageYOffset > fixedNav) {
    header.classList.add("navbar-fixed");
    toTop.classList.remove("hidden");
    toTop.classList.add("flex");
  } else {
    header.classList.remove("navbar-fixed");
    toTop.classList.remove("flex");
    toTop.classList.add("hidden");
  }
};

// Hamburger
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

hamburger.addEventListener("click", function () {
  hamburger.classList.toggle("hamburger-active");
  navMenu.classList.toggle("hidden");
});

// Klik di luar hamburger
window.addEventListener("click", function (e) {
  if (e.target != hamburger && navMenu) {
    hamburger.classList.remove("hamburger-active");
    navMenu.classList.add("hidden");
  }
});

// Darkmode Toggle
const darkToggle = document.querySelector("#dark-toggle");
const html = document.querySelector("html");

darkToggle.addEventListener("click", function () {
  if (darkToggle.checked) {
    html.classList.add("dark");
    localStorage.theme = "dark";
  } else {
    html.classList.remove("dark");
    localStorage.theme = "light";
  }
});

// Pindahkan posisi toggle sesuai mode
if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  darkToggle.checked = true;
} else {
  darkToggle.checked = false;
}

async function loadPortfolio() {
  const portfolioList = document.querySelector("#portfolio-list");
  const portfolioIndicator = document.querySelector("#portfolio-indicator");

  if (!portfolioList) {
    return;
  }

  try {
    const response = await fetch("./portfolio.json");
    if (!response.ok) {
      throw new Error("Failed to load portfolio data");
    }

    const portfolios = await response.json();
    const projectsPerPage = 4;
    const pages = [];

    for (let i = 0; i < portfolios.length; i += projectsPerPage) {
      pages.push(portfolios.slice(i, i + projectsPerPage));
    }

    function renderCard(item) {
      const url = item.url || "#";
      const image = item.image || "";
      const title = item.title || "Untitled Project";
      const description = item.description || "";
      const alt = item.alt || title;

      return `
        <article>
          <div class="overflow-hidden transition-transform duration-100 ease-in-out transform rounded-md shadow-md hover:scale-105">
            <a href="${url}" target="_blank" rel="noopener noreferrer">
              <img src="${image}" alt="${alt}" class="w-full h-68 object-cover bg-slate-50 dark:bg-slate-700/40" />
            </a>
          </div>
          <h3 class="mt-5 mb-3 text-xl font-semibold text-dark dark:text-white">
            <a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a>
          </h3>
          <p class="text-base font-medium text-secondary overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">${description}</p>
        </article>
      `;
    }

    if (pages.length <= 1) {
      portfolioList.className = "grid grid-cols-2 gap-6";
      portfolioList.innerHTML = pages[0].map(renderCard).join("");

      if (portfolioIndicator) {
        portfolioIndicator.className =
          "items-center justify-center hidden gap-2 mt-6";
        portfolioIndicator.innerHTML = "";
      }

      return;
    }

    portfolioList.className =
      "flex pb-4 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar";
    portfolioList.innerHTML = pages
      .map(function (page) {
        return `
          <div class="w-full flex-none snap-start grid grid-cols-2 gap-6">
            ${page.map(renderCard).join("")}
          </div>
        `;
      })
      .join("");

    if (portfolioIndicator) {
      portfolioIndicator.className =
        "flex items-center justify-center gap-2 mt-6";
      portfolioIndicator.innerHTML = pages
        .map(function (_, index) {
          return `
            <button
              type="button"
              data-index="${index}"
              aria-label="Go to portfolio page ${index + 1}"
              class="w-2.5 h-2.5 rounded-full transition bg-slate-400"
            ></button>
          `;
        })
        .join("");

      const dots = Array.from(portfolioIndicator.querySelectorAll("button"));

      function setActiveDot(activeIndex) {
        dots.forEach(function (dot, index) {
          if (index === activeIndex) {
            dot.classList.remove("bg-slate-400");
            dot.classList.add("bg-primary");
          } else {
            dot.classList.remove("bg-primary");
            dot.classList.add("bg-slate-400");
          }
        });
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          const index = Number(dot.dataset.index || 0);
          portfolioList.scrollTo({
            left: portfolioList.clientWidth * index,
            behavior: "smooth",
          });
        });
      });

      portfolioList.addEventListener("scroll", function () {
        const activeIndex = Math.round(
          portfolioList.scrollLeft / portfolioList.clientWidth,
        );
        setActiveDot(activeIndex);
      });

      setActiveDot(0);
    }
  } catch (error) {
    portfolioList.innerHTML =
      '<p class="px-4 text-base font-medium text-secondary">Portfolio gagal dimuat.</p>';
    if (portfolioIndicator) {
      portfolioIndicator.className =
        "items-center justify-center hidden gap-2 mt-6";
      portfolioIndicator.innerHTML = "";
    }
    console.error(error);
  }
}

loadPortfolio();
