import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let data = {
	title: "hello",
};

let update = false;

wss.on("connection", (ws) => {
	setInterval(() => {
		if (update) {
			ws.send(JSON.stringify(data));
		}
	}, 50);

	ws.addEventListener("message", (event) => {
		update = false;

		if (event.data !== JSON.stringify(data)) {
			console.log(data);
			update = true;
			data = JSON.parse(event.data);
		} else {
			console.log("data is the same, skipping");
		}
	});
});
