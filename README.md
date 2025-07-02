### Trekking Website

# Overview

The Trekking Website is a React-based web application designed to promote trekking packages in Nepal. It features a user-friendly interface with a fixed navigation bar, a hero slider showcasing popular destinations, and sections for featured packages, FAQs, and newsletter subscription. The site integrates with a backend API to fetch package data and supports responsive design using Tailwind CSS. The project aims to provide a professional and engaging experience for users seeking trekking adventures.
Features

Fixed Navigation Bar: A static navbar pinned to the top of all pages, featuring a logo, links to Home, Packages, About Us, and Contact Us, a search icon, and a login button.
Hero Slider: A full-width slider on the homepage displaying high-quality images of trekking destinations (e.g., Annapurna Base Camp, Everest Base Camp, Chitwan Pokhara Tour) with captions, “View Details” buttons, fade transitions, and a gradient overlay for readability.
Featured Packages: Displays a grid of trekking packages fetched from the backend API, showing title, duration, price, difficulty, and images, with a “View All” link.
Why Choose Us: Highlights key benefits (Great Value, Safe and Secure, Customer Satisfaction) with icons and concise descriptions.
FAQs: An accordion-style section answering common questions about trekking in Nepal, such as internet availability and visa information.
Newsletter Subscription: A form to collect email addresses for updates on trekking packages and offers.
Responsive Design: Optimized for desktop and mobile devices using Tailwind CSS, ensuring accessibility and a consistent user experience.
Routing: Supports navigation to Home (/), Packages (/packages), Package Details (/packages/:id), Sign Up (/signup), Login (/login), About (/about), Contact (/contact), and Search (/search) pages.
Error Handling: Includes an ErrorBoundary component for the Packages page to handle API fetch errors gracefully.

Tech Stack

Frontend:
React (react-router-dom for routing, react-slick for the slider, @heroicons/react for icons)
Tailwind CSS for styling
Inter font for typography

Backend:
Django

Dependencies:
react-router-dom
react-slick
slick-carousel
@heroicons/react

API Endpoints
The frontend communicates with a backend API to fetch trekking package data. Below is the known endpoint:

GET /api/packages/
Description: Retrieves a list of trekking packages.
Response:[
{
"id": 1,
"title": "Annapurna Base Camp Trek",
"duration": 14,
"price": 1450,
"difficulty": "MODERATE",
"images": [
{
"image": "path/to/image.jpg",
"alt_text": "Annapurna Base Camp"
}
]
},
...
]

Usage: Fetched in Homepage.jsx and PackageList.jsx to display package cards.

Note: Additional endpoints (e.g., for package details, newsletter subscription) may be implemented in the backend. Update this section as new endpoints are added.
Installation

Clone the Repository:
git clone <repository-url>
cd trekking-website

Install Frontend Dependencies:
cd trekkingfrontend
npm install

Install Backend Dependencies
cd backend
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
pip install -r requirements.txt

Set Up Assets:

Ensure public/logo.png and public/icons/crown.png exist.
Place slider images (public/images/5.jpeg, public/images/8.JPG, public/images/9.jpeg) in 16:9 ratio (e.g., 1920x1080px).
Add Inter font in trekkingfrontend/index.html:<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">

Run the Backend:
cd backend
python manage.py runserver

Run the Frontend:
cd trekkingfrontend
npm run dev

Access the Application:

Open http://localhost:5173/ in your browser.

Usage

Navigation: Use the fixed navbar to navigate to Home, Packages, About Us, Contact Us, Search, or Login pages.
Homepage: View the hero slider, featured packages, Why Choose Us section, FAQs, and subscribe to the newsletter.
Packages: Browse all trekking packages fetched from the API.
Package Details: View details for a specific package by navigating to /packages/:id.
Testing:
Verify the navbar remains fixed while scrolling on all pages.
Check the hero slider for proper image display (no cropping) and smooth transitions.
Test API connectivity: curl http://localhost:8000/api/packages/.
Run Lighthouse for accessibility and performance audits.

Screenshots
Note: Screenshots will be added after page completion.
Homepage

Packages

Package Details

Sign Up

Login

About

Contact

Search

Future Enhancements

Implement a functional search page for the /search route.
Develop full About.jsx and Contact.jsx components.
Add backend API endpoint for newsletter subscription.
Enhance PackageDetails.jsx with consistent styling.
Add user authentication for login and sign-up functionality.

Contributing
Contributions are welcome! Please submit a pull request or open an issue for bugs, features, or improvements.
License
This project is licensed under the MIT License.
