const blackjack = (() => {
  'use strict'
  // Vars
  const BASIC_CARD_TYPES = ['C', 'D', 'H', 'S'],
    SPECIAL_CARD_TYPES = ['A', 'J', 'Q', 'K'];
  let playersPoints = [],
    deck = [],
    turnPlayer = 0;
  // DOM vars
  const divButtons = document.querySelector('#game-buttons'),
    btnNewGame = divButtons.querySelector('#btn-new-game'),
    btnGetCard = divButtons.querySelector('#btn-get-card'),
    btnStop = divButtons.querySelector('#btn-stop'),
    divPlayersCards = document.querySelectorAll('.table-cards'),
    smallPointsPlayer = document.querySelectorAll('.player-points'),
    modalResult = document.querySelector('#msg-modal'),
    modalResultMsgDiv = modalResult.querySelector('#msg-result-round');
  // init
  btnGetCard.disabled = true;
  btnStop.disabled = true;
  // Deck Logic
  const shuffleDeck = (deck = []) => {
    return _.shuffle([...deck]);
  }
  const createDeck = () => {
    for (let n = 2; n <= 10; n++) {
      for (const card_type of BASIC_CARD_TYPES) {
        deck.push({
          name: n + card_type,
          values: [n]
        });
      }
    }
    for (const card_type of BASIC_CARD_TYPES) {
      for (const special_card_type of SPECIAL_CARD_TYPES) {
        deck.push({
          name: special_card_type + card_type,
          values: (special_card_type === 'A') ? [1, 11] : [10]
        });
      }
    }
    return deck;
  }
  const BASE_DECK = createDeck();
  let playDeck = shuffleDeck([...BASE_DECK]);
  const getACard = () => {
    return (playDeck.length) ? playDeck.shift() : null;
  };
  // New Game
  const newGame = (pPlayers = 2) => {
    const qPlayers = (pPlayers < 2) ? 2 : pPlayers;
    playersPoints = [];
    for (let i = 0; i < qPlayers; i++) {
      playersPoints.push(0);
      divPlayersCards[i].innerHTML = '';
      smallPointsPlayer[i].innerText = 0;
    }
    playDeck = shuffleDeck([...BASE_DECK]);
    btnGetCard.disabled = false;
    btnStop.disabled = false;
  };
  // collect points
  const collectPoints = (card, playerNum) => {
    playersPoints[playerNum] = playersPoints[playerNum] + card.values[0];
    smallPointsPlayer[playerNum].innerText = playersPoints[playerNum];
    return playersPoints[playerNum];
  };
  // render card image
  const renderCardImage = (card, playerNum) => {
    let cardImg = document.createElement("img");
    cardImg.classList.add('card-game');
    cardImg.src = `./assets/images/${card.name}.png`;
    divPlayersCards[playerNum].append(cardImg);
  };
  // Dealer turn
  const dealerTurn = (minPoints = 1) => {
    let dealerPoints = 0;
    do {
      let card = getACard();
      dealerPoints = collectPoints(card, (playersPoints.length - 1));
      renderCardImage(card, (playersPoints.length - 1));
    } while ((dealerPoints < minPoints) && (minPoints <= 21));
    winLogic();
  }
  // Win Logic
  const winLogic = () => {
    const [minPoints, dealerPoints] = playersPoints;
    setTimeout(() => {
      let msg = '';
      if (dealerPoints > minPoints && dealerPoints <= 21 || minPoints > 21) {
        msg = 'DEALER WIN'
      } else if (minPoints > dealerPoints && minPoints <= 21 || dealerPoints > 21) {
        msg = 'YOU WIN'
      } else {
        msg = 'DRAW'
      }
      modalResultMsgDiv.innerText = msg;
      $(modalResult).modal('toggle');
    }, 100);
  };
  // Events
  btnGetCard.addEventListener('click', (e) => {
    e.preventDefault();
    const card = getACard();
    const playerPoints = collectPoints(card, turnPlayer);
    renderCardImage(card, turnPlayer);
    if (playerPoints > 21 || playerPoints === 21) {
      btnGetCard.disabled = true;
      btnStop.disabled = true;
      dealerTurn(playerPoints);
    }
  });
  btnStop.addEventListener('click', (e) => {
    e.preventDefault();
    btnGetCard.disabled = true;
    btnStop.disabled = true;
    dealerTurn(playersPoints[turnPlayer]);
  });
  btnNewGame.addEventListener('click', (e) => {
    e.preventDefault();
    newGame();
  });

  return {
    newGame
  };
})();