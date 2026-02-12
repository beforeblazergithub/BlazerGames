# Blazer - Game Website

## Overview
A static game website ("Doge's Keyboard Collection" remaster) that serves a collection of HTML5 browser games. Built with pure HTML, CSS, and JavaScript - no build system or package manager needed.

## Project Architecture
- `index.html` - Main landing page with game listings
- `main.css` - Global styles
- `script.js` - Client-side JavaScript
- `images/` - Game thumbnails and logo
- `games/` - Individual game directories (each with its own index.html)
- `server.py` - Python static file server for development/production

## Running
The project uses a simple Python HTTP server (`server.py`) bound to `0.0.0.0:5000`.

## Deployment
Static site deployment serving the root directory.
