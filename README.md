# Schmalify

![Schmalify Logo](path/to/logo.png)

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About the Project

Schmalify is a second-hand shopping website tailored for students of Hochschule Schmalkalden. It aims to make it easy for students to buy and sell items locally within their community, creating an accessible platform for sustainable and budget-friendly exchanges.

## Features

- **User Accounts & Authentication**: Secure account creation and login for students.
- **Item Listings**: Users can post, edit, and delete their own listings, including multiple images.
- **Search & Filter**: Dynamic filtering options to narrow down items based on category, price, condition, etc.
- **Messaging**: In-app chat functionality for buyers and sellers to communicate directly.
- **Responsive Design**: Optimized for both desktop and mobile use.
- **Category Browsing**: Organized categories for efficient browsing.
- **Guest Access**: Allows users to browse as guests with limited functionality.

## Tech Stack

- **Frontend**: Vue 3, TypeScript, Nuxt 3, Nuxt UI
- **Backend**: Nuxt Nitro, Cloudflare D1 (SQLite), Drizzle ORM
- **Authentication**: [OAuth or other auth methods]
- **Deployment**: Cloudflare Pages
- **Other Tools**: Cloudflare KV for temporary message storage

## Getting Started

To get a local copy of this project up and running, follow these steps:

### Prerequisites

- Node.js and npm installed globally.
- Access to a Cloudflare account (for specific features).

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/your-username/schmalify.git
   ```
2. Install dependencies
   ```sh
   npm install
   ```
3. Configure environment variables
   - Create a `.env` file with necessary keys, including Cloudflare keys if required.
4. Start the development server

   ```sh
   npm run dev
   ```

   ## Usage

- **Creating Listings**: Users can create new listings by filling out details and adding images.
- **Messaging Sellers**: Message a seller directly to inquire about an item.
- **Filtering & Searching**: Use the filters on the listings page to narrow down items.

## Screenshots

![Home Page](path/to/homepage-screenshot.png)
![Item Listing](path/to/item-listing-screenshot.png)
![Messaging Feature](path/to/messaging-screenshot.png)

## Project Structure

- `components/`: Contains all reusable components (buttons, modals, etc.).
- `pages/`: Pages for each route in the app (home, profile, item listings).
- `store/`: Pinia store for state management (e.g., item data, user data).
- `composables/`: Contains utility functions and reusable logic.
- `public/`: Static assets such as images.

## Contact

Created by [Your Name](mailto:your.email@example.com) - feel free to reach out!
