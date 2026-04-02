# GPA Calculator & Tracker Dashboard

A pixel-accurate React dashboard for calculating and tracking relative grading reports at the class level. Built with React, Tailwind CSS, and Recharts.

![GPA Dashboard](https://via.placeholder.com/1200x600/6aa78e/ffffff?text=GPA+Dashboard)

## Project Structure

- `src/main.tsx` — Application entrypoint
- `src/app/App.tsx` — Layout wrapper and page shell
- `src/app/components/` — Reusable UI components
  - `Dashboard.jsx` — Main logic and data orchestration
  - `UploadPanel.jsx` — CSV + SIGP input
  - `GPAOverview.jsx`, `SemesterOverview.jsx` — KPI cards
  - `ClassesTable.jsx` — Per-course table
  - `ClassByWeightChart.jsx` — Donut chart (Recharts)
  - `GradeOverviewChart.jsx` — Grade bar chart
  - `NormalCurveChart.jsx` — New normal curve chart
  - `ThemeProvider.jsx` — Theme-state provider
- `src/app/utils/` — Data mapper and formatter helpers
  - `dataMappers.js` — API response aggregation
  - `formatters.js` — grade and number utilities
  - `getGradeClass.js` — grade CSS class mapping
- `src/app/components/api.js` — API POST wrapper

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS 4
- Recharts 2
- Lucide React for icons
- CSS variables for theming
- Express / Node backend (in parent project)

## Features

- CSV upload for marks + credits
- Optional SIGP adjustment
- Automatic grade assignment using Z-score
- Per-course & per-class aggregates
- GPA summary cards
- Grade distribution bar chart
- Class-by-weight donut chart
- Normal distribution bell curve chart (new)
- Theme switching + responsive design
- Error handling and loading state

## Installation & Setup

```bash
# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage


- **CSV Upload System** — Upload scores and credits CSV files with optional SIGP adjustment
- **Real-time Grade Calculation** — POST data to backend and display comprehensive results
- **Interactive Charts** — Donut chart (class weight distribution) and bar chart (grade overview)
- **Class-level Aggregates** — View semester GPA, cumulative GPA, and per-course statistics
- **Theme Switching** — Three beautiful color palettes (Mint Cream, Peach Rose, Cool Gray)
- **Responsive Design** — Desktop-first layout that adapts to tablet and mobile
- **Accessible UI** — Semantic markup, ARIA labels, keyboard navigation

## Tech Stack

- **React 18.3** — Component-based UI with hooks
- **Tailwind CSS v4** — Modern utility-first styling
- **Recharts 2.15** — Beautiful, responsive charts
- **Lucide React** — Icon library
- **CSS Variables** — Dynamic theming system

## Installation & Setup

```bash
# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

### 1. Start the Backend API

Ensure your backend server is running at `http://localhost:8000/grades` and accepts the following:

**Endpoint:** `POST /grades`

**FormData Parameters:**
- `csvMarksFile` — Scores CSV file
- `csvCreditsFile` — Credits CSV file
- `sigp` — Optional numeric value for grade adjustment

**Response Format:**
```json
{
  "success": true,
  "results": [
    {
      "name": "Student Name",
      "courseCredits": { "Course 1": 3, "Course 2": 4 },
      "courseGrades": { "Course 1": "A", "Course 2": "B+" },
      "courseZScores": { "Course 1": 0.5 },
      "avgZScore": 0.3,
      "summary": {
        "sgpa": "8.5",
        "total_credits": 12,
        "sigp_added": 3
      }
    }
  ]
}
```

### 2. Prepare CSV Files

Create two CSV files following these formats:

**scores.csv:**
```csv
Name,Bio 201,Music 202,Math 303
Maria Garcia,85,92,78
John Smith,90,88,95
...
```

**credits.csv:**
```csv
Course,Credits
Bio 201,4
Music 202,3
Math 303,4
```

### 3. Upload and Calculate

1. Open the application in your browser
2. Click "Choose File" for both scores and credits CSV files
3. (Optional) Enter a SIGP value for grade adjustment
4. Click "Calculate Grades"
5. View the comprehensive dashboard with all metrics and charts

## Components Architecture

```
App.tsx
├── ThemeProvider.jsx          // Manages color palette switching
│   └── ColorPaletteSwitcher   // UI for theme selection
├── Header.jsx                  // App title with custom fonts
└── Dashboard.jsx               // Main container
    ├── UploadPanel.jsx         // File uploads + SIGP input
    ├── SemesterHeader.jsx      // Semester name + year selector
    ├── GPAOverview.jsx         // GPA summary card
    ├── SemesterOverview.jsx    // Semester statistics card
    ├── ClassesTable.jsx        // Per-course grade table
    ├── ClassByWeightChart.jsx  // Donut chart (recharts)
    └── GradeOverviewChart.jsx  // Bar chart (recharts)
```

## Utilities

### `utils/dataMappers.js`

Transforms backend response into dashboard-ready aggregates:
- Course-level statistics (average grades, grade points)
- Class weight distribution for donut chart
- Grade distribution for bar chart
- GPA summary calculations

### `utils/formatters.js`

Helper functions for data formatting:
- `gradeToPoints()` — Convert letter grades to numeric values
- `formatGPA()` — Format GPA to 2 decimal places
- `getGradeBadgeColor()` — Get Tailwind classes for grade badges

### `components/api.js`

Fetch wrapper for posting grade data to backend.

## Theming

The application supports three color palettes controlled via CSS variables:

### Mint Cream (Default)
- Background: `#fbfaf7`
- Accent: `#6aa78e`
- Cards: `#ffffff`

### Peach Rose
- Background: `#fef8f5`
- Accent: `#d97b6e`
- Cards: `#ffffff`

### Cool Gray
- Background: `#f5f7fa`
- Accent: `#6b7c93`
- Cards: `#ffffff`

**Switch themes** using the color circles in the top-right corner.

## Grade Scale

The default grade-to-point conversion:

| Grade | Points |
|-------|--------|
| A+    | 10.0   |
| A     | 9.0    |
| B     | 7.0    |
| C     | 5.0    |
| D     | 4.0    |
| F     | 0.0    |

Customize this in `utils/formatters.js` if needed.

## Layout Structure

The dashboard follows the layout from the reference image:

```
┌─────────────────────────────────────────────────────┐
│                    Header (Title)                   │
│              + Theme Switcher (top-right)           │
├─────────────────────────────────────────────────────┤
│                   Upload Panel                      │
├──────────────┬──────────────┬──────────────────────┤
│   Semester   │  GPA         │  Semester            │
│   Header     │  Overview    │  Overview            │
├──────────────┴──────────────┴──────────────────────┤
│              Classes Table (wide)                   │
├──────────────────────────┬──────────────────────────┤
│  Class by Weight         │  Grade Overview          │
│  (Donut Chart)           │  (Bar Chart)             │
└──────────────────────────┴──────────────────────────┘
```

## Responsive Behavior

- **Desktop (>1024px)**: 3-column grid layout as shown above
- **Tablet (768-1024px)**: 2-column grid, stacked charts
- **Mobile (<768px)**: Single column, all elements stacked

## Accessibility

- Semantic HTML5 elements
- ARIA labels on interactive elements
- Keyboard-navigable file inputs and buttons
- High contrast text for readability
- Focus indicators on all interactive elements

## API Error Handling

The upload panel handles common errors:
- Missing CSV files
- Backend connection failures
- Invalid response formats
- Network timeouts

Errors are displayed in a red alert box below the upload form.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License

This project is provided as-is for educational and demonstration purposes.

## Contributing

Feel free to submit issues or pull requests for improvements!

---

**Built with ❤️ using Figma Make**
