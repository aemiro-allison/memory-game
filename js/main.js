const cards = [{
    rank: "queen",
    suit: "hearts",
    cardImage: "images/queen-of-hearts.png"
}, {
    rank: "queen",
    suit: "diamonds",
    cardImage: "images/queen-of-diamonds.png"
}, {
    rank: "king",
    suit: "hearts",
    cardImage: "images/king-of-hearts.png"
}, {
    rank: "king",
    suit: "diamonds",
    cardImage: "images/king-of-diamonds.png"
}];

document.addEventListener('DOMContentLoaded', () => {
	let memoryGame = new cardGame(
		document.getElementById('game-board'),
		document.getElementById('message'),
		cards,
	);

	memoryGame.start();
});

class cardGame {
	constructor($board, $message, cards) {
		this.state = {
			gameBoard: $board,
			message: $message,
			score: document.getElementById('score'),
			cards,
			game: '',
			cardsInPlay: [],
			guesses: {
				attempts: 0,
				correct: 0,
				incorrect: 0,
			},
		};

		this.cardHandler = this.cardHandler.bind(this);
		this.reset = this.reset.bind(this);
		this.animate = this.animate.bind(this);
		this.display = this.display.bind(this);
		this.create = this.create.bind(this);
	}

	//fill board with cards
	start() {
		this.animate('flash');
		this.randomize(this.state.cards);
		this.create(this.state.cards);
	}

	create(cards) {
		cards.map((card, i) => {
			let cardElement = document.createElement('img');
			cardElement.setAttribute('src', 'images/back.png');
      cardElement.setAttribute('data-id', i);
      cardElement.setAttribute('class', 'card');
      cardElement.setAttribute('data-clicked', 0);

			cardElement.addEventListener('click', this.cardHandler);
			this.state.gameBoard.appendChild(cardElement);
		});
	}

	update(cardId, card) {
		if (this.state.cardsInPlay.length === 1 && this.isMatch(card)) {

			this.display('You have won');
			this.state.guesses.attempts+=1;
			this.state.guesses.correct+=1;
			let { incorrect, correct, attempts } = this.state.guesses;
			this.state.score.innerText = `$Attempts: ${attempts}		||		Wins: ${correct}		||		Fails: ${incorrect}`;
			setTimeout(this.reset, 2000);
		} else if (this.state.cardsInPlay.length === 1) {

			this.display('You lost');
			this.state.guesses.attempts+=1;
			this.state.guesses.incorrect+=1;
			let { incorrect, correct, attempts } = this.state.guesses;
			this.state.score.innerText = `$Attempts: ${attempts}		||		Wins: ${correct}		||		Fails: ${incorrect}`;
			setTimeout(this.reset, 2000);
		} else {
			// put clicked card in clicked cards that are in play.
			this.state.cardsInPlay.push({
				rank: cards[cardId].rank,
				cardImage: this.state.cards[cardId].cardImage,
			});
		}
	}

	end() {
		this.state.gameBoard.innerHTML = '';
    this.state.cardsInPlay = [];
    this.state.message.innerText = '';
	}

	reset() {
		this.end();
		this.start();
	}

	animate(className) {
		this.state.gameBoard.classList.add(className);
		setTimeout(() => this.state.gameBoard.classList.remove(className), 1500);
	}

	display(msg) {
		this.state.message.innerText = msg;
	}
  // check if there is match
	isMatch(card) {
		return this.state.cardsInPlay[0].rank === card.rank;
	}

	// Kris Selbekk Apr 5, 2017 - randomize array
  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	randomize(cards) {
    cards.sort(function() { return Math.random() * 2 - 1 });
	}

	cardHandler(evt) {
		const cardId = evt.target.getAttribute('data-id');
		const isFlipped = !!Number(evt.target.getAttribute('data-clicked'));
		if (!isFlipped) {
			// reveal the image of the card when it is clicked.
			evt.target.setAttribute('src', cards[cardId].cardImage);
			evt.target.setAttribute('data-clicked', 1);
			this.update(cardId, this.state.cards[cardId]);
		}
	}

}
