document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("tables");
  const navButtons = document.querySelectorAll(".nav-btn");

  let currentCategory = "reflectivity";
  const PLACEHOLDER_IMAGE = "./assets/placeholder.png";

  // File lists
  const files = {
    reflectivity: [
      "AVL_Broadcast.pal",
      "Baron256.pal",
      "BaronLynx.pal",
      "Blue_Doppler.pal",
      "CLT_Broadcast.pal",
      "CODE_Z.pal",
      "Custom_Doppler.pal",
      "Custom_Doppler2.pal",
      "Custom_Z.pal",
      "Dark_Z.pal",
      "DuPageWx.pal",
      "DuPageWx2.pal",
      "EAX_Z.pal",
      "FOXweather.pal",
      "GMED_Reflectivity.pal",
      "HD_SuperRes.pal",
      "Hunter_Refl.pal",
      "Ivan.pal",
      "NSSL.pal",
      "NSSL2.pal",
      "NSSL3.pal",
      "NWS_CRH.pal",
      "NWS_Default.pal",
      "NWS_Deluth.pal",
      "NWS_KLOT.pal",
      "NWS_KLOT2.pal",
      "NWS_LaCrosse.pal",
      "NWS_Louisville.pal",
      "NWS_NSSL-OUN.pal",
      "NWS_SR.pal",
      "NWS_Wichita.pal",
      "PhasedArray.pal",
      "RadarOmega.pal",
      "RadarScope.pal",
      "SimuAwipsRC.pal",
      "Solid_Reflectivity.pal",
      "SolidTV.pal",
      "WDTD_Z.pal",
      "WxTap_BR.pal",
      "WxTap_RadarLabHD.pal"
    ],
    velocity: [
      "ALPHA_Velo.pal",
      "Chaser_HD.pal",
      "NWS_Default.pal",
      "NWS_LOT.pal",
      "NWS_Miami.pal",
      "SimuAwips.pal",
      "UCAR_Velocity.pal"
    ],
    ptype: [
      "FOXWEATHER_PMM.pal",
      "WSI_PMM.pal"
    ]
  };

  // 🔥 READ URL FIRST
  const params = new URLSearchParams(window.location.search);
  const categoryFromURL = params.get("category");

  if (categoryFromURL && files[categoryFromURL]) {
    currentCategory = categoryFromURL;
  }

  // Navigation
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (!btn.dataset.category) return;

      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      currentCategory = btn.dataset.category;

      // Update URL without reload
      window.history.replaceState(null, "", `?category=${currentCategory}`);

      loadCategory(currentCategory);
    });
  });

  // Set correct active tab
  navButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.category === currentCategory);
  });

  // Initial load (NOW uses correct category)
  loadCategory(currentCategory);

  function loadCategory(category) {
    grid.innerHTML = "";

    for (const file of files[category]) {
      createCard(file, category);
    }
  }

  function createCard(filename, category) {
    const card = document.createElement("div");
    card.className = "card";

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

    const download = document.createElement("a");
    download.className = "download-btn";
    download.href = `./${category}/${encodeURIComponent(filename)}`;
    download.download = filename;
    download.textContent = "Download .PAL";

    card.appendChild(top);
    card.appendChild(download);

    grid.appendChild(card);
  }

  function formatName(filename) {
    return filename
      .replace(".pal", "")
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());
  }

});
