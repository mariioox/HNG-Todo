**STAGE 1a:** Interactive Todo Card

An advanced, stateful Todo Card that extends the Stage 0 foundation with real-time editing, priority tracking, and accessible design patterns.
🚀 Live Demo & Repository

    Live URL: https://hng-todo-byjeffery.vercel.app/


🛠 New in Stage 1a
1. In-Place Editing

The card now supports a seamless Edit Mode. When active, the static display swaps for a comprehensive form (test-todo-edit-form) allowing users to update the title, description, priority, and due date without leaving the card.
2. Intelligent Status Sync

The "Done" status is now a single source of truth. Checking the todo automatically updates the status display and applies visual styling (strike-through and muted colors), ensuring the UI and state remain perfectly synced.
3. Dynamic Time & Overdue Logic

Implemented a minute-accurate timer that displays "Due in..." or "Overdue by..." labels.

    Visual Indicators: High-priority tasks and overdue items feature distinct red accents for immediate recognition.

    Efficiency: The timer stops updating once a task is marked as "Done."

4. Accessible Expansion

To maintain a clean grid layout, long descriptions are collapsed by default. The "Show More" toggle uses aria-expanded and aria-controls to ensure screen reader users can navigate the hidden content easily.
♿ Accessibility Wins

    Focus Management: When exiting Edit Mode, focus is programmatically returned to the "Edit" button to prevent keyboard users from losing their place.

    Live Regions: The timer uses aria-live="polite" to announce updates without being intrusive.

    Semantic Forms: All edit fields are paired with <label> elements for screen reader clarity.

⚙️ Local Setup

    Clone the repo: git clone https://github.com/mariioox/HNG-Todo

    Open index.html in your browser.

    No dependencies or build steps required (Vanilla JS/CSS).
