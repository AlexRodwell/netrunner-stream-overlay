# Netrunner stream overlay

## About

Built for for Netrunner [East Anglia Champs](https://alwaysberunning.net/tournaments/3848/-east-anglian-champs-) community tournament

## Development

### Setup

1. Install required dependancies via `npm i` (or whatever package manager you use)

### Getting started

To get the overlay running, simply start the websocket server and the overlay with the following instructions:

1. Run the websocket server `npm run websocket` (accessible at [`localhost:8080`](localhost:8080))
2. Run the overlay & dashboard server `npm run dev`, access this via localhost URL found in CLI

### Overlay

#### Player (score, wins, agena points, name etc)

Accessible at `/overlay`

### Timer

Accessible at `/overlay/timer`

## Thanks

### NetrunnerDB

Netrunner card data via [API](https://netrunnerdb.com/api/2.0/doc)

### Null Signal Games

Faction and icon graphics, provided as part of their [visual assets pack](https://nullsignal.games/about/nsg-visual-assets/).
