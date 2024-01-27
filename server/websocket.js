import { WebSocketServer } from "ws";
import PLACEHOLDER_DATA from "../dashboard/src/lib/data/default/player.json";

const wss = new WebSocketServer({ port: 8080 });

let data = PLACEHOLDER_DATA;

wss.on("connection", (ws) => {
	ws.send(JSON.stringify(data));

	ws.addEventListener("message", (event) => {
		const recieved_data = JSON.parse(event.data);

		// Check if the received data is different from the current data
		if (JSON.stringify(recieved_data) !== JSON.stringify(data)) {
			data = recieved_data;
			console.log(data);

			// Send updated data to all connected clients
			wss.clients.forEach((client) => {
				client.send(JSON.stringify(data));
			});
		} else {
			console.log("Data is the same, skipping");
		}
	});
});
