class Board {
    constructor() {
        this.board = document.querySelector('.grid');
        this.scoreboard = document.querySelector('.scoreboard');
        this.turn = 'X';
        this.squares = document.querySelectorAll('.square');
        this.squares.forEach((square, index) => {
            square.dataset.position = index;
            square.addEventListener('click', this.playTurn.bind(this))
        });
        this.plays = new Array(9);
        this.playerScores = [0, 0];
        this.plays.fill(null);
        this.active = true;
        this.playBtn = document.getElementById('play-again');
        this.playBtn.disabled = true;
        this.playBtn.addEventListener('click', this.playAgain.bind(this));
        this.status = document.querySelector('.status');
    }

    playTurn(event) {
        if(!this.active) {
            return;
        }
        const square = event.target;
        const position = square.dataset.position;
        if(this.plays[position] !== null) {
            return;
        }
        if(this.turn === 'X') {
            square.innerHTML = 'X';
        } else {
            square.innerHTML = 'O';
        }
        this.plays[position] = square.innerHTML;
        const gameOver = this.checkWin(position);
        if(!gameOver) {
            this.setTurn(this.turn === 'X' ? 'O' : 'X')
        }
    }

    setTurn(letter) {
        this.turn = letter;
        const [player1, player2] = document.querySelectorAll('#player1, #player2');
        if(letter === 'X') {
            player1.classList.add('selected1');
            player2.classList.remove('selected2');
        } else {
            player2.classList.add('selected2');
            player1.classList.remove('selected1');
        }
    }

    checkWin(position) {
        let wins = [
            // across
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            // down
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            // diag
            [0, 4, 8],
            [2, 4, 6]
        ]

        const playDidWin = (position) => {
            const allThreeMatch = (i) => (this.plays[wins[i][0]] === this.turn
                && this.plays[wins[i][1]] === this.turn
                && this.plays[wins[i][2]] === this.turn)

            position = parseInt(position);
            for(let i = 0; i < wins.length; i++) {
                if(wins[i].includes(position)) {
                    if(allThreeMatch(i)) {
                        return true;
                    }
                }
            }
            return false;
        }

        if(playDidWin(position)) {
            this.declareWinner(this.turn, `${this.turn} won!`);
            return true;
        } else if(this.plays.filter(play => play !== null).length === 9) {
            this.declareDraw('The game is a draw');
            return true;
        }
        return false;
    }

    declareWinner(turn, message) {
        this.active = false;
        const [score1, score2] = document.querySelectorAll('#score1, #score2');
        const score = turn === 'X' ? score1 : score2;
        const player = turn === 'X' ? 0 : 1;
        this.playerScores[player] += 1;
        score.innerHTML = this.playerScores[player];
        this.displayStatus(message);
    }

    declareDraw(message) {
        this.active = false;
        this.displayStatus(message);
    }

    displayStatus(message) {
        this.status.style.display = 'block';
        this.status.firstElementChild.innerHTML = message;
        this.playBtn.disabled = false;
    }

    playAgain() {
        this.plays = new Array(9);
        this.plays.fill(null);
        this.squares.forEach(square => square.innerHTML = '');
        this.active = true;
        this.playBtn.disabled = true;
        this.status.style.display = 'none';
    }
}

(function() {
    new Board();
})();