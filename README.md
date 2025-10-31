# ☕ Coffee Brew Dashboard

A modern dark-themed pour-over coffee brewing calculator with customizable presets and brew method management. Built with React, TypeScript, and Tailwind CSS.

🔗 **Try it**: [https://stromland.github.io/coffee/](https://stromland.github.io/coffee/)

## Features

### ☕ Coffee Calculator

- Calculate water amounts based on coffee weight and ratio
- Real-time calculations with visual feedback
- Customizable coffee-to-water ratios

### 📖 Multiple Brewing Methods

- **4:6 Method** (Tetsu Kasuya) - Original, Sweet, and Balanced presets with 40/60 split validation
- **Hoffman Method** (James Hoffmann) - 1 Cup V60 technique with 5 equal pours
- **Single Pour** - Simple continuous pour technique

### 🎯 Brew Method Management

- Create and edit custom brew methods
- Manage pour patterns with percentages and timing
- Save and delete custom methods (persisted in localStorage)
- Full editor with validation and error handling

### ⏱️ Brewing Guide

- Step-by-step brewing instructions with timing
- Interactive brew mode with timer and progress tracking
- Cumulative water tracking per pour
- Visual progress indicators

### 📊 Brewing History

- Save and review past brewing sessions
- Track coffee amount, water amount, method, and timing
- "Brew Again" feature to replicate previous sessions
- Session ratings and notes

### 🎨 Modern UI/UX

- Dark-themed dashboard with coffee-inspired color palette
- Responsive design optimized for mobile and desktop
- Smooth navigation with React Router
- Clean, intuitive interface

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **LocalStorage** - Data persistence

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173/coffee`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Routes

- `/coffee` - Dashboard with calculator and brewing steps
- `/coffee/methods` - Brew method management interface
- `/coffee/history` - Brewing history and session tracking

## Credits

- [Tetsu Kasuya](https://projectbarista.com/4-6-method-recipe/) - 4:6 Method
- [James Hoffmann](https://www.youtube.com/watch?v=1oB1oDrDkHM) - Hoffman Method

## License

MIT
