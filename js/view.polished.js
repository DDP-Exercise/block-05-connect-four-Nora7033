"use strict";

let currentPlayer = document.getElementById("currentPlayer")

function renderBoard() {
    let board = document.getElementById("board").innerHTML = "";
    let table = document.createElement("table");
    for (let row = 0; row < 6; row++) {
        let tableRow = document.createElement("tr");
        for (let column = 0; column < 7; column++) {
            let tableData = document.createElement("td");
        }
    }

    document.getElementById("board").appendChild(table);

}
//TODO: Think of this view as your game board.
//      Your view should listen to various custom events of your model.
//      For each event of your model, there should be a clear visual
//      representation of what's going on.

//TODO: Update the field. Show the whole battlefield with all the stones
//      that are already played.

//TODO: Show the current player

//TODO: Notify the player when the game is over. Make it clear how the
//      Game ended. If it's a win, show the winning stones.