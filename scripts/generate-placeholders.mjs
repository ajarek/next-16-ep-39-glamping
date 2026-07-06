import sharp from "sharp"
import { existsSync, mkdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const outputDir = join(__dirname, "..", "public", "images")

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true })
}

// Konfiguracja kolorów i motywów dla każdej lokalizacji
const locations = [
  {
    id: "forest-haven",
    name: "Forest Haven",
    gradient: ["#1a3a2a", "#0d1f14"],
    accent: "#2d5a3f",
    treeColor: "#3a7a4f",
    sunColor: "#c4a44a",
    bgElements: [
      // Sun
      { type: "circle", cx: 650, cy: 120, r: 60, fill: "#c4a44a", opacity: 0.3 },
      { type: "circle", cx: 650, cy: 120, r: 40, fill: "#d4b44a", opacity: 0.5 },
      // Mountains background
      { type: "polygon", points: "0,500 150,200 300,450", fill: "#1a4a2a", opacity: 0.4 },
      { type: "polygon", points: "200,500 400,150 600,500", fill: "#1a3a2a", opacity: 0.5 },
      { type: "polygon", points: "500,500 700,180 900,500", fill: "#1a4a2a", opacity: 0.4 },
      // Trees
      { type: "polygon", points: "80,400 100,300 120,400", fill: "#2d5a3f", opacity: 0.8 },
      { type: "polygon", points: "100,420 130,280 160,420", fill: "#3a7a4f", opacity: 0.7 },
      { type: "polygon", points: "140,400 170,320 200,400", fill: "#2d5a3f", opacity: 0.8 },
      { type: "polygon", points: "280,420 310,310 340,420", fill: "#3a7a4f", opacity: 0.7 },
      { type: "polygon", points: "320,400 350,330 380,400", fill: "#2d5a3f", opacity: 0.8 },
      { type: "polygon", points: "450,410 480,290 510,410", fill: "#3a7a4f", opacity: 0.7 },
      { type: "polygon", points: "480,430 510,320 540,430", fill: "#2d5a3f", opacity: 0.6 },
      { type: "polygon", points: "520,410 550,340 580,410", fill: "#3a7a4f", opacity: 0.7 },
      // Tree trunks
      { type: "rect", x: 95, y: 400, width: 10, height: 60, fill: "#3a2a1a", opacity: 0.8 },
      { type: "rect", x: 165, y: 420, width: 10, height: 50, fill: "#3a2a1a", opacity: 0.7 },
      { type: "rect", x: 305, y: 420, width: 10, height: 50, fill: "#3a2a1a", opacity: 0.7 },
      { type: "rect", x: 475, y: 410, width: 10, height: 60, fill: "#3a2a1a", opacity: 0.7 },
      { type: "rect", x: 545, y: 410, width: 10, height: 55, fill: "#3a2a1a", opacity: 0.7 },
      // Silhouette foreground trees
      { type: "polygon", points: "0,600 30,350 60,600", fill: "#0a1a0f", opacity: 0.9 },
      { type: "polygon", points: "30,600 70,280 110,600", fill: "#0a1a0f", opacity: 0.9 },
      { type: "polygon", points: "700,600 740,300 780,600", fill: "#0a1a0f", opacity: 0.9 },
      { type: "polygon", points: "740,600 790,250 840,600", fill: "#0a1a0f", opacity: 0.9 },
    ],
  },
  {
    id: "lakeside-retreat",
    name: "Lakeside Retreat",
    gradient: ["#1a3a5a", "#0a1a2a"],
    accent: "#2a6a8a",
    treeColor: "#3a5a3a",
    sunColor: "#e8c84a",
    bgElements: [
      // Moon
      { type: "circle", cx: 680, cy: 100, r: 45, fill: "#e8d8a0", opacity: 0.4 },
      { type: "circle", cx: 680, cy: 100, r: 35, fill: "#f0e0b0", opacity: 0.6 },
      // Stars
      { type: "circle", cx: 100, cy: 80, r: 2, fill: "#ffffff", opacity: 0.7 },
      { type: "circle", cx: 250, cy: 50, r: 2, fill: "#ffffff", opacity: 0.5 },
      { type: "circle", cx: 400, cy: 90, r: 2, fill: "#ffffff", opacity: 0.6 },
      { type: "circle", cx: 520, cy: 40, r: 2, fill: "#ffffff", opacity: 0.8 },
      { type: "circle", cx: 180, cy: 120, r: 1.5, fill: "#ffffff", opacity: 0.5 },
      { type: "circle", cx: 350, cy: 70, r: 1.5, fill: "#ffffff", opacity: 0.6 },
      { type: "circle", cx: 750, cy: 60, r: 1.5, fill: "#ffffff", opacity: 0.5 },
      // Mountains
      { type: "polygon", points: "0,350 100,180 200,350", fill: "#1a2a3a", opacity: 0.6 },
      { type: "polygon", points: "150,350 300,120 450,350", fill: "#1a3a4a", opacity: 0.5 },
      { type: "polygon", points: "380,350 550,160 720,350", fill: "#1a2a3a", opacity: 0.6 },
      { type: "polygon", points: "650,350 800,200 900,350", fill: "#1a3a4a", opacity: 0.5 },
      // Snow caps
      { type: "polygon", points: "90,195 100,180 110,195", fill: "#c0d8e0", opacity: 0.4 },
      { type: "polygon", points: "285,140 300,120 315,140", fill: "#c0d8e0", opacity: 0.4 },
      { type: "polygon", points: "535,175 550,160 565,175", fill: "#c0d8e0", opacity: 0.4 },
      { type: "polygon", points: "785,215 800,200 815,215", fill: "#c0d8e0", opacity: 0.4 },
      // Lake reflection
      { type: "rect", x: 0, y: 350, width: 900, height: 250, fill: "#1a4a6a", opacity: 0.4 },
      // Lake ripples
      { type: "line", x1: 100, y1: 400, x2: 250, y2: 400, stroke: "#3a7a9a", opacity: 0.3, width: 1 },
      { type: "line", x1: 300, y1: 430, x2: 500, y2: 430, stroke: "#3a7a9a", opacity: 0.3, width: 1 },
      { type: "line", x1: 450, y1: 470, x2: 650, y2: 470, stroke: "#3a7a9a", opacity: 0.3, width: 1 },
      { type: "line", x1: 150, y1: 500, x2: 350, y2: 500, stroke: "#3a7a9a", opacity: 0.2, width: 1 },
      // Pine trees on shore
      { type: "polygon", points: "40,350 55,310 70,350", fill: "#1a3a2a", opacity: 0.8 },
      { type: "polygon", points: "55,350 75,290 95,350", fill: "#1a3a2a", opacity: 0.8 },
      { type: "polygon", points: "80,350 100,320 120,350", fill: "#1a3a2a", opacity: 0.8 },
      { type: "polygon", points: "780,350 800,300 820,350", fill: "#1a3a2a", opacity: 0.8 },
      { type: "polygon", points: "810,350 835,280 860,350", fill: "#1a3a2a", opacity: 0.8 },
    ],
  },
  {
    id: "meadow-vista",
    name: "Meadow Vista",
    gradient: ["#2a4a3a", "#1a2a1a"],
    accent: "#4a8a5a",
    treeColor: "#3a6a3a",
    sunColor: "#f0d860",
    bgElements: [
      // Setting sun
      { type: "circle", cx: 450, cy: 280, r: 80, fill: "#f0d860", opacity: 0.2 },
      { type: "circle", cx: 450, cy: 280, r: 60, fill: "#f0e070", opacity: 0.35 },
      { type: "circle", cx: 450, cy: 280, r: 40, fill: "#f0e880", opacity: 0.5 },
      // Sun rays
      { type: "line", x1: 450, y1: 200, x2: 450, y2: 100, stroke: "#f0d860", opacity: 0.15, width: 2 },
      { type: "line", x1: 350, y1: 240, x2: 280, y2: 160, stroke: "#f0d860", opacity: 0.15, width: 2 },
      { type: "line", x1: 550, y1: 240, x2: 620, y2: 160, stroke: "#f0d860", opacity: 0.15, width: 2 },
      { type: "line", x1: 320, y1: 300, x2: 200, y2: 320, stroke: "#f0d860", opacity: 0.15, width: 2 },
      { type: "line", x1: 580, y1: 300, x2: 700, y2: 320, stroke: "#f0d860", opacity: 0.15, width: 2 },
      // Distant mountains
      { type: "polygon", points: "0,400 150,250 300,400", fill: "#3a6a4a", opacity: 0.3 },
      { type: "polygon", points: "200,400 400,200 600,400", fill: "#4a7a5a", opacity: 0.25 },
      { type: "polygon", points: "500,400 700,230 900,400", fill: "#3a6a4a", opacity: 0.3 },
      // Rolling hills
      { type: "ellipse", cx: 200, cy: 420, rx: 250, ry: 80, fill: "#4a8a5a", opacity: 0.3 },
      { type: "ellipse", cx: 600, cy: 440, rx: 300, ry: 100, fill: "#3a7a4a", opacity: 0.25 },
      { type: "ellipse", cx: 450, cy: 460, rx: 350, ry: 90, fill: "#2a6a3a", opacity: 0.3 },
      // Wildflowers (small dots)
      { type: "circle", cx: 150, cy: 400, r: 3, fill: "#e06060", opacity: 0.6 },
      { type: "circle", cx: 180, cy: 410, r: 3, fill: "#e0e060", opacity: 0.6 },
      { type: "circle", cx: 220, cy: 395, r: 3, fill: "#6060e0", opacity: 0.6 },
      { type: "circle", cx: 500, cy: 410, r: 3, fill: "#e0e060", opacity: 0.6 },
      { type: "circle", cx: 530, cy: 420, r: 3, fill: "#e06060", opacity: 0.6 },
      { type: "circle", cx: 560, cy: 405, r: 3, fill: "#60e060", opacity: 0.6 },
      { type: "circle", cx: 300, cy: 430, r: 3, fill: "#e06060", opacity: 0.5 },
      { type: "circle", cx: 650, cy: 430, r: 3, fill: "#e0e060", opacity: 0.5 },
      { type: "circle", cx: 400, cy: 440, r: 3, fill: "#6060e0", opacity: 0.5 },
    ],
  },
  {
    id: "river-edge",
    name: "River's Edge Glamp",
    gradient: ["#2a3a2a", "#1a2a1a"],
    accent: "#5a4a3a",
    treeColor: "#3a5a3a",
    sunColor: "#d4b84a",
    bgElements: [
      // Warm sunset glow
      { type: "circle", cx: 750, cy: 80, r: 70, fill: "#d4844a", opacity: 0.3 },
      { type: "circle", cx: 750, cy: 80, r: 50, fill: "#e4a45a", opacity: 0.5 },
      // Distant trees
      { type: "polygon", points: "0,300 40,250 80,300", fill: "#2a4a2a", opacity: 0.5 },
      { type: "polygon", points: "50,300 100,220 150,300", fill: "#2a4a2a", opacity: 0.5 },
      { type: "polygon", points: "120,300 180,240 240,300", fill: "#2a4a2a", opacity: 0.5 },
      { type: "polygon", points: "650,300 700,230 750,300", fill: "#2a4a2a", opacity: 0.5 },
      { type: "polygon", points: "710,300 770,210 830,300", fill: "#2a4a2a", opacity: 0.5 },
      { type: "polygon", points: "800,300 850,250 900,300", fill: "#2a4a2a", opacity: 0.5 },
      // River
      { type: "polygon", points: "0,400 300,350 400,480 100,520", fill: "#3a6a8a", opacity: 0.4 },
      { type: "polygon", points: "300,350 600,300 700,420 400,480", fill: "#3a7a9a", opacity: 0.35 },
      { type: "polygon", points: "600,300 900,280 900,380 700,420", fill: "#4a8aaa", opacity: 0.3 },
      // River sparkles
      { type: "circle", cx: 200, cy: 430, r: 2, fill: "#ffffff", opacity: 0.5 },
      { type: "circle", cx: 350, cy: 390, r: 2, fill: "#ffffff", opacity: 0.5 },
      { type: "circle", cx: 500, cy: 360, r: 2, fill: "#ffffff", opacity: 0.5 },
      { type: "circle", cx: 650, cy: 340, r: 2, fill: "#ffffff", opacity: 0.5 },
      { type: "circle", cx: 780, cy: 320, r: 2, fill: "#ffffff", opacity: 0.5 },
      // Near trees (river banks)
      { type: "polygon", points: "0,500 40,380 80,500", fill: "#1a3a1a", opacity: 0.8 },
      { type: "polygon", points: "30,520 80,360 130,520", fill: "#1a3a1a", opacity: 0.8 },
      { type: "polygon", points: "750,480 790,370 830,480", fill: "#1a3a1a", opacity: 0.8 },
      { type: "polygon", points: "800,500 850,350 900,500", fill: "#1a3a1a", opacity: 0.8 },
      // Warm light dots (fireflies)
      { type: "circle", cx: 120, cy: 280, r: 2, fill: "#e4d84a", opacity: 0.7 },
      { type: "circle", cx: 220, cy: 250, r: 2, fill: "#e4d84a", opacity: 0.5 },
      { type: "circle", cx: 350, cy: 300, r: 2, fill: "#e4d84a", opacity: 0.6 },
      { type: "circle", cx: 480, cy: 270, r: 2, fill: "#e4d84a", opacity: 0.5 },
      { type: "circle", cx: 780, cy: 260, r: 2, fill: "#e4d84a", opacity: 0.7 },
    ],
  },
  {
    id: "canyon-hideout",
    name: "Canyon Hideout",
    gradient: ["#5a2a1a", "#3a1a0a"],
    accent: "#8a4a2a",
    treeColor: "#4a3a2a",
    sunColor: "#e4a040",
    bgElements: [
      // Sun
      { type: "circle", cx: 200, cy: 100, r: 55, fill: "#e4a040", opacity: 0.3 },
      { type: "circle", cx: 200, cy: 100, r: 40, fill: "#e8b050", opacity: 0.5 },
      { type: "circle", cx: 200, cy: 100, r: 25, fill: "#ecc060", opacity: 0.6 },
      // Sun rays
      { type: "line", x1: 200, y1: 60, x2: 200, y2: 0, stroke: "#e4a040", opacity: 0.2, width: 2 },
      { type: "line", x1: 160, y1: 80, x2: 100, y2: 20, stroke: "#e4a040", opacity: 0.2, width: 2 },
      { type: "line", x1: 240, y1: 80, x2: 300, y2: 20, stroke: "#e4a040", opacity: 0.2, width: 2 },
      { type: "line", x1: 140, y1: 110, x2: 60, y2: 80, stroke: "#e4a040", opacity: 0.2, width: 2 },
      { type: "line", x1: 260, y1: 110, x2: 340, y2: 80, stroke: "#e4a040", opacity: 0.2, width: 2 },
      // Canyon walls (left)
      { type: "polygon", points: "0,600 100,200 200,600", fill: "#6a3a1a", opacity: 0.6 },
      { type: "polygon", points: "0,600 80,250 150,600", fill: "#7a4a2a", opacity: 0.5 },
      // Canyon walls (right)
      { type: "polygon", points: "600,600 700,180 900,600", fill: "#6a3a1a", opacity: 0.6 },
      { type: "polygon", points: "650,600 750,220 900,600", fill: "#7a4a2a", opacity: 0.5 },
      // Middle canyon formations
      { type: "polygon", points: "300,600 350,350 400,600", fill: "#5a2a1a", opacity: 0.5 },
      { type: "polygon", points: "400,600 450,280 500,600", fill: "#6a3a1a", opacity: 0.45 },
      // Mesa top
      { type: "rect", x: 350, y: 280, width: 100, height: 20, fill: "#8a4a2a", opacity: 0.6, rx: 3 },
      // Cactus silhouettes
      { type: "rect", x: 120, y: 350, width: 8, height: 50, fill: "#2a3a1a", opacity: 0.7, rx: 3 },
      { type: "rect", x: 108, y: 360, width: 6, height: 30, fill: "#2a3a1a", opacity: 0.7, rx: 2 },
      { type: "rect", x: 134, y: 365, width: 6, height: 25, fill: "#2a3a1a", opacity: 0.7, rx: 2 },
      { type: "rect", x: 780, y: 320, width: 8, height: 45, fill: "#2a3a1a", opacity: 0.7, rx: 3 },
      { type: "rect", x: 768, y: 330, width: 6, height: 25, fill: "#2a3a1a", opacity: 0.7, rx: 2 },
      // Desert floor
      { type: "polygon", points: "0,550 900,520 900,600 0,600", fill: "#4a2a1a", opacity: 0.3 },
      // Heat haze lines
      { type: "line", x1: 300, y1: 500, x2: 450, y2: 490, stroke: "#e4a040", opacity: 0.1, width: 1 },
      { type: "line", x1: 400, y1: 510, x2: 550, y2: 500, stroke: "#e4a040", opacity: 0.1, width: 1 },
    ],
  },
]

function buildSvg(location) {
  const w = 800
  const h = 500

  let elements = []

  // Gradient definition
  elements.push(`<defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${location.gradient[0]}" />
      <stop offset="100%" style="stop-color:${location.gradient[1]}" />
    </linearGradient>
    <linearGradient id="overlay" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#000000;stop-opacity:0" />
      <stop offset="100%" style="stop-color:#000000;stop-opacity:0.3" />
    </linearGradient>
  </defs>`)

  // Background
  elements.push(`<rect width="${w}" height="${h}" fill="url(#bg)" />`)

  // Background overlay
  elements.push(`<rect width="${w}" height="${h}" fill="url(#overlay)" />`)

  // Background elements
  for (const el of location.bgElements) {
    switch (el.type) {
      case "circle":
        elements.push(`<circle cx="${el.cx}" cy="${el.cy}" r="${el.r}" fill="${el.fill}" opacity="${el.opacity}" />`)
        break
      case "polygon":
        elements.push(`<polygon points="${el.points}" fill="${el.fill}" opacity="${el.opacity}" />`)
        break
      case "rect":
        if (el.rx) {
          elements.push(`<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="${el.rx}" fill="${el.fill}" opacity="${el.opacity}" />`)
        } else {
          elements.push(`<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" fill="${el.fill}" opacity="${el.opacity}" />`)
        }
        break
      case "ellipse":
        elements.push(`<ellipse cx="${el.cx}" cy="${el.cy}" rx="${el.rx}" ry="${el.ry}" fill="${el.fill}" opacity="${el.opacity}" />`)
        break
      case "line":
        elements.push(`<line x1="${el.x1}" y1="${el.y1}" x2="${el.x2}" y2="${el.y2}" stroke="${el.stroke}" stroke-width="${el.width}" opacity="${el.opacity}" />`)
        break
    }
  }

  // Dark overlay at bottom for text readability
  elements.push(`<rect x="0" y="${h - 100}" width="${w}" height="100" fill="url(#bg)" opacity="0.6" />`)

  // Location name text
  elements.push(`<text x="40" y="${h - 55}" font-family="system-ui, sans-serif" font-size="28" font-weight="700" fill="#ffffff" opacity="0.95">${location.name}</text>`)

  // Decorative line under name
  elements.push(`<rect x="40" y="${h - 35}" width="60" height="3" rx="1.5" fill="${location.accent}" opacity="0.7" />`)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    ${elements.join("\n    ")}
  </svg>`
}

async function generatePlaceholders() {
  console.log("Generowanie obrazów placeholderowych...\n")

  for (const loc of locations) {
    const svg = buildSvg(loc)
    const outputPath = join(outputDir, `${loc.id}.png`)

    try {
      await sharp(Buffer.from(svg))
        .resize(800, 500)
        .png()
        .toFile(outputPath)
      console.log(`  ✓ ${loc.id}.png — ${loc.name}`)
    } catch (err) {
      console.error(`  ✗ ${loc.id}.png — BŁĄD:`, err.message)
    }
  }

  console.log("\nGotowe! Obrazy zapisane w:", outputDir)
}

generatePlaceholders().catch(console.error)
