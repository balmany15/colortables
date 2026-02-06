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

async function loadCategory(category) {
  grid.innerHTML = "";

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
      // Add your velocity .pal files here
            "ALPHA-Velo.pal"
            "BV SimuAwips.pal"
        "LOT Velo.pal"
        "NWS-Velo.pal"
        "Storm Chaser HD Velocity.pal"
        "UCAR Velo.pal"
        "miami velo.pal"
    ],
    ptype: [
      // Add your ptype .pal files here
    ]
  };

  for (const file of files[category]) {
    try {
      const response = await fetch(`./${category}/${file}`);
      const text = await response.text();
      const colors = parseColors(text);

      createCard(file, colors, category);
    } catch (err) {
      console.error(`Failed to load ${file}:`, err);
    }
  }
}

// Parse only solidcolor entries for smooth gradient preview
function parseColors(text) {
  const lines = text.split(/\r?\n/);
  const entries = [];

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith(";")) continue;

    const lower = line.toLowerCase();
    const nums = line.match(/-?\d+\.?\d*/g); // match ints or floats

    if (!nums || nums.length < 4) continue;

    // SOLID colors
    if (lower.startsWith("solidcolor")) {
      const r = parseInt(nums[1]);
      const g = parseInt(nums[2]);
      const b = parseInt(nums[3]);

      // skip super dark placeholder colors
      if (r + g + b < 15) continue;

      entries.push({
        type: "gradient",
        color: `rgb(${r},${g},${b})`
      });
    }

    // COLOR / COLOR4 lines
    if (lower.startsWith("color")) {
      // start from index 1 (skip the value)
      for (let i = 1; i + 2 < nums.length; i += 3) {
        const r = parseInt(nums[i]);
        const g = parseInt(nums[i + 1]);
        const b = parseInt(nums[i + 2]);

        // skip very dark placeholders
        if (r + g + b < 15) continue;

        entries.push({
          type: "gradient",
          color: `rgb(${r},${g},${b})`
        });
      }
    }
  }

  return entries;
}



// Create card for each color table
function createCard(filename, colors, category) {
  const card = document.createElement("div");
  card.className = "card";

  const preview = document.createElement("canvas");
  preview.className = "preview";
  preview.width = 400;
  preview.height = 28;

  drawPreview(preview, colors);

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

// Draw gradient preview for each table
function drawPreview(canvas, entries) {
  const ctx = canvas.getContext("2d");
  if (!entries.length) return;

  const width = canvas.width;
  const height = canvas.height;

  // Always treat entries as gradient stops
  const grad = ctx.createLinearGradient(0, 0, width, 0);
  entries.forEach((entry, index) => {
    grad.addColorStop(index / (entries.length - 1), entry.color);
  });

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
}

// Beautify file names for display
function formatName(filename) {
  return filename
    .replace(".pal", "")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}
