import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let data = {
	playerOne: {
		align: "left",
		player: {
			wins: "0",
			name: "Player One",
			pronoun: "",
		},
		decks: {
			corporation: {
				active: true,
				faction: "jinteki",
				id: "419: Amoral Scammer",
			},
			runner: {
				active: false,
				faction: "anarch",
				id: "Asa Group: Security Through Vigilance",
			},
		},
		clicks: {
			active: false,
			amount: 3,
		},
		credits: {
			active: true,
			amount: 5,
		},
		cards: [],
		agendas: {
			active: true,
			amount: 0,
		},
		highlight: {
			code: "21063",
			active: false,
		},
	},
	playerTwo: {
		align: "right",
		player: {
			wins: "0",
			name: "Player Two",
			pronoun: "",
		},
		decks: {
			corporation: {
				active: false,
				faction: "jinteki",
				id: "419: Amoral Scammer",
			},
			runner: {
				active: true,
				faction: "anarch",
				id: "Asa Group: Security Through Vigilance",
			},
		},
		clicks: {
			active: false,
			amount: 4,
		},
		credits: {
			active: true,
			amount: 5,
		},
		cards: [],
		agendas: {
			active: true,
			amount: 0,
		},
		highlight: {
			code: "21063",
			active: false,
		},
	},
};

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
