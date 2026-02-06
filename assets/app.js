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
        const response = await fetch(`./${category}/${encodeURIComponent(file)}`);
        const text = await response.text();
        const entries = parseColors(text);
        createCard(file, entries, category);
      } catch (err) {
        console.error(`Failed to load ${file}:`, err);
      }
    }
  }

  // Parse .pal file: returns array of {start, end} colors for each gradient block
  function parseColors(text) {
    const lines = text.split(/\r?\n/);
    const entries = [];

    for (let line of lines) {
      line = line.trim();
      if (!line || line.startsWith(";")) continue;

      const lower = line.toLowerCase();
      const nums = line.match(/-?\d+\.?\d*/g);
      if (!nums || nums.length < 4) continue;

      // SOLIDCOLOR
      if (lower.startsWith("solidcolor")) {
        const r = parseInt(nums[1]);
        const g = parseInt(nums[2]);
        const b = parseInt(nums[3]);
        entries.push({ start: `rgb(${r},${g},${b})`, end: `rgb(${r},${g},${b})` });
        continue;
      }

      // COLOR / COLOR4
      if (lower.startsWith("color")) {
        const triplets = nums.slice(1); // skip first value
        const rgbPairs = [];
        for (let i = 0; i + 2 < triplets.length; i += 3) {
          const r = parseInt(triplets[i]);
          const g = parseInt(triplets[i + 1]);
          const b = parseInt(triplets[i + 2]);
          rgbPairs.push(`rgb(${r},${g},${b})`);
        }

        // Push consecutive pairs
        for (let i = 0; i < rgbPairs.length - 1; i++) {
          entries.push({ start: rgbPairs[i], end: rgbPairs[i + 1] });
        }

        // Single color
        if (rgbPairs.length === 1) {
          entries.push({ start: rgbPairs[0], end: rgbPairs[0] });
        }
      }
    }

    return entries;
  }

  // Create HTML card for each table
  function createCard(filename, entries, category) {
    const card = document.createElement("div");
    card.className = "card";

    const canvas = document.createElement("canvas");
    canvas.className = "preview";
    canvas.width = 400;
    canvas.height = 28;
    drawPreview(canvas, entries);

    const title = document.createElement("h3");
    title.textContent = formatName(filename);

    const download = document.createElement("div");
    download.className = "download";
    const link = document.createElement("a");
    link.href = `./${category}/${encodeURIComponent(filename)}`;
    link.download = filename;
    link.textContent = "Download .PAL";
    download.appendChild(link);

    card.appendChild(canvas);
    card.appendChild(title);
    card.appendChild(download);

    grid.appendChild(card);
  }

  // Draw each gradient block individually
  function drawPreview(canvas, entries) {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const segmentWidth = width / entries.length;

    entries.forEach((entry, i) => {
      const grad = ctx.createLinearGradient(i * segmentWidth, 0, (i + 1) * segmentWidth, 0);
      grad.addColorStop(0, entry.start);
      grad.addColorStop(1, entry.end);
      ctx.fillStyle = grad;
      ctx.fillRect(i * segmentWidth, 0, segmentWidth, height);
    });
  }

  // Beautify file names
  function formatName(filename) {
    return filename
      .replace(".pal", "")
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());
  }
});
