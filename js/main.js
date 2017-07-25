var cards = [{
    rank: 'queen',
    suit: 'hearts',
    cardImage: 'images/queen-of-hearts.png'
}, {
    rank: 'queen',
    suit: 'diamonds',
    cardImage: 'images/queen-of-diamonds.png'
}, {
    rank: 'king',
    suit: 'hearts',
    cardImage: 'images/king-of-hearts.png'
}, {
    rank: 'king',
    suit: 'diamonds',
    cardImage: 'images/king-of-diamonds.png'
}];

var cardsInPlay = [];
var gameBoard   = document.getElementById('game-board');
var message     = document.getElementById('message');
var score       = document.getElementById('score');
var tries       = document.getElementById('tries');
score.innerText = 0;
tries.innerText = 0;

var animateBoard = function(isMatch) {

	if(isMatch) {
		message.style.background = '#2ECC40';
		message.innerText = 'Great! You found a match!';

    // reset game-board after 1.5s and udapate score
		setTimeout(function() {
			score.innerText = +score.innerText + 1;
			clearBoard();
		}, 1500);
	} else {
		message.style.background = '#FF4136';
		message.innerText = 'Sorry, try again...';

    // reset game-board after 1.1s
		setTimeout(clearBoard, 1100);
	}

  tries.innerText = +tries.innerText + 1;
}

var checkForMatch = function() {
    var isMatch = (cardsInPlay[0].rank === cardsInPlay[1].rank);
    // display a message whether there is a match or not and update scores
		animateBoard(isMatch);
}

var flipCard = function() {
    // stop multiple clicks on same card.
    if(cardsInPlay[0]) {
        if(this.getAttribute('src') === cardsInPlay[0].cardImage) return;
    }
    var cardId = this.getAttribute('data-id');
    // put clicked card in clicked cards that are in play.
    cardsInPlay.push({ rank: cards[cardId].rank, cardImage: cards[cardId].cardImage });
    // reveal the image of the card when it is clicked.
    this.setAttribute('src', cards[cardId].cardImage);
    // if there are two cards clicked, check if they match
    if(cardsInPlay.length > 1) {
        checkForMatch();
    }
}

var randomize = function(cardPack) {
    let arr = [];

    // Kris Selbekk Apr 5, 2017 - randomize array
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    cardPack.sort(function() { return Math.random() * 2 - 1 });

}

var createBoard = function() {
    randomize(cards);
    // add flash class to flash the game board when it is reset.
    gameBoard.classList.add('flash');
    // create the images and add to teh game board
    for(var i = 0; i < cards.length; i++) {
        var cardElement = document.createElement('img');

        cardElement.setAttribute('src', 'images/back.png');
        cardElement.setAttribute('data-id', i);
        cardElement.setAttribute('class', 'card');

        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    }

    //remove the flash class after 1 second to clean up HTML.
    setTimeout(function() {
        gameBoard.classList.remove('flash');
    }, 3000);
}

var clearBoard = function() {
    // delete all the cards;
    document.getElementById('game-board').innerHTML = '';
    message.innerText = '';
    message.style.background = "inherit";
    //reset cards that have been flipped
    cardsInPlay = [];
    //create new board
    createBoard();
}

var resetButton = document.getElementById('reset');
resetButton.addEventListener('click', function() {
   clearBoard();
});

createBoard();




