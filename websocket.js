import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let data = {
	Corporation: {
		faction: "Jinteki",
		id: "419: Amoral Scammer",
		clicks: 3,
		credits: 5,
		cards: [],
		highlight: {
			code: "21063",
			active: false,
		},
	},
	Runner: {
		faction: "Anarch",
		id: "Asa Group: Security Through Vigilance",
		clicks: 4,
		credits: 5,
		cards: [],
		highlight: {
			code: "21063",
			active: false,
		},
	},
};

wss.on("connection", (ws) => {
	ws.send(JSON.stringify(data));

	ws.addEventListener("message", (event) => {
		console.clear();
		const newData = JSON.parse(event.data);

		// Check if the received data is different from the current data
		if (JSON.stringify(newData) !== JSON.stringify(data)) {
			data = newData;

			// Send updated data to all connected clients
			wss.clients.forEach((client) => {
				client.send(JSON.stringify(data));
			});

			console.log(data);
		} else {
			console.log("Data is the same, skipping");
		}
	});
});
