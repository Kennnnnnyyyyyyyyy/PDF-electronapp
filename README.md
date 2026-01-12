# Open-Source Cross-Platform PDF Annotator

A **Preview-like, open-source PDF annotation and form-filling desktop application** for **Windows and macOS**.

This project focuses on **reliable, drift-free PDF editing** using correct PDF coordinate handling. It supports flat PDFs (like IRS W-8BEN), AcroForm PDFs, and provides a consistent annotation experience similar to macOS Preview — without relying on proprietary SDKs.

---

## Features

* Cross-platform desktop app (Windows + macOS)
* Open and render any PDF
* Preview-style type-anywhere text annotations
* Ink / signature drawing (freehand)
* Stable annotation placement (no shifting or drifting)
* Save & reload editable annotations
* Export filled / flattened PDF
* Optional backend for upload, storage, retrieval
* Optional JWT-based authentication stub

---

## Core Design Principle

All annotations are stored in **PDF coordinates (points)**, not screen pixels.

This guarantees:

* No misalignment on zoom
* No drift after reload
* Consistent export across platforms

This is the same principle used internally by professional PDF tools.

---

## Architecture Overview

```
Desktop App (Electron / Tauri)
│
├── PDF Rendering        → PDF.js
├── Annotation Layer    → HTML + Canvas overlay
├── Coordinate Mapping  → PDF points ↔ viewport pixels
├── Export Engine       → pdf-lib (flattened stamping)
└── Storage
    ├── Local JSON (annotations)
    └── Optional Backend API (PDF + JSON)
```

---

## Tech Stack

### Desktop App

* Electron (recommended) or Tauri
* PDF.js – PDF rendering
* pdf-lib – PDF writing / stamping
* React (or any UI framework)

### Backend (Optional)

* Node.js + Express
* JWT (auth stub)
* Local filesystem storage (MVP)

All dependencies are open-source friendly.

---

## Prerequisites

### Required

* Node.js ≥ 18.x
* npm or pnpm
* Git

### For Desktop Builds

* macOS: Xcode Command Line Tools
* Windows: Windows Build Tools (for Electron packaging)

### Optional

* Docker (if running backend separately)

---

## Repository Structure

```
/apps
  /desktop
    /src
      /pdf            # PDF.js rendering utilities
      /annotations    # Annotation model + overlay UI
      /export         # pdf-lib stamping logic
      /storage        # Save / load JSON annotations
    /public
  /server             # Optional backend API
/docs
README.md
```

---

## Setup & Run (Desktop App)

### Clone the repository

```bash
git clone https://github.com/your-org/pdf-annotator.git
cd pdf-annotator/apps/desktop
```

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run dev
```

This launches the Electron app in development mode.

### Build desktop app

```bash
npm run build
```

Build artifacts will be generated for your platform.

---

## Annotation Model

Annotations are stored in PDF coordinate space:

```json
{
  "id": "a1",
  "type": "text",
  "pageIndex": 0,
  "xPt": 144.2,
  "yPt": 512.6,
  "widthPt": 220,
  "heightPt": 18,
  "fontSizePt": 10,
  "text": "John Doe"
}
```

* Units: PDF points
* Origin: bottom-left of page
* Screen pixels are derived only during rendering

---

## Coordinate Conversion

PDF.js provides canonical helpers:

### PDF to Screen

```js
viewport.convertToViewportPoint(xPt, yPt)
```

### Screen to PDF

```js
viewport.convertToPdfPoint(xPx, yPx)
```

Never store CSS pixel positions.

---

## Exporting the PDF

When the user exports:

1. Load original PDF
2. Iterate annotations
3. Stamp text / ink using pdf-lib
4. Save as flattened PDF

The result works in any PDF viewer.

---

## PDF Type Detection

On load, PDFs are classified as:

| Type     | Handling                   |
| -------- | -------------------------- |
| AcroForm | Optional native field fill |
| XFA      | Treated as flat or warned  |
| Flat     | Annotation + stamping      |

XFA is not supported natively in browsers.

---

## Optional Backend Setup

### Navigate to server

```bash
cd apps/server
```

### Install dependencies

```bash
npm install
```

### Run backend

```bash
npm run dev
```

Backend runs at `http://localhost:4000`.

---

## Backend API (MVP)

| Method | Endpoint                  | Description  |
| ------ | ------------------------- | ------------ |
| POST   | /auth/login               | Returns JWT  |
| POST   | /api/docs/:id/upload      | Upload PDF   |
| GET    | /api/docs/:id             | Download PDF |
| POST   | /api/docs/:id/annotations | Save JSON    |
| GET    | /api/docs/:id/annotations | Load JSON    |

---

## Known Limitations

* No native XFA form filling
* No advanced text reflow
* Flattened export only (by design)
* Annotation UX is MVP-level and will improve over time

---

## License

MIT License (recommended for maximum reuse)

---

## Contributing

Contributions are welcome:

* Bug fixes
* Annotation UX improvements
* Performance optimizations
* Documentation

Please open an issue or pull request.

---

## Philosophy

This project prioritizes:

* Correct PDF math
* Predictable behavior
* Open-source transparency

If annotations do not move when you zoom, the architecture is correct.

---

## Credits

* Mozilla PDF.js
* pdf-lib
* Electron / Tauri communities
