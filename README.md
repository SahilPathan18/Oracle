# ORACLE — Protocol 3000

> **THE LAST HUMAN** | Humanity vs. Artificial Intelligence. Survive.

A tech fest website for St Paul's College built with HTML, CSS, JavaScript, and PHP.

## Project Structure

```
ORACLE/
├── index.html                    # Landing page (hero, video, coordinators)
├── README.md
├── .gitignore
│
├── pages/                        # All sub-pages
│   ├── events.html               # Event listings with registration links
│   ├── rules.html                # Rules & regulations accordion
│   ├── teams.html                # Registered team cards (horizontal scroll)
│   ├── register.html             # Team registration form
│   └── live_score.html           # Live leaderboard (auto-refreshing)
│
├── css/                          # Stylesheets
│   ├── style.css                 # Global styles & design tokens
│   └── components/
│       └── staggered-menu.css    # Animated fullscreen menu component
│
├── js/                           # JavaScript
│   └── components/
│       └── staggered-menu.js     # Staggered menu logic (requires GSAP)
│
├── api/                          # PHP backend
│   ├── scores.php                # JSON API for live leaderboard scores
│   └── upload.php                # Audio file upload handler
│
└── assets/                       # Static assets
    └── images/
        └── hero-bg.png           # Hero section background image
```

## Tech Stack

- **Frontend:** HTML5, CSS3, Bootstrap 5, GSAP
- **Backend:** PHP (scores API, file uploads)
- **Menu Component:** Custom StaggeredMenu (vanilla JS + GSAP)

## Getting Started

1. Clone the repository
2. Serve with any PHP-capable local server (e.g. XAMPP, WAMP, or `php -S localhost:8000`)
3. Open `index.html` in your browser

## Events

| Event | Description |
|-------|-------------|
| **Code Breaker** | 24-hour hackathon |
| **Robo Wars** | Robot combat arena |
| **Cyber Hunt** | Digital scavenger hunt |
| **V-Strike** | 5v5 Valorant tournament |
