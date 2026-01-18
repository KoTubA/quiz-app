# Quiz App

A modern, high-performance web application built with **Astro**, **React**, and **Tailwind CSS**. Designed for speed, accessibility, and a premium user experience.

## ✨ Key Features

- **🚀 Hybrid Architecture**: Leverages Astro's zero-JS-by-default approach with React islands for interactivity.
- **🧩 Diverse Question Types**:
  - **Single Choice**: Classic radio button selection.
  - **Multiple Choice**: Select all that apply.
  - **Matching**: Interactive dropdowns for pairing items.
  - **Open Question**: Self-check text revelation.
- **💾 Smart Persistence**: Uses `localStorage` to save progress (answered/correct/incorrect states) without storing sensitive answer data.
- **🎨 Premium UI/UX**:
  - Fully responsive, mobile-first design.
  - Dark mode aesthetic with glassmorphism effects.
  - Smooth transitions and tactile feedback (active scaling).
  - Custom Tailwind configuration for consistent theming.
- **⚡ Optimized Assets**: Icons delivered as optimized SVGs via `vite-plugin-svgr`.
- **♿ Accessibility**: Semantic HTML and ARIA attributes for keyboard navigation and screen readers.

## 🛠 Tech Stack

- **Framework**: [Astro](https://astro.build/) - For static generation and routing.
- **UI Library**: [React](https://react.dev/) - For complex interactive components.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework.
- **Build Tool**: [Vite](https://vitejs.dev/) - Lightning-fast build tool.
- **Icons**: SVG components via `vite-plugin-svgr`.
- **Type Checking**: `prop-types` for runtime validation.

## 📂 Project Structure

```bash
src/
├── assets/          # Static assets including optimized SVGs
├── components/      # React components
│   └── Quiz/        # Core Quiz logic and sub-components
├── config/          # Global constants and configuration
├── data/            # Local JSON data storage
├── hooks/           # Custom React hooks (useQuizState, useLocalStorage)
├── layouts/         # Astro layouts
├── pages/           # Astro pages (routing)
└── utils/           # Helper functions for validation and logic
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/quiz-app.git
   cd quiz-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:4321](http://localhost:4321) in your browser.

## ⚙️ Configuration

The application supports two data sources for quiz questions: **Local JSON** or **External API**. This is controlled via `src/config/quizConfig.js`.

### 1. Local Data (Default)

Set `DATA_SOURCE: "local"` to load questions from `src/data/quizData.json`.

**Adding Questions:**
Extend the `questions` array in the JSON file. Supported types: `single`, `multiple`, `matching`, `open`.

```json
{
  "id": 101,
  "type": "single",
  "question": "What is the capital of Poland?",
  "options": [
    { "id": 1, "text": "Warsaw", "isCorrect": true },
    { "id": 2, "text": "Krakow", "isCorrect": false }
  ]
}
```

### 2. External API

Set `DATA_SOURCE: "api"` to fetch questions via GraphQL. Configure your credentials in `src/config/quizConfig.js`:

```javascript
  CONTENTFUL: {
    SPACE_ID: "your_space_id",
    ACCESS_TOKEN: "your_access_token",
    ENDPOINT: "your_graphql_endpoint",
  },
```
