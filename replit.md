# Shindo's Hub - Game Portal

## Overview
A modern game portal website that hosts browser-based games. Features a sleek dark UI with Top Played tracking, searchable game library, recently played history, and mobile-friendly responsive design. Made by Shindo Productions.

## Features
- **Loading Screen**: Animated loading screen with progress bar and "Made by Shindo Productions" branding
- **Top Played**: Tracks actual play counts per game using localStorage, displays top 6 most played with rank badges
- **Game Library**: 24+ browser-based games including Cuphead, VEX series, Minecraft, Sonic games, racing, puzzle, and rhythm games
- **Game Modal**: Games open in fullscreen-capable modal with controls
- **Fullscreen Mode**: One-click fullscreen button when playing games
- **Game Ratings**: 5-star rating system for logged-in users, shows average ratings
- **User Profiles**: Custom avatar selection from game thumbnails
- **Account System**: Login/register with admin (Shindo957) and member accounts
- **Admin Controls**: Reset play counts, view users with join dates, delete accounts
- **Search**: Real-time search filtering by game name, description, or tags
- **Recently Played**: Tracks last 8 games played using localStorage
- **Mobile-Friendly**: Responsive design with touch-friendly UI and hamburger menu
- **Game Descriptions**: Each game includes title, description, and category tags
- **Settings Panel**: About:blank cloaking, UI version switcher (Old/0.2/0.5/0.75), menu music toggle, FPS counter, WebGL switch, mobile UI toggle, version info display
- **Update Log**: Popup showing version info, new features, and game list - appears on first visit or after updates with "don't show again" option
- **UI Versions**: Old (red retro), 0.2 (cyan minimal), 0.5 (indigo), 0.75 (violet modern)

## Project Structure
```
/
├── index.html              # Main homepage
├── main.css                # Modern responsive styles
├── script.js               # Search, play tracking, settings, mobile detection
├── server.js               # Express server on port 5000
├── about.html              # About & Credits page
├── audio/                  # Audio files (menu music)
├── images/                 # Game thumbnails and logo
└── games/                  # Local game files (CDN games hosted on GitHub Pages)
    ├── cuphead/
    ├── moto-x3m/
    ├── motox3m2/
    ├── tomb-of-the-mask/
    ├── space-waves/
    ├── fnf-sonic-exe/
    ├── pokemon-red/
    ├── minecraft-1-8-8/
    ├── minecraft-1-12-2/
    ├── minecraft-1-21-4/
    ├── 1v1lol/
    ├── 2048/
    ├── vex7/
    ├── sonic-r/
    ├── sonic-colors/
    └── sonic-classic-collection/
    # CDN games (GitHub Pages): bob-the-robber-2, drive-mad, retro-bowl, slope, vex3-6
```

## Running the Project
- Development: Uses Express server on port 5000
- Command: `node server.js`

## Deployment
Configured as autoscale deployment running `node server.js`.

## Experimental Channel Features
When users switch to the Experimental channel in Settings, they unlock:
- **Random Game Button**: "I'm Feeling Lucky" picks a random game
- **Category Filter**: Filter games by category (Racing, Puzzle, Platformer, etc.)
- **Game Timer**: Tracks playtime per game, displayed during play and in profile
- **Badge System**: 6 Regular badges, Ultimate badge (1+ hour on all games), Grand Champion (admin-awarded)
- **User Profiles**: View badges, stats, avatar, and playtime
- **Game Comments**: Users can leave comments on games (local storage)
- **Feedback System**: Send feedback/bug reports via Discord webhook with rate limiting
- **macOS Theme**: Additional UI theme option (1.0 Exp) with macOS-style aesthetic

## Recent Changes
- January 20, 2026: Added Ultraviolet Proxy
  - Integrated CustomFrogie proxy (based on Ultraviolet)
  - Proxy accessible from navigation bar or /proxy route
  - Clean custom UI matching Shindo's Hub design
  - Bare server integration for proxying web requests

- January 17, 2026: Added Tic Tac Toe game
  - New game from GitHub CDN repository
  - Game count now 25+

- January 17, 2026: Experimental channel features
  - Added channel switcher (Stable/Experimental) in settings
  - Random game button and category filter for experimental users
  - Game timer system tracking playtime per game
  - Badge/achievement system with 6 Regular + Ultimate + Grand Champion badges
  - Profile modal showing badges, stats, playtime
  - Game comments system (local storage)
  - Feedback system with Discord webhook integration
  - macOS-style experimental UI theme
  - Server-side feedback endpoint with rate limiting and input sanitization

- January 17, 2026: Size optimization
  - Migrated 8 games to GitHub Pages CDN (bob-the-robber-2, drive-mad, retro-bowl, slope, vex3-6)
  - CDN URL: https://shindo957-official.github.io/ShindoHub/games/
  - Converted images to WebP format (5.3MB → 1.2MB)
  - Compressed menu music (4.7MB → 1.9MB)
  - Removed unused dependencies
  - Total project size reduced from 447MB to 168MB

- January 17, 2026: Major feature update
  - Added loading screen with animated progress bar and "Made by Shindo Productions" credit
  - Games now open in a modal with fullscreen button
  - Added 5-star game rating system (requires login)
  - Added user profile avatars (click to choose from game thumbnails)
  - Added UI version 0.75 with violet/purple modern styling
  - Made all UI versions (Old/0.2/0.5/0.75) functional with distinct themes
  - Admin controls: reset play counts, view/delete users
  - Account system with login/register functionality
  - Fixed password fields with proper form elements

## User Preferences
- Dark theme (deep navy/purple tones)
- Games organized in grid layout
- Touch-friendly on mobile devices
- Play count tracking for popularity

## Tech Stack
- HTML5/CSS3/JavaScript (Vanilla)
- Express.js server
- localStorage for play tracking
