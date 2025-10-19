# ☕ Coffee Brew Calculator

A beautiful and intuitive pour-over coffee brewing calculator built with React and TypeScript. This application helps coffee enthusiasts perfect their pour-over technique with precise measurements, timing, and step-by-step brewing instructions.

🔗 **Live Demo**: [https://stromland.github.io/coffee/](https://stromland.github.io/coffee/)

## Features

- **Coffee Calculator**: Input your coffee amount and water ratio to automatically calculate total water needed
- **Multiple Brewing Methods**: 
  - **4:6 Method** by Tetsu Kasuya (2016 World Brewers Cup Champion) - 4 progressive pours
  - **Hoffman Method** by James Hoffmann - 1 Cup V60 technique with 5 equal pours
  - **Single Pour** - Simple continuous pour method
- **Step-by-Step Instructions**: Detailed brewing steps with precise timing and water amounts for each pour
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Credits & Resources**: Links to original brewing method creators and tutorials

## Tech Stack

### Core Technologies
- **React 19.1.1** - Modern React with latest features
- **TypeScript 5.9.3** - Type-safe development
- **Vite 7.1.7** - Lightning-fast build tool and dev server

### Styling
- **Tailwind CSS 4.1.14** - Utility-first CSS framework
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.21** - Automatic vendor prefixing

### Code Quality
- **ESLint 9.36.0** - Linting and code quality
- **TypeScript ESLint 8.45.0** - TypeScript-specific linting rules

## Color Palette

The application uses an earthy, coffee-inspired color palette:

- **Cream** (`#fefae0`) - Background and light elements
- **Olive Dark** (`#283618`) - Dark text and headings
- **Olive** (`#606c38`) - Primary actions, borders, and accents
- **Caramel** (`#dda15e`) - Secondary accents and highlights
- **Coffee Brown** (`#bc6c25`) - Emphasis, step indicators, and important values

## Getting Started

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd coffee
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/          # React components
│   ├── CoffeeCalculator.tsx    # Coffee amount and ratio input
│   ├── BrewingPresets.tsx      # Brewing method selection
│   └── BrewingSteps.tsx        # Step-by-step brewing instructions
├── types/              # TypeScript type definitions
│   └── coffee.ts       # Coffee-related interfaces
├── utils/              # Utility functions
│   └── coffeeCalculations.ts  # Brewing calculations and methods
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## Brewing Methods

### 4:6 Method (Tetsu Kasuya)
Custom pour pattern designed for optimal flavor:
- Pour 1: 16.67% (e.g., 50g for 300g total)
- Pour 2: 23.33% (e.g., 70g for 300g total)
- Pour 3: 30% (e.g., 90g for 300g total)
- Pour 4: 30% (e.g., 90g for 300g total)
- Total brew time: ~3:30

### Hoffman Method (James Hoffmann)
Based on the 1 Cup V60 technique:
- 5 equal pours of 20% each
- Includes bloom phase with gentle swirl
- Progressive pours to 40%, 60%, 80%, 100%
- Total brew time: ~3:00

## Credits

- **4:6 Method**: [Tetsu Kasuya](https://projectbarista.com/4-6-method-recipe/)
- **Hoffman Method**: [James Hoffmann](https://www.youtube.com/watch?v=1oB1oDrDkHM)

## License

This project is open source and available under the MIT License.

