# Buildwise

Buildwise is a front-end prototype for construction operations management and a leftover-material marketplace. It brings site monitoring, inventory, worker attendance, task coordination, surplus recovery, and downloadable operational reports into one responsive web application.

## Features

- Multi-site dashboard with progress, budget, workforce, and alert indicators
- Material inventory with low-stock warnings, usage logging, and surplus identification
- Waste-to-value workflow that converts eligible leftovers into marketplace listings
- Worker directory, digital attendance, one-click mobile punch, and simulated QR verification
- Task assignment, progress updates, prerequisite-aware task flow, and notifications
- Builder, engineer, and worker-focused views
- Client-side PDF reports and CSV exports

## Technology

- React 19 and React DOM
- Vite 8
- React Context and browser localStorage for prototype state and persistence
- jsPDF and jspdf-autotable for in-browser PDF reporting
- Lucide React and canvas-confetti for interface elements and feedback

## Run Locally

Prerequisite: install Node.js 20 or later.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). The application uses seeded demo data on first launch and saves changes in the browser's localStorage.

## Other Commands

```bash
npm run build
npm run preview
npm run lint
```

`npm run build` creates the production bundle in `dist/`. `npm run preview` serves that bundle locally.

## Project Structure

```text
src/
  components/     Feature views and reusable UI components
  context/        Central application state and business actions
  data/           Seed data for the prototype
  utils/          PDF generation and task-priority utility
  styles/         Global, layout, component, and design-token styles
```

## Prototype Scope

Buildwise is a client-side academic prototype. Data persists only in the browser on the current device. Authentication and the QR scanner are simulated; a production version would add a secure backend, real authentication, cloud storage, and camera/QR validation.
