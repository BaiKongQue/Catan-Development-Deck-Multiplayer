const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

app.use(express.static(__dirname + '/public'));

let cards = [];
let playerHands = {};
// game id is a random string of length 10
let gameId = Math.random().toString(36).substring(2, 12);

let uidCounter = 0;
for(let i = 0; i < 14; i++) {
    cards.push({
        id: uidCounter++,
        card: "knight"
    });
}

for(let i = 0; i < 5; i++) {
    cards.push({
        id: uidCounter++,
        card: "victory point"
    });
}

for(let i = 0; i < 2; i++) {
    cards.push({
        id: uidCounter++,
        card: "year of plenty"
    });
}

for(let i = 0; i < 2; i++) {
    cards.push({
        id: uidCounter++,
        card: "road building"
    });
}

for(let i = 0; i < 2; i++) {
    cards.push({
        id: uidCounter++,
        card: "monopoly"
    });
}


const shuffle = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

shuffle(cards);



io.on("connection", (socket) => {    
    socket.emit("card-count", cards.length);
    socket.emit("game-room", gameId);

    let username = null;
    
    socket.on('join', data => {
        console.log(data.name + " joined");
        username = data.name;
        if (!playerHands[username]) {
            playerHands[username] = [];
        }
        SendHands();
        socket.emit("receive-card", playerHands[username]);
    });

    socket.on('change-name', data => {
        if (!!data.cards) data.cards = JSON.parse(data.cards);
        const newName = data.name;
        playerHands[newName] = playerHands[username];
        delete playerHands[username];
        username = newName;
        SendHands();
    });

    socket.on("get-card", () => {
        if (cards.length <= 0) {
            return;
        }
        
        const card = cards.pop();
        card.used = false;
        playerHands[username].push(card);
        
        const len = cards.length;
        io.emit("card-count", len);
        SendHands();
        socket.emit("receive-card", playerHands[username]);
    });

    socket.on("activate-card", data => {
        // update player hand
        for (let i = 0; i < playerHands[username].length; i++) {
            if (playerHands[username][i].id === data.id) {
                playerHands[username][i].used = data.checked;
                break;
            }
        }
        SendHands();
    });

    socket.on("return-card-to-deck", data => {
        // remove card from player hand and add to deck
        for (let i = 0; i < playerHands[username].length; i++) {
            if (playerHands[username][i].id === data.id) {
                cards.push(playerHands[username][i]);
                playerHands[username].splice(i, 1);
                break;
            }
        }
        SendHands();
        socket.emit("receive-card", playerHands[username]);
        io.emit("card-count", cards.length);
    });
});

httpServer.listen(80, "0.0.0.0");
console.log("Server started on port 80");

function SendHands() {
    let nhands = {};
    for (let u in playerHands) {
        nhands[u] = [];
        for (let c of playerHands[u]) {
            if (c.used) {
                nhands[u].push(c.card);
            } else {
                nhands[u].push("?");
            }
        }
    }
    io.emit('update-hands', nhands);
}