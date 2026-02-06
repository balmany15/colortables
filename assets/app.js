const grid = document.getElementById("tables");
const navButtons = document.querySelectorAll(".nav-btn");

let currentCategory = "reflectivity";

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    loadCategory(currentCategory);
  });
});

loadCategory(currentCategory);

async function loadCategory(category) {
  grid.innerHTML = "";

  // GitHub Pages requires explicit file listing
  // You will maintain this list per folder
  const files = {
    reflectivity: [],
    velocity: [],
    ptype: []
  };

  // 🔧 EDIT THIS PART:
  // Add your .pal filenames per folder
  files.reflectivity = [
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
            "blueness.pal",


  ];

  files.velocity = [
    // "example_velocity.pal"
  ];

  files.ptype = [
    // "example_ptype.pal"
  ];

  for (const file of files[category]) {
    const response = await fetch(`./${category}/${file}`);
    const text = await response.text();
    const colors = parseColors(text);

    createCard(file, colors, category);
  }
}

function parseColors(text) {
  const lines = text.split(/\r?\n/);
  const entries = [];

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith(";")) continue;

    const lower = line.toLowerCase();

    if (lower.startsWith("solidcolor")) {
      const nums = line.match(/\d+/g);
      if (!nums || nums.length < 4) continue;

      const r = parseInt(nums[1]);
      const g = parseInt(nums[2]);
      const b = parseInt(nums[3]);

      entries.push({
        type: "gradient",
        color: `rgb(${r},${g},${b})`
      });
    }
  }

  return entries;
}


    if (lower.startsWith("color")) {
      const nums = line.match(/\d+/g);
      if (!nums || nums.length < 4) continue;

      // color entries may define gradients (multiple RGBs)
      for (let i = 1; i + 2 < nums.length; i += 3) {
        const r = parseInt(nums[i]);
        const g = parseInt(nums[i + 1]);
        const b = parseInt(nums[i + 2]);

        entries.push({
          type: "gradient",
          color: `rgb(${r},${g},${b})`
        });
      }
    }
  }

  return entries;
}


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

function drawPreview(canvas, entries) {
  const ctx = canvas.getContext("2d");
  if (!entries.length) return;

  const width = canvas.width;
  const height = canvas.height;

  const gradientEntries = entries.filter(e => e.type === "gradient");
  const solidEntries = entries.filter(e => e.type === "solid");

  // If there are gradient colors, draw a smooth gradient
  if (gradientEntries.length > 1) {
    const grad = ctx.createLinearGradient(0, 0, width, 0);

    gradientEntries.forEach((entry, index) => {
      grad.addColorStop(
        index / (gradientEntries.length - 1),
        entry.color
      );
    });

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    return;
  }

  // Otherwise fall back to solid blocks
  const colors = solidEntries.length
    ? solidEntries.map(e => e.color)
    : entries.map(e => e.color);

  const segmentWidth = width / colors.length;

  colors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(i * segmentWidth, 0, segmentWidth, height);
  });
}


function formatName(filename) {
  return filename
    .replace(".pal", "")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}
