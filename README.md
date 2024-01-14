# Netrunner stream overlay

## About

Originally built for the [Netrunner East Anglia Champs](https://alwaysberunning.net/tournaments/3848/-east-anglian-champs-) community tournament, the Netrunner Stream Overlay tool was built to service as a simple overlay that can be used locally or remotely.

## Features/improvements

| Feature                                                                                                                                  | Status |
| :--------------------------------------------------------------------------------------------------------------------------------------- | -----: |
| Standard date tracking and display (clicks, credits, agendas, threat level)                                                              |     ✅ |
| Standard player data (name, pronouns, faction/id selection, country)                                                                     |     ✅ |
| Highlight a card for either of the current players (relative to their side of the overlay)                                               |     ✅ |
| Countdown timer                                                                                                                          |     ✅ |
| Ability to pre-define players ID's, so they can be changed when they swap side                                                           |     ✅ |
| Reset game state (default clicks, credits, agendas relative to active corporation/runner side)                                           |     ✅ |
| Threat level tracker relative to matches highest agenda point count                                                                      |     ✅ |
| Dynamic scaling to fit various sizes (1920x1080 recommended)                                                                             |     ✅ |
| Fuzzy search for NetrunnerDB JSON data (allows for human error such as typos or not knowing the full name of a given card)               |     ✅ |
| `localStorage` save state, to ensure persistent data in the case of page refresh or browser closure (will not work if host port changes) |     ✅ |
| Export/import player configuration files (to quickly pre-configure a match ahead of time for quicker setup)                              |     ✅ |
| Flip player data around                                                                                                                  |     ✅ |

| Improvements                                                                                                        | Status |
| :------------------------------------------------------------------------------------------------------------------ | -----: |
| Highlight 2 related cards (i.e. corp ice and runner program) for discussion                                         |     🚧 |
| Improve visual clarity of active/inactive states in dashboard                                                       |     🚧 |
| Refactor CSS to stylesheets to better allow for theming/customisation of code                                       |     🚧 |
| Write tests (cypress, playwright or similar) to ensure builds function and pass as expected before version releases |     🚧 |

If you'd like to request a feature, please make an [issue](https://github.com/AlexRodwell/netrunner-east-anglia-stream-overlay/issues/new) outlining what you'd like to see (examples appreciated).

## Getting started

### Enviroment variables

### Development

1. Install [node.js](https://nodejs.org/en)
2. Download this git repository, either via CLI or Github download (if downloaded as a zip, ensure you extract its contents)
3. Using a CLI, navigate to the downloaded repositry via `cd ./netrunner-stream-overlay`
4. Run `npm i` in CLI to install the required packages/dependancies (npm comes bundled with node.js)
5. Create a `.env` file in the `./dashboard` directory of the project (or rename the `.env.example` to just `.env`), this stores the websocket URL, it is currently set to use a locally host websocket server. However, for production use, you will need to update this to use a live URL/domain
6. Run the websocket server using `npm run websocket`, accessible at [`localhost:8080`](localhost:8080) (the port can be changed in `./websocket.js`)
7. Run the overlay/dashboard using `npm run overlay`, the localhost URL will be logged to console, navigate to that URL in your browser

### Deployment (production)

-   **Static host (overlay and dashboard)**: To setup the overlay and dashboard part of the overlay, you will simply need to run `npm run build`, let SvelteKit generate the files, and then upload the contents of the `./build` directory to your host.
-   **Websocket server**: You will need a node.js host to run the websocket server. Upload/add the `websocket.js` file and have node run said file via `node ./websocket.js`.

### Using the overlay

Inside OBS or a similar broadcast software, simply add a 'browser' source with the URL to one of the pages in the components section below, set it to a width/height of 1920x1080 and you should see it live update as you change values in the dashboard.

#### Components

-   **Combined overlay:** accessible at `/overlay`
-   **Timer:** Accessible at `/overlay/timer`
-   **Player:** For more refined control/placement of the play data
    -   **One:** Accessible at `/overlay/player/one`
    -   **Two:** Accessible at `/overlay/player/two`

## Credits

-   **NetrunnerDB:** Netrunner card data via [API](https://netrunnerdb.com/api/2.0/doc)
-   **Null Signal Games:** Faction and icon graphics, provided as part of their [visual assets pack](https://nullsignal.games/about/nsg-visual-assets/).
-   **Fonts:** Based on [fontsinuse.com's Android: Netrunner font list](https://fontsinuse.com/uses/15378/android-netrunner)
    -   [**Monkirta Pursuit NC by Jayvee Enaguas**](https://www.dafont.com/monkirta-pursuit-nc.font) (Free)
    -   [**Cinzel by Natanael Gama**](https://fonts.google.com/specimen/Cinzel) (Open font license), similar to Trajan (Adobe) used in the Fantasy Flight Games' artwork
-   **Shadcn Svelte** UI components from [Shadcn Svelte](https://www.shadcn-svelte.com/) (an unofficial Svelte port of [shadcn/ui](https://github.com/shadcn/ui))
