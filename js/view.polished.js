"use strict";
import {gameModel} from "./model.connectfour.js";

let currentPlayer = document.getElementById("currentPlayer")

renderBoard();
renderPlayer();

function renderBoard() {
    let board = document.getElementById("board");
    board.innerHTML = "";
    let table = document.createElement("table");
    for (let row = 0; row < 6; row++) {
        let tableRow = document.createElement("tr");
        table.appendChild(tableRow);
        for (let column = 0; column < 7; column++) {
            let tableData = document.createElement("td");
            tableRow.appendChild(tableData);
            tableData.textContent = gameModel.board[row][column];
            tableData.addEventListener("click", function () {
                gameModel.insertStone(column)
            })
            let stoneVarible = gameModel.board[row][column];
            if (stoneVarible === 1) {
                tableData.classList.add("avengers")
            }
            else if (stoneVarible === 2) {
                tableData.classList.add("thanos")
            }
            else
                tableData.classList.add("empty");
        }
    }
    board.appendChild(table);
}
document.addEventListener("model:stoneInsertedEvent", renderBoard);
document.addEventListener("model:changePlayerEvent", renderPlayer);

function renderPlayer() {
    const avengers = document.getElementById("avengersSide");
    const thanos = document.getElementById("thanosSide");
    const display = document.getElementById("currentPlayer");

    if (gameModel.currentPlayer === 1) {
        display.textContent = "Avengers am Zug (Space Stone)";
        avengers.classList.add("active-player");
        thanos.classList.remove("active-player");
    } else {
        display.textContent = "Thanos am Zug (Power Stone)";
        thanos.classList.add("active-player");
        avengers.classList.remove("active-player");
    }
}
document.addEventListener("model:gameOverEvent", function(e) {
    const statusDisplay = document.getElementById("game-over");
    const { winner, winningStones } = e.detail;

    if (winner) {
        statusDisplay.textContent = winner === 1 ? "AVENGERS ASSEMBLED!" : "THANOS SNAPPED!";

        const table = document.querySelector("table");
        winningStones.forEach(([row, col]) => {
            table.rows[row].cells[col].classList.add("winning-stone");
        });
    } else {
        statusDisplay.textContent = "Unentschieden. Die nächste Schlacht wird entscheiden.";
    }
});
