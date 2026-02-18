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
      "Charleston.pal",
      "CLT_Broadcast.pal",
      "CODE_Z.pal",
      "Custom_Doppler.pal",
      "Custom_Z.pal",
      "Custom_Z2.pal",
      "Dark_Z.pal",
      "Diamond_Class.pal",
      "DuPageWx.pal",
      "DuPageWx2.pal",
      "EAX_Z.pal",
      "Forbes.pal",
      "FOXweather.pal",
      "GMED_Reflectivity.pal",
      "HD_SuperRes.pal",
      "Hunter_Refl.pal",
      "Ivan.pal",
      "myradar.pal",
      "NSSL.pal",
      "NSSL2.pal",
      "NSSL3.pal",
      "NWS_CRH.pal",
      "NWS_Deluth.pal",
      "NWS_LaCrosse.pal",
      "NWS_Legacy.pal",
      "NWS_LOT.pal",
      "NWS_LOT2.pal",
      "NWS_Louisville.pal",
      "NWS_OUN.pal",
      "NWS_SR.pal",
      "NWS_Wichita.pal",
      "PhasedArray.pal",
      "Pivotal_Wx.pal",
      "RadarOmega.pal",
      "RadarScope.pal",
      "Ritter_Reflectivity.pal",
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
      "NWS_Legacy.pal",
      "NWS_LOT.pal",
      "NWS_Miami.pal",
      "OMEGA_Velo.pal",
      "SimuAwips.pal",
      "UCAR_Velocity.pal"
    ],
    ptype: [
      "BARON.pal",
      "FOXWEATHER.pal",
      "Ritter_Reflectivity.pal",
      "The_Weather_Channel.pal",
      "Tropical_Tidbits.pal",
      "Weather_Underground.pal",
      "WSI.pal"
    ]
  };

// Optional credits per file
const credits = {
  
  "ALPHA_Velo.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
  "AVL_Broadcast.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "BARON.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
  "Baron256.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "BaronLynx.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "Blue_Doppler.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "Chaser_HD.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
      "Charleston.pal": {
    name: "@chswx",
    url: "https://x.com/chswx"
  },
    "CLT_Broadcast.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "CODE_Z.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "Custom_Doppler.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "Custom_Z.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
      "Custom_Z2.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "Dark_Z.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
  "Diamond_Class.pal": {
    name: "by diamond",
  },
    "DuPageWx.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "DuPageWx2.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "EAX_Z.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "Forbes.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "FOXWEATHER.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "FOXweather.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "GMED_Reflectivity.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "HD_SuperRes.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "Hunter_Refl.pal": {
    name: "@DelmarvaWx",
    url: "https://x.com/DelmarvaWx"
  },
    "Ivan.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
      "myradar.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "NSSL.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "NSSL2.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "NSSL3.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "NWS_CRH.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "NWS_Deluth.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
      "NWS_LaCrosse.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
      "NWS_Legacy.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "NWS_LOT.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "NWS_LOT2.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "NWS_Louisville.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "NWS_Miami.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "NWS_OUN.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "NWS_SR.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "NWS_Wichita.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
      "OMEGA_Velo.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "PhasedArray.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "Pivotal_Wx.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "RadarOmega.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "RadarScope.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
      "Ritter_Reflectivity.pal": {
    name: "@MetMattRitter",
    url: "https://x.com/MetMattRitter"
  },
    "SimuAwips.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "SimuAwipsRC.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "Solid_Reflectivity.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "SolidTV.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "The_Weather_Channel.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
      "Tropical_Tidbits.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "UCAR_Velocity.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "WDTD_Z.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "Weather_Underground.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "WSI.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "WxTap_BR.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  },
    "WxTap_RadarLabHD.pal": {
    name: "@AlmanyDesigns",
    url: "https://x.com/AlmanyDesigns"
  }
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
// Name
const name = document.createElement("div");
name.className = "card-name";
name.textContent = formatName(filename);

// Append image first
top.appendChild(img);

// Append name second
top.appendChild(name);

// Credit (if exists)
if (credits[filename]) {
  const credit = document.createElement("div");
  credit.className = "card-credit";

  const creditData = credits[filename];

  if (creditData.url && creditData.url.trim() !== "") {
    const creditLink = document.createElement("a");
    creditLink.href = creditData.url;
    creditLink.target = "_blank";
    creditLink.rel = "noopener noreferrer";
    creditLink.textContent = creditData.name;
    credit.appendChild(creditLink);
  } else {
    const creditText = document.createElement("span");
    creditText.textContent = creditData.name;
    credit.appendChild(creditText);
  }

  top.appendChild(credit);
}



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
