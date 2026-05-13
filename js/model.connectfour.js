"use strict";

//TODO: Think of this model as the game-logic.
//      The model knows everything that is neccessary to manage
//      the game. It knows the players, know who's turn it is,
//      knows all the stones and where they are, knows if the
//      game is over and if so, why (draw or winner). It knows
//      which stones are the winning stones. The model also has
//      sovereignty over the battlefield.
//      First step: Create your model-object with all the properties
//      necessary to store that information.
export let gameModel = {
    board: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ],
    currentPlayer: 1,
    winner: null,
    gameOver: false,
    winningStones: [],
    stones: [],

    init: function(){
        this.board = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
        ]
        this.currentPlayer = 1;
        this.winner = null;
        this.gameOver = false;
        this.winningStones = [];
    },
    // Logic changing players
    changePlayer: function(){
        if (this.currentPlayer === 1) {
            this.currentPlayer = 2;
            this.dispatchPlayerChangeEvent();
        }
        else
            {this.currentPlayer = 1;
                this.dispatchPlayerChangeEvent();
        }
    },
    dispatchPlayerChangeEvent: function() {
        let changePlayerEvent = new CustomEvent("model:changePlayerEvent", {
            detail: {
                currentPlayer: this.currentPlayer
            }
        })
        document.dispatchEvent(changePlayerEvent)
    },

    // inserting stones Logic
    insertStone: function(column){
        let row = null;
        if (this.gameOver === true) {
            return;
        }
        else {
        for (let i = 5; i >= 0; i--) {
            if (this.board [i][column] === 0) {
                this.board[i][column] = this.currentPlayer;
                row = i;
                this.dispatchStoneInsertedEvent(row, column);
                break;
            }
        }
        if (row === null) {
            return;
        }
        }
        this.checkWin(row, column);
        this.checkDraw()
        if (this.gameOver === false) {
            this.changePlayer();
        }
        if (row === null) {
            alert("Diese Spalte ist voll! Wähle eine andere.");
            return;
        }
    },
    dispatchStoneInsertedEvent: function(row, column) {
        let stoneInsertedEvent = new CustomEvent("model:stoneInsertedEvent", {
            detail: {
                currentPlayer: this.currentPlayer,
                row: row,
                column: column,
            }
        })
            document.dispatchEvent(stoneInsertedEvent)
    },

    // winning and game over Logic
    checkWin: function(row, column) {
        let sameStones = 1;
        let cnt = 1;
        this.stones = [[row, column]];

        // horizontally checking
        while ( column - cnt >= 0 && this.board[row][column-cnt]===this.currentPlayer) {
            sameStones++;
            this.stones.push([row, column-cnt]);
            cnt++;
        }
        cnt = 1;
        while (column + cnt <= 6 && this.board[row][column+cnt]===this.currentPlayer) {
            sameStones++;
            this.stones.push([row, column+cnt]);
            cnt++;
        }
        this.checkSameStones(sameStones);

        // vertically checking
        sameStones = 1;
        cnt = 1;
        this.stones = [[row, column]];
        while (row + cnt <= 5 && this.board[row + cnt][column]===this.currentPlayer) {
            sameStones++;
            this.stones.push([row+cnt, column]);
            cnt++;
        }
        this.checkSameStones(sameStones);

        // antidiagonally checking
        sameStones = 1;
        cnt = 1;
        this.stones = [[row, column]];
        while (row + cnt <= 5 && column - cnt >= 0 && this.board[row + cnt][column - cnt]===this.currentPlayer) {
            sameStones++;
            this.stones.push([row+cnt, column-cnt]);
            cnt++;
        }
        cnt = 1;
        while (row - cnt >= 0 && column + cnt <= 6 && this.board[row - cnt][column + cnt]===this.currentPlayer) {
            sameStones++;
            this.stones.push([row-cnt, column+cnt]);
            cnt++;
        }
        this.checkSameStones(sameStones);

        // diagonally checking
        sameStones = 1;
        cnt = 1;
        this.stones = [[row, column]];
        while (row + cnt <= 5 && column + cnt <= 6 && this.board[row + cnt][column + cnt]===this.currentPlayer) {
            sameStones++;
            this.stones.push([row+cnt, column+cnt]);
            cnt++;
        }
        cnt = 1;
        while (row - cnt >= 0 && column - cnt >= 0 && this.board[row - cnt][column - cnt]===this.currentPlayer) {
            sameStones++;
            this.stones.push([row-cnt, column-cnt]);
            cnt++;
        }
        this.checkSameStones(sameStones);
    },
    checkSameStones: function(sameStones) {
        if (sameStones >= 4) {
            this.winner = this.currentPlayer;
            this.gameOver = true;
            this.winningStones = this.stones;
            this.dispatchGameOverEvent();
        }
    },
    checkDraw: function(board) {
        if (this.gameOver === true) {
            return;
        }
            for (let row = 0; row < 6; row++) {
                for (let column = 0; column < 7; column++) {
                    if (this.board[row][column] === 0) {
                        return;
                    }
                }
            }
        this.gameOver = true;
        this.winner = null;
        this.dispatchGameOverEvent();
    },
    dispatchGameOverEvent: function() {
        let gameOverEvent = new CustomEvent("model:gameOverEvent", {
            detail: {
                winner: this.winner,
                winningStones: this.winningStones,

            }
        })
            document.dispatchEvent(gameOverEvent)
    }
}
//TODO: Prepare some customEvents. The model should dispatch events when
//      - The Player Changes
//      - A stone was inserted
//      - The Game is over (Draw or Winner)
//      Don't forget to give your events a namespace.
//      For each customEvent, just make a >method< for your model-object,
//      that, when called, dispatches the event. Nothing else should
//      happen in those methods.


//TODO: Initiate the battlefield. Your model needs a representation of the
//      battlefield as data (two-dimensional array). Obviously, there are
//      no stones yet in the field.

//TODO: The model should offer a method to insert a stone at a given column.
//      If the stone can be inserted, the model should insert the stone,
//      dispatch an event to let the world know that the battlefield has changed
//      and check if the game is over now.
//      Hint: This method will be called later by your controller, when the
//      user makes an according input.

//TODO: Methods to check if the game is over, either by draw or a win.
//      Let the world know in both cases what happend. If it's a win,
//      Don't forget to store the winning stones and add this >detail<
//      to your custom event.

//TODO: Method to change the current player (and dispatch the according event).