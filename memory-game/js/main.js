var cards = [{
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

var cardsInPlay = [];
var gameBoard   = document.getElementById('game-board');
var message     = document.getElementById('message');
var score       = document.getElementById('score');
score.innerText = 0;


var checkForMatch = function() {
    if (cardsInPlay[0].rank === cardsInPlay[1].rank) {
        message.style.background = "#2ECC40";
        message.innerText = "Great! You found a match!";
        
        setTimeout(function() {
            score.innerText = parseInt(score.innerText) + 1;
            clearBoard();
        }, 1500);
    } else {
        message.style.background = "#FF4136";
        message.innerText = "Sorry, try again...";
        
        setTimeout(function() {
            clearBoard();
        }, 1100);
    }   
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
    }, 1000);
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




