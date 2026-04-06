# Zorvyn - Personal Finance Tracker

A slick, dark-themed dashboard for tracking your money. Built with React and Recharts, because spreadsheets are boring.

## What's Inside

Basically, it's a finance app that lets you:

- **Track transactions** - Add income and expenses with categories, dates, and descriptions
- **See your money visually** - Charts that actually make sense instead of just staring at numbers
- **Get insights** - Knows your spending patterns, shows you where your money goes
- **Manage everything** - Search, sort, filter transactions, export to CSV if you need it

Yeah, that's pretty much it.

## Getting Started

You'll need Node.js installed. Pretty standard stuff.

```bash
npm install
npm run dev
```

Then open your browser to `http://localhost:5173` and you're good to go.

## How It Works

The app has three main sections:

**Dashboard** - Your financial overview at a glance. See your total balance, income, expenses, and how it all stacks up over the past 6 months.

**Transactions** - The full transaction history. You can search, filter by category or type, sort by date or amount. Also has an export button if you need the data in CSV.

**Insights** - Where it gets interesting. Savings rate, spending breakdown by category, your best and worst months. Plus some observations about your habits.

## Demo Data

The app ships with sample transactions from January to June 2024. Real data for testing without having to manually enter a ton of stuff. All gets stored in localStorage, so if you add or edit anything, it sticks around.

## Features

- **Dark theme** - Because light mode is for people who hate their eyes
- **Responsive design** - Works on desktop, tablet, whatever
- **Role-based UI** - Switch between admin and viewer modes to see what permissions look like
- **Real-time updates** - Changes sync instantly, nothing lags
- **Data persistence** - localStorage keeps your data safe
- **Pretty charts** - Recharts does the heavy lifting here

## Built With

- React - JavaScript framework, you know the deal
- Vite - Super fast bundler
- Recharts - Makes charts that don't look terrible
- CSS-in-JS - Inline styles for that custom dark theme

## Admin vs Viewer

If you're admin, you get full control - add, edit, delete transactions. Switch to viewer and you're read-only. Just to test the permission system basically.

## Future Ideas

Could add budgeting, recurring transactions, better export options, actual authentication (right now there's none). Whatever, it works fine for prototyping.

## License

Do whatever you want with it. It's yours.

---

If something breaks or you have suggestions, just let me know.
