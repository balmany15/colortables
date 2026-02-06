const grid = document.getElementById("tables");
const navButtons = document.querySelectorAll(".nav-btn");

let currentCategory = "reflectivity";

// Navigation click handling
navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    loadCategory(currentCategory);
  });
});

// Initial load
loadCategory(currentCategory);

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
    "Custom Refl2 (1).pal",
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

async function loadCategory(category) {
  grid.innerHTML = "";

  for (const file of files[category]) {
    try {
      const response = await fetch(`./${category}/${file}`);
      const text = await response.text();
      const gradients = parseColors(text);

      createCard(file, gradients, category);
    } catch (err) {
      console.error(`Failed to load ${file}:`, err);
    }
  }
}

// Parses color lines, including multi-RGB gradients per line
function parseColors(text) {
  const lines = text.split(/\r?\n/);
  const gradients = [];

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith(";")) continue;

    const lower = line.toLowerCase();

    // Solidcolor lines
    if (lower.startsWith("solidcolor")) {
      const nums = line.match(/\d+/g);
      if (!nums || nums.length < 4) continue;
      const r = parseInt(nums[1]);
      const g = parseInt(nums[2]);
      const b = parseInt(nums[3]);
      gradients.push([`rgb(${r},${g},${b})`, `rgb(${r},${g},${b})`]);
    }

    // Color/Color4 lines (multi-color gradients)
    if (lower.startsWith("color")) {
      const nums = line.match(/-?\d+\.?\d*/g);
      if (!nums || nums.length < 4) continue;

      // Extract RGB triplets (skip first value which is the data point)
      const rgbTriplets = [];
      for (let i = 1; i + 2 < nums.length; i += 3) {
        const r = parseInt(nums[i]);
        const g = parseInt(nums[i + 1]);
        const b = parseInt(nums[i + 2]);
        rgbTriplets.push(`rgb(${r},${g},${b})`);
      }

      // Convert consecutive triplets to gradients
      if (rgbTriplets.length === 1) {
        gradients.push([rgbTriplets[0], rgbTriplets[0]]);
      } else {
        for (let i = 0; i < rgbTriplets.length - 1; i++) {
          gradients.push([rgbTriplets[i], rgbTriplets[i + 1]]);
        }
      }
    }
  }

  return gradients;
}

// Create card for each color table
function createCard(filename, gradients, category) {
  const card = document.createElement("div");
  card.className = "card";

  const preview = document.createElement("canvas");
  preview.className = "preview";
  preview.width = 400;
  preview.height = 28;

  drawPreview(preview, gradients);

  const title = document.createElement("h3");
  title.textContent = formatName(filename);

  const download = document.createElement("div");
  download.className = "download";

  const link = document.createElement("a");
  link.href = `./${category}/${filename}`;
  link.download = filename;
  link.textContent = "Download .PAL";

  download.appendChild(link);

  card.appendChild(preview);
  card.appendChild(title);
  card.appendChild(download);

  grid.appendChild(card);
}

// Draw all gradients horizontally
function drawPreview(canvas, gradients) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  const segmentWidth = width / gradients.length;

  gradients.forEach((pair, i) => {
    const grad = ctx.createLinearGradient(0, 0, segmentWidth, 0);
    grad.addColorStop(0, pair[0]);
    grad.addColorStop(1, pair[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(i * segmentWidth, 0, segmentWidth, height);
  });
}

// Beautify file names for display
function formatName(filename) {
  return filename
    .replace(".pal", "")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}
