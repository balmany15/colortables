document.addEventListener("DOMContentLoaded", () => {

  const grid = document.getElementById("tables");
  const navButtons = document.querySelectorAll(".nav-btn[data-category]");

  // Default category
  let currentCategory = "reflectivity";

  // Explicit file listing per folder
  const files = {
    reflectivity: [
      "AVL_BroadcastNegatives.pal",
      "Baron256.pal",
      "BaronLynx.pal",
      "BradP_Charlotte.pal",
      "CODE BR.pal",
      "Custom Refl.pal",
      "Custom Refl2.pal",
      "Custom Z2.pal",
      "Dark Z2.pal",
      "DuPageWx.pal",
      "DuPageWxWith Negs.pal",
      "EAX Z.pal",
      "FOXweather.pal",
      "GMEDreflectivity.pal",
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
      "SolidBRtrans.pal",
      "SolidTV.pal",
      "WDTB Z.pal",
      "WDTB_Bright.pal",
      "WDTD Z.pal",
      "WxTap_BR.pal",
      "WxTap_RadarLabHD.pal",
      "blueness.pal"
    ],
    velocity: [
      "ALPHA-Velo.pal",
      "BV SimuAwips.pal",
      "LOT Velo.pal",
      "NWS-Velo.pal",
      "Storm Chaser HD Velocity.pal",
      "UCAR Velo.pal",
      "miami velo.pal"
    ],
    ptype: [
      "FOXWEATHER-PMM.pal",
      "Ptype_IP2.pal",
      "Ptype_ZR3.pal",
      "WSI-PMM.pal",
      "WU-IP.pal",
      "WU-Rain.pal",
      "WU-Snow.pal",
      "ra-stormlab.pal",
      "ra-twc-dark.pal",
      "ra-twc-solid.pal",
      "ra-twc.pal",
      "ra-wsi.pal",
      "sn-gray.pal",
      "sn-hunter.pal",
      "sn-max.pal",
      "sn-purple.pal",
      "sn-tracker.pal"
    ]
  };

  // Read category from URL (?category=velocity)
  const params = new URLSearchParams(window.location.search);
  const categoryFromURL = params.get("category");

  if (categoryFromURL && files[categoryFromURL]) {
    currentCategory = categoryFromURL;
  }

  // Set correct active nav button
  navButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.category === currentCategory);
  });

  // Nav button click handling
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const selected = btn.dataset.category;
      if (!files[selected]) return;

      currentCategory = selected;

      // Update active styling
      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Update URL without page reload
      window.history.replaceState(null, "", `?category=${selected}`);

      loadCategory(currentCategory);
    });
  });

  // Initial load
  loadCategory(currentCategory);

  function loadCategory(category) {
    grid.innerHTML = "";

    files[category].forEach(file => {
      createCard(file, category);
    });
  }

  function createCard(filename, category) {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = `./${category}/${filename.replace(".pal", ".png")}`;
    img.alt = filename;

    const name = document.createElement("div");
    name.className = "name";
    name.textContent = filename.replace(".pal", "").replace(/[_-]/g, " ");

    const download = document.createElement("a");
    download.className = "download-btn";
    download.href = `./${category}/${filename}`;
    download.download = filename;
    download.textContent = "Download .PAL";

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(download);

    grid.appendChild(card);
  }

});
