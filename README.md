# ApexVision 3D Configurator

An interactive 3D product configurator that runs in the browser. Users can rotate a 3D model, change its material finish, inspect parts and save a snapshot. Built with Next.js, React Three Fiber and Three.js.

**Live demo:** https://apexvision-3d-configurator.vercel.app

## Key Features

- Real-time 3D viewer with orbit, zoom and pan controls
- Material presets (Matte Midnight, Cyberpunk Neon, Brushed Titanium, Rose Gold Luxury) that change color, roughness and metalness
- Product switcher to cycle between several 3D models
- Exploded view toggle that separates model parts
- Clickable hotspots that move the camera and show a spec popover
- Day and space scene modes with environment lighting, stars and contact shadows
- Snapshot button that downloads the current view as a PNG
- Share link: the selected preset is saved in the URL (`?preset=...`) and copied to the clipboard
- Loading screen while models load

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Three.js, React Three Fiber and Drei
- Zustand (state management)
- Framer Motion
- Tailwind CSS v4
- Vercel (hosting)

## Screenshots

Screenshots will be added here.

<!-- Add images here, for example: ![Configurator](docs/screenshots/configurator.png) -->

## Getting Started

### Prerequisites

- Node.js 20 or later

### Run

```bash
git clone https://github.com/majidawan01/apexvision-3d-configurator.git
cd apexvision-3d-configurator
npm install
npm run dev      # http://localhost:3000
```

Build for production:

```bash
npm run build
npm start
```

## Environment Variables

None.

## Project Structure

```
app/                     Next.js entry (layout and page)
src/components/canvas/   3D scene, model loading and hotspots
src/components/ui/       Sidebar controls and top banner
src/components/common/   Loading screen and spec popover
src/store/               Zustand configurator store
public/models/           .glb 3D models
```

## 3D Models

The `.glb` files in `public/models` are third-party sample models. See their original sources for license and credit details.

## Author

**Majid Awan** · [Portfolio](https://majid-awan-updated-portfolio-stzz.vercel.app) · [LinkedIn](https://www.linkedin.com/in/majid-awan-8210943a3) · [GitHub](https://github.com/majidawan01)
