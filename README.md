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
| Highlight 2 related cards (i.e. corp ice and runner program)                                                                             |     ✅ |

| Improvements                                                                                                        | Status |
| :------------------------------------------------------------------------------------------------------------------ | -----: |
| Refactor CSS to stylesheets and/or predefined themes to allow for better customisation/layout                       |     🚧 |
| Write tests (cypress, playwright or similar) to ensure builds function and pass as expected before version releases |     🚧 |
| OBS Demo file (with all standard pages for each part of the overlay)                                                |     🚧 |

If you'd like to request a feature, please make an [issue](https://github.com/AlexRodwell/netrunner-east-anglia-stream-overlay/issues/new) outlining what you'd like to see (examples appreciated).

## Getting started

### Enviroment variables

### Development

1. Install [node.js](https://nodejs.org/en)
2. Download this git repository, either via [CLI](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository) or Github download (if downloaded as a zip, ensure you extract its contents)
3. Using a CLI, navigate to the downloaded repositry via `cd ./netrunner-stream-overlay`
4. Run `npm i` in CLI to install the required packages/dependancies (npm is bundled with node.js, which will work, despite the project using [pnpm](https://pnpm.io/))
5. Create a `.env` file in the `./dashboard` directory of the project (or rename the `.env.example` to just `.env`), this stores the websocket URL/state.
6. Run the overlay/dashboard by navigation to `./dashboard` and running `npm run overlay`, the local webserver URL will be logged to console, navigate to that URL in your browser

### Deployment (production)

-   **Static host (overlay and dashboard)**: To setup the overlay and dashboard part of the overlay, you will simply need to run `npm run build`, let SvelteKit generate the files, and then upload the contents of the `./build` directory to your host of choice.
-   **Websocket server**: You will need a node.js host to run the websocket server. Upload/add the `websocket.js` file and have node run said file via `node ./websocket.js`. You will need to change `PUBLIC_WEBSOCKET_URL` to the URL of your hosted websocket, and `PUBLIC_WEBSOCKET_CONNECTION` to `TRUE` to utilise this functionality.

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
