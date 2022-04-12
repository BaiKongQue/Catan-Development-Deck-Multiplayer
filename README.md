# Catan-Development-Deck-Multiplayer
A web based GUI to pulling and using Catan development cards with your friends

The server currently only supports the base development cards from Catan.

Each player can play with their own device and will see their own cards, and a simplified version of what other players hands are.

# Requirements #
In order to run the server you will need to have the following installed:
<table>
    <tr>
        <td>Node</td>
        <td>latest</td>
        <td><a href="https://nodejs.org/en/">https://nodejs.org/en/</a></td>
    </tr>
</table>

# How to Run the Server #
Run the npm installer to install the dependencies.

```
npm install
```

Then run the server with the following command:

```
node index.js
```

The server will run on port 80, connect to the website on any local device.

# Features #
each user that joins can input their name that will show up on the user list.

a deck that is shared between the players can be pulled from, and the deck size will be visible to all players. If a card was pulled on accident, the player can return it to the deck.

Each player's cards will be shown to give a sense of their hand size. Only activated cards will be shown by color and letter.

A player can view more details of a card by selecting it in their hand. They can activate a development card when they are viewing it. If a accident was made, they can undo the activation.

The deck is randomized at server start, in order to re-randomize the deck you must restart the server.

Usernames are locally stored to the user's device, so the user will not be asked for a name the next time they join the website. If the user needs to change their name there is a button to do so. This means that people can try to take other user's names, but the way the server works it will just overwrite that user's hand with their own.

# Security #
Please keep in mind that the security of this project is fairly low, as this server is made to run locally on a network, and there is no authentication to prove who is what user, meaning users can spoof each other if they wanted.