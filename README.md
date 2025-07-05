# Trekking Website

## Overview

The Trekking Website is a React-based web application designed to promote trekking packages in Nepal. It features a user-friendly interface with a fixed navigation bar, a hero slider showcasing popular destinations, and sections for featured packages, FAQs, and newsletter subscription. The site integrates with a backend API to fetch package data and supports responsive design using Tailwind CSS. The project aims to provide a professional and engaging experience for users seeking trekking adventures.

## Features

1. Fixed Navigation Bar: A static navbar pinned to the top of all pages, featuring a logo, links to Home, Packages, About Us, and Contact Us, a search icon, and a login button.
2. Hero Slider: A full-width slider on the homepage displaying high-quality images of trekking destinations (e.g., Annapurna Base Camp, Everest Base Camp, Chitwan Pokhara Tour) with captions, “View Details” buttons, fade transitions, and a gradient overlay for readability.
3. Featured Packages: Displays a grid of trekking packages fetched from the backend API, showing title, duration, price, difficulty, and images, with a “View All” link.
4. Why Choose Us: Highlights key benefits (Great Value, Safe and Secure, Customer Satisfaction) with icons and concise descriptions.
5. FAQs: An accordion-style section answering common questions about trekking in Nepal, such as internet availability and visa information.
6. Newsletter Subscription: A form to collect email addresses for updates on trekking packages and offers.
7. Responsive Design: Optimized for desktop and mobile devices using Tailwind CSS, ensuring accessibility and a consistent user experience.
8. Routing: Supports navigation to Home (/), Packages (/packages), Package Details (/packages/:id), Sign Up (/signup), Login (/login), About (/about), Contact (/contact), and Search (/search) pages.
9. Error Handling: Includes an ErrorBoundary component for the Packages page to handle API fetch errors gracefully.

---

## Tech Stack

### Frontend:

- React (react-router-dom for routing, react-slick for the slider, @heroicons/react for icons)
- Tailwind CSS for styling
- Inter font for typography

### Backend:

Django

## Dependencies:

- react-router-dom
- react-slick
- slick-carousel
- @heroicons/react

---

## API Endpoints

The frontend communicates with a backend restful APIs to fetch trekking package data.

- GET /api/packages/
  Description: Retrieves a list of trekking packages.

## Usage: Fetched in Homepage.jsx and PackageList.jsx to display package cards.

---

# Installation

## Clone the Repository:

`git clone https://github.com/Allan0092/TrekkingWebsite.git`
`cd trekkingwebsite`

- Install Frontend Dependencies:

  `cd trekkingfrontend`
  `npm install`

- Install Backend Dependencies

`cd backend`
`python -m venv venv`
`source venv/bin/activate # On Windows: venv\Scripts\activate`
`pip install -r requirements.txt`

## Set Up Assets:

Ensure public/logo.png and public/icons/crown.png exist.
Place slider images (public/images/5.jpeg, public/images/8.JPG, public/images/9.jpeg) in 16:9 ratio (e.g., 1920x1080px).
Add Inter font in trekkingfrontend/index.html:<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">

## Run the Backend:

`cd backend`
`python manage.py runserver`

## Run the Frontend:

`cd trekkingfrontend`
`npm run dev`

## Access the Application:

Open http://localhost:5173/ in your browser.

## Usage

- Navigation: Use the fixed navbar to navigate to Home, Packages, About Us, Contact Us, Search, or Login pages.
- Homepage: View the hero slider, featured packages, Why Choose Us section, FAQs, and subscribe to the newsletter.
- Packages: Browse all trekking packages fetched from the API.
- Package Details: View details for a specific package by navigating to /packages/:id.

# Screenshots

1. Homepage

2. Packages

3. Package Details

4. Booking Page

5. Sign Up

6. Login

7. About

8. Contact
