const gridContainer = document.querySelector(".grid-container");
const scoreDisplay = document.querySelector(".score");
const restartBtn = document.querySelector("#restart");

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;

fetch("./data/cards.json")
    .then(res => res.json())
    .then(data => {
        cards = [...data, ...data];
        shuffleCards();
        generateCards();
    });

function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
}

function generateCards() {
    gridContainer.innerHTML = "";

    cards.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.dataset.name = card.name;

        cardElement.innerHTML = `
            <div class="front">
                <img src="${card.image}" />
            </div>
            <div class="back"></div>
        `;

        cardElement.addEventListener("click", flipCard);
        gridContainer.appendChild(cardElement);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;
    score++;
    scoreDisplay.textContent = score;

    checkForMatch();
}

function checkForMatch() {
    const isMatch =
        firstCard.dataset.name === secondCard.dataset.name;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
    }, 1000);
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

restartBtn.addEventListener("click", () => {
    score = 0;
    scoreDisplay.textContent = score;
    resetBoard();
    shuffleCards();
    generateCards();
});
