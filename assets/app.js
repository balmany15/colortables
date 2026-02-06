document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("tables");
  const navButtons = document.querySelectorAll(".nav-btn");

  let currentCategory = "reflectivity";

  const PLACEHOLDER_IMAGE = "./assets/placeholder.png";

  // Navigation
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      loadCategory(currentCategory);
    });
  });

  // File lists
  const files = {
    reflectivity: [
      "AVL_BroadcastNegatives.pal",
      "Baron256.pal",
      "RadarScope.pal",
      "RadarOmega.pal",
      "NWS_Default.pal"
    ],
    velocity: [
      "ALPHA-Velo.pal",
      "UCAR Velo.pal",
      "Storm Chaser HD Velocity.pal"
    ],
    ptype: [
      "Ptype_IP2.pal",
      "ra-wsi.pal",
      "ra-twc.pal",
      "sn-gray.pal"
    ]
  };

  // Initial load
  loadCategory(currentCategory);

  async function loadCategory(category) {
    grid.innerHTML = "";

    for (const file of files[category]) {
      createCard(file, category);
    }
  }

  // Create card
  function createCard(filename, category) {
    const card = document.createElement("div");
    card.className = "card";

    // Top row (image + name)
    const top = document.createElement("div");
    top.className = "card-top";

    const img = document.createElement("img");
    img.className = "thumbnail";
    img.alt = formatName(filename);

    const imagePath = `./${category}/${filename.replace(".pal", ".png")}`;

    img.src = imagePath;
    img.onerror = () => {
      img.src = PLACEHOLDER_IMAGE;
    };

    const name = document.createElement("div");
    name.className = "card-name";
    name.textContent = formatName(filename);

    top.appendChild(img);
    top.appendChild(name);

    // Download button
    const download = document.createElement("a");
    download.className = "download-btn";
    download.href = `./${category}/${encodeURIComponent(filename)}`;
    download.download = filename;
    download.textContent = "Download .PAL";

    card.appendChild(top);
    card.appendChild(download);

    grid.appendChild(card);
  }

  // Beautify names
  function formatName(filename) {
    return filename
      .replace(".pal", "")
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());
  }
});
