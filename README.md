# CFP NUE Explorer

A research prototype built on the Cool Farm Platform API that transforms nitrogen-flow data into actionable insights. It visualises Nitrogen Use Efficiency (NUE), GHG emission intensity, farm-gate N balance, and benchmarks farms against national FAOSTAT data.

---

## Running the Application

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
```

### Preview the production build locally

```bash
npm run preview
```

---

## First-Time Setup (Credentials)

When you open the app for the first time, a **Settings screen** will appear before you can access any data. You need to enter your API credentials here. They are stored in your browser's `localStorage` and never sent anywhere except directly to the respective APIs.

You need two sets of credentials:

| Field | What it is |
|---|---|
| Cool Farm API Token | Bearer token for the Cool Farm Platform API |
| FAOSTAT Username | Your FAOSTAT account username |
| FAOSTAT Password | Your FAOSTAT account password |

You can update these at any time via the **Settings** link in the navigation bar.

---

## Getting a Cool Farm Platform API Token

1. Log in to the Cool Farm Platform at [app.coolfarm.org](https://app.coolfarm.org)
2. Go to your account / profile settings
3. Navigate to **API Access** or **Developer Settings**
4. Generate a new API token
5. Copy the token and paste it into the Settings screen in this app

The token is sent as a `Bearer` header to `https://api.cfp.coolfarm.org`.

> If you do not have a Cool Farm account, contact Cool Farm Tool at [coolfarmtool.org](https://www.coolfarmtool.org) to request access.

---

## Getting FAOSTAT API Credentials

FAOSTAT requires a registered account to access certain data domains (including ESB — the nitrogen balance dataset used for national NUE benchmarking).

1. Go to [https://www.fao.org/faostat/en/#data](https://www.fao.org/faostat/en/#data)
2. Click **Login / Register** in the top right
3. Create a free FAO account
4. Use your FAO account **email** as the username and your **password** in the Settings screen

The credentials are used to authenticate requests to `https://faostatservices.fao.org/api/v1`.

---

## Using the Application

### About

The home page explains the project — its problem statement, platform context, research question, and methodology. It also embeds the design mockup and links to all project context pages.

### Farms

Browse all farms accessible via your Cool Farm API token. Each farm shows its name, country, IPCC climate zone, soil classification, and SoilGrids soil property data.

### Assessments

Lists all GHG assessments. Click any row to open the **Assessment Detail** view, which shows:

- **Field context** — crop type, field area, yield, country
- **Emission summary** — total emissions, removals, and net balance
- **Emission intensity** — kg CO₂eq per hectare and per tonne of crop, benchmarked against Poore & Nemecek (2018) typical ranges
- **NUE score** — calculated from synthetic fertiliser inputs and estimated crop N removal (IPCC 2006 crop N content values)
- **NUE Sweetspot gauge** — shows whether NUE falls in the optimal range for the crop type and IPCC climate zone
- **Farm-gate N balance** — full nitrogen budget including synthetic fertiliser, biological fixation, and atmospheric deposition
- **FLAG category breakdown** — N₂O, CO₂, and CH₄ by emission source

A chatbot link at the bottom of each assessment connects to the **Cool Farm Nitrogen Navigator** for AI-assisted interpretation.

### Global N Context

Select any country to view FAOSTAT national-level data:

- Cropland NUE from the ESB (Nitrogen Balance) domain
- Reactive nitrogen fertiliser use from the RFN domain

Useful for benchmarking an individual farm's NUE against the national average.

### Soil Lookup

Enter any latitude/longitude coordinate to:

- Identify the IPCC climate zone and WRB soil classification
- Retrieve SoilGrids data (bulk density, clay content, SOC, pH, etc.)

### Value Proposition

Strategic goal, mission, and vision behind the tool, plus a competitive analysis showing how Cool Farm compares to other agri-tech platforms on NUE capability.

### Win-Win Narrative

Explains how a single NUE number creates value simultaneously for farmers (margin), sustainability sourcing teams (evidence), and processors (business case).

### Logic Model

The theory of change: if farmers and processors have access to clear NUE tools, then they adopt better practices, leading to improved NUE and lower GHG emissions.

### Foundation

The key assumptions underlying the prototype's design, theory of change, adoption pathway, and implementation plan.

### Roadmap

A 12-month phased plan from TRL 4 prototype development through to TRL 6 validation in the real environment.

### Chatbot

The **Cool Farm Nitrogen Navigator** is an AI assistant trained on the Cool Farm methodology, FAOSTAT datasets, and NUE literature. Access it via the **Chatbot ↗** link in the navigation bar.

### Mockup

A static design mockup of the platform. Accessible via **Mockup ↗** in the navigation bar or embedded on the About page.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| Data fetching | TanStack Query v5 |
| Styling | CSS Modules |
| Deployment | Vercel |

---

## Deployment

The app is deployed on Vercel. The `vercel.json` uses a filesystem-first routing strategy so static files (e.g. `mockup.html`) are served correctly alongside the React SPA:

```json
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

Any file placed in the `public/` folder will be available at the root path after deployment.
