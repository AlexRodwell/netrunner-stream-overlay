import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let data = {
	playerOne: {
		player: {
			wins: 0,
			name: "Player",
			pronoun: "",
			country: null,
		},
		decks: {
			corp: {
				active: true,
				faction: "jinteki",
				id: "A Teia: IP Recovery",
			},
			runner: {
				active: false,
				faction: "anarch",
				id: "419: Amoral Scammer",
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
		agendas: {
			active: true,
			amount: 0,
		},
		highlight: {
			current: "21063",
			previous: null,
			active: false,
			test: [],
		},
		cards: [],
	},
	playerTwo: {
		player: {
			wins: 0,
			name: "Player",
			pronoun: "",
			country: null,
		},
		decks: {
			corp: {
				active: false,
				faction: "jinteki",
				id: "A Teia: IP Recovery",
			},
			runner: {
				active: true,
				faction: "anarch",
				id: "419: Amoral Scammer",
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
		agendas: {
			active: true,
			amount: 0,
		},
		highlight: {
			current: "21063",
			previous: null,
			active: false,
			test: [],
		},
		cards: [],
	},
};

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
