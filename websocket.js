import { WebSocketServer } from "ws";
import defualt from "./src/lib/data/default/player.json" assert { type: "json" };

const wss = new WebSocketServer({ port: 8080 });

let data = defualt;

wss.on("connection", (ws) => {
	ws.send(JSON.stringify(data));

	ws.addEventListener("message", (event) => {
		const newData = JSON.parse(event.data);

		console.log("--------------------------");
		console.log(`Recieved new data with type ${newData._type}:`);

		// Check if the received data is different from the current data
		if (JSON.stringify(newData) !== JSON.stringify(data)) {
			data = newData;
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
