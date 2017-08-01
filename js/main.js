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

class Card {
  constructor(card, {rank, cardImage}) {
    this.rank = rank;
    this.cardImage = cardImage;
    this.card = card;
    this.clicked = false;

    this.card.addEventListener('click', this.handleClick.bind(this));
  }

  handleClick(evt) {
    if (this.clicked === false) {
      this.setClicked(true);
      this.flip();
    }
  }

  getRank() {
    return this.rank;
  }

  getClicked() {
    return this.clicked;
  }

  setClicked(value) {
    this.clicked = value;
  }

  flip() {
    animate(this.card, 'flipped', false);
  }
}

class Board {
  constructor(els) {
    this.els = els;
    this.cards = [];
    this.reset = this.reset.bind(this);
  }

  getCards() {
    return this.cards;
  }

  createCard(card, i) {
      return pipe(
        appendNode('div',{'class': 'container'}),
        appendNode('div', { 'class': 'card-body'}),
      )(this.els.board);
  }

  init(cards) {
    this.cards = [];
    let cardBody;
    this.update({attempts:0, correct:0});
    cards.forEach((card, i) => {
      let cardBody = this.createCard(card, i);
      appendNode('img', {
        'class': 'front card',
        'src': 'images/back.png',
        'data-id': i,
      })(cardBody);

      appendNode('img', {
        'class': 'back',
        'data-rank': card.rank,
        'src': card.cardImage,
      })(cardBody);

      this.cards.push(new Card(cardBody, card));
    });
    animate(this.els.board, 'flash');
  }

  update(guesses) {
    this.els.score.innerHTML = `
      <span>Attempts: ${guesses.attempts}</span>
      <span>Wins: ${guesses.correct}</span>
    `;
  }

  reset() {
    // implement board reset.
    this.els.board.innerHTML = '';
    this.init(cards);
    this.els.message.textContent = 'Welcome to Memory Game';
  }
}

class Game {
  constructor(board) {
    this.cards = board.cards;
    this.board = board;
    this.guesses = {
      correct: 0,
      incorrect: 0,
      attempts: 0,
    };

    this.board.els.board.addEventListener('click', this.checkForMatch.bind(this));
    this.reset = this.reset.bind(this);
  }

  checkForMatch(evt) {
    console.log('check for match ran!');
    let clickedCards = this.cards.filter(card => card.getClicked());
    if (clickedCards.length !== 2) return;
    if (clickedCards.length === 2) this.guesses.attempts+=1;
    if (clickedCards[0].getRank() === clickedCards[1].getRank()) {
      this.display('you found a match.');
      this.guesses.correct+=1;
      this.update(this.guesses);
      this.reset();
    } else {
      this.guesses.incorrect+=1;
      this.display('sorry, better luck next time');
      this.update(this.guesses);
      this.reset();
    }
  }

  display(msg) {
    this.board.els.message.textContent = msg;
  }

  update() {
    this.board.update(this.guesses);
  }

  reset() {
    setTimeout(() => {
      this.board.reset();
      this.cards = this.board.getCards();
      console.log(this.cards);
    },2000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const els = {
    board: document.getElementById('game-board'),
    message: document.getElementById('message'),
    score: document.getElementById('score'),
  };

  const board = new Board(els);
  board.init(cards);

  const game = new Game(board);
});
