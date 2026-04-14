
## 🧰 Tech Stack:
The following tech stack is used in this project:

* **React 19** : JavaScript library for building user interfaces with component-based architecture.
* **TypeScript** : A strongly typed superset of JavaScript that helps catch errors early and improves code quality.
* **React Bootstrap** : Bootstrap components rewritten as React components for easy integration with React apps.
* **Bootstrap 5** : A responsive CSS framework that provides pre-built UI styles and layout utilities.
* **React Router v7** : Handles client-side routing, allowing seamless navigation between pages without full reloads.
* **React Icons** : A popular icon library offering access to hundreds of SVG icons from various icon sets.

---

## 📦 Dependencies:
The following dependencies are used in this project:

```json
"dependencies": {
  "bootstrap": "^5.3.7",
  "react": "^19.1.0",
  "react-bootstrap": "^2.10.10",
  "react-dom": "^19.1.0",
  "react-icons": "^5.5.0",
  "react-router-dom": "^7.6.3"
}
```

##  Project Structure:

The following structure is used in this project to maintain a clean and modular codebase:

```bash
cart-system-typescript/
├── node_modules/
├── public/
├── src/                         
│   ├── assets/                  # Images, icons, and other static assets
│   ├── components/              # Reusable UI components (Navbar, Footer, CartItem, etc.)
│   ├── context/                 # React Context logic (e.g., ShoppingCartContext)
│   ├── data/                    # Static item data (items.json)
│   ├── hooks/                   # Custom React hooks (e.g., useLocalStorage)
│   ├── pages/                   # Route components like Home and About
│   ├── utilities/               # Utility functions (e.g., formatCurrency)
│   ├── App.tsx                  # Main app component
│   └── main.tsx                 # Application entry point
├── .gitignore                   # Git ignored files
├── eslint.config.js
├── index.html                   # Main HTML template
├── LICENSE
├── package-lock.json
├── package.json                 # Project metadata and dependencies
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---
