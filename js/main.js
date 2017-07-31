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
	let memoryGame = new cardGame(cards, {
    board: document.getElementById('game-board'),
    message: document.getElementById('message'),
    score: document.getElementById('score'),
  });

	memoryGame.start();
});

class cardGame {
	constructor(cards, $els) {
		this.state = {
			gameBoard: $els.board,
			message: $els.message,
			score: $els.score,
			cards,
			isGameOver: false,
			cardsInPlay: [],
			guesses: {
				attempts: 0,
				correct: 0,
				incorrect: 0,
			},
		};

		this.cardHandler = this.cardHandler.bind(this);
    this.reset = this.reset.bind(this);
	}

	// fill board with cards
	start() {
    this.animate(this.state.gameBoard, 'flash');
		this.randomize(this.state.cards);
		this.create(this.state.cards);
    this.updateScore(this.state.guesses);
	}

	create(cards) {
		cards.map((card, i) => {
      let cardElementFront = document.createElement('img');
			let cardElementBack = document.createElement('img');

			cardElementFront.setAttribute('src', 'images/back.png');
      cardElementFront.setAttribute('data-id', i);
      cardElementFront.setAttribute('class', 'front card');
      cardElementFront.setAttribute('data-clicked', 0);

      // reveal the image of the card when it is clicked.
      cardElementBack.setAttribute('src', card.cardImage);
      cardElementBack.setAttribute('class', 'back');

      const docFrag = document.createDocumentFragment();
      docFrag.appendChild(cardElementFront);
      docFrag.appendChild(cardElementBack);

      let cardContainer = document.createElement('div');
      cardContainer.setAttribute('class', 'container');

      let cardBody = document.createElement('div');
      cardBody.setAttribute('class', 'card-body');
      cardBody.addEventListener('click', this.cardHandler);

      cardBody.appendChild(docFrag);
      cardContainer.appendChild(cardBody);
			this.state.gameBoard.appendChild(cardContainer);
		});
	}

  end() {
    this.state.gameBoard.innerHTML = '';
    this.state.cardsInPlay = [];
    this.state.message.style.visibility = 'hidden';
    this.state.message.innerText = 'placeholder';
  }

  reset() {
    this.state.isGameOver = false;
    this.end();
    this.start();
  }

  display(msg) {
    this.state.message.innerText = msg;
    this.state.message.style.visibility = 'visible';
  }

  animate(el, className, toggle = true) {
    el.classList.add(className);
    if(toggle) {
        el.addEventListener('animationend', () => {
        el.classList.remove(className);
        el.removeEventListener('animationend', this.cardHandler);
      });
    }
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

  updateScore(guesses) {
    this.state.score.innerHTML = `
      <span>Attempts: ${guesses.attempts}</span>
      <span>Wins: ${guesses.correct}</span>
    `;
  }

	update(cardId, card) {
		if (this.state.cardsInPlay.length === 1 && this.isMatch(card)) {

			this.display('You have won');
			this.state.guesses.attempts+=1;
			this.state.guesses.correct+=1;
      this.state.isGameOver = true;
      this.updateScore(this.state.guesses);
			setTimeout(this.reset, 2000);
		} else if (this.state.cardsInPlay.length === 1) {

			this.display('You lost');
			this.state.guesses.attempts+=1;
			this.state.guesses.incorrect+=1;
      this.state.isGameOver = true;
      this.updateScore(this.state.guesses);
			setTimeout(this.reset, 2000);
		} else {
			// put clicked card in clicked cards that are in play.
			this.state.cardsInPlay.push({
				rank: cards[cardId].rank,
				cardImage: this.state.cards[cardId].cardImage,
			});
		}
	}

	cardHandler(evt) {
    if (evt.target.getAttribute('class') === 'back') {
      const cardId = evt.target.previousSibling.getAttribute('data-id');
      const isFlipped = !!Number(evt.target.previousSibling.getAttribute('data-clicked'));
      if (!isFlipped && !this.state.isGameOver) {
        evt.target.previousSibling.setAttribute('data-clicked', 1);
        this.update(cardId, this.state.cards[cardId]);
        this.animate(evt.target.previousSibling.parentNode, 'flipped', false);
      }
    } else {
      const cardId = evt.target.getAttribute('data-id');
      const isFlipped = !!Number(evt.target.getAttribute('data-clicked'));
      if (!isFlipped && !this.state.isGameOver) {
        evt.target.setAttribute('data-clicked', 1);
        this.update(cardId, this.state.cards[cardId]);
        this.animate(evt.target.parentNode, 'flipped', false);
      }
      }
	}
}
