// import { PUBLIC_WEBSOCKET } from "$env/static/public";

const PUBLIC_WEBSOCKET = "ws://localhost:8080";

// service-worker.js
let socket;

self.addEventListener("install", (event) => {
	// Perform any initial setup if needed
});

self.addEventListener("activate", (event) => {
	// Perform any cleanup or updates if needed
});

self.addEventListener("message", (event) => {
	// Handle messages from the main thread (SvelteKit app)
	const { action } = event.data;

	if (action === "connectWebSocket") {
		connectWebSocket();
	}
});

const connectWebSocket = () => {
	socket = new WebSocket(PUBLIC_WEBSOCKET);

	socket.addEventListener("open", () => {
		postMessage({ status: "connected" }); // Notify the main thread
	});

	socket.addEventListener("close", () => {
		postMessage({ status: "disconnected" }); // Notify the main thread

		// Implement reconnection logic here
		setTimeout(() => {
			connectWebSocket(); // Attempt to reconnect
		}, 2000); // Retry after 2 seconds
	});

	socket.addEventListener("message", (event) => {
		// Handle incoming WebSocket messages here
	});
};
