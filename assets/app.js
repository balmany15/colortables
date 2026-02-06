document.addEventListener("DOMContentLoaded", () => {
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

  // Initial load
  loadCategory(currentCategory);

  async function loadCategory(category) {
    grid.innerHTML = "";

    for (const file of files[category]) {
      try {
        // Encode the filename for spaces/parentheses
        const response = await fetch(`./${category}/${encodeURIComponent(file)}`);
        const text = await response.text();
        const colors = parseColors(text);
        createCard(file, colors, category);
      } catch (err) {
        console.error(`Failed to load ${file}:`, err);
      }
    }
  }

  // Parse .pal file and extract gradient colors
  function parseColors(text) {
  const lines = text.split(/\r?\n/);
  const entries = [];

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith(";") || line.startsWith("ND") || line.startsWith("RF")) continue;

    const lower = line.toLowerCase();
    if (!lower.startsWith("color") && !lower.startsWith("solidcolor")) continue;

    // Match all numbers, ignore extra spaces
    const nums = line.match(/-?\d+/g);
    if (!nums || nums.length < 4) continue;

    // SOLIDCOLOR
    if (lower.startsWith("solidcolor")) {
      const r = parseInt(nums[1]);
      const g = parseInt(nums[2]);
      const b = parseInt(nums[3]);
      entries.push({ color: `rgb(${r},${g},${b})` });
      continue;
    }

    // COLOR / COLOR4
    const triplets = [];
    for (let i = 1; i + 2 < nums.length; i += 3) {
      const r = parseInt(nums[i]);
      const g = parseInt(nums[i + 1]);
      const b = parseInt(nums[i + 2]);
      triplets.push(`rgb(${r},${g},${b})`);
    }

    // Push consecutive pairs as gradients
    for (let i = 0; i < triplets.length - 1; i++) {
      entries.push({ color: triplets[i] });
      entries.push({ color: triplets[i + 1] });
    }

    // If only one triplet, push it once
    if (triplets.length === 1) entries.push({ color: triplets[0] });
  }

  return entries;
}


  // Create HTML card for each table
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
    link.href = `./${category}/${encodeURIComponent(filename)}`;
    link.download = filename;
    link.textContent = "Download .PAL";
    download.appendChild(link);

    card.appendChild(preview);
    card.appendChild(title);
    card.appendChild(download);

    grid.appendChild(card);
  }

  // Draw horizontal gradient
  function drawPreview(canvas, entries) {
    const ctx = canvas.getContext("2d");
    if (!entries.length) return;

    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    entries.forEach((entry, index) => {
      grad.addColorStop(index / (entries.length - 1), entry.color);
    });

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Beautify file names
  function formatName(filename) {
    return filename
      .replace(".pal", "")
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());
  }
});
