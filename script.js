// Get DOM elements
const dinosaur = document.querySelector('.dinosaur');
const obstacle = document.querySelector('.obstacle');
const scoreDisplay = document.getElementById('score');
const characterSelect = document.getElementById('character-select');
const obstacleSelect = document.getElementById('obstacle-select');
const startScreen = document.querySelector('.start-screen');
const selectScreen = document.querySelector('.select-screen');
const gameContainer = document.querySelector('.game-container');
const tryAgainScreen = document.querySelector('.try-again-screen');
const instructions = document.querySelector('.instructions');
const startButton = document.getElementById('start-button');
const playButton = document.getElementById('play-button');
const tryAgainButton = document.getElementById('try-again-button');
const backHomeButton = document.getElementById('back-home-button');
const finalScoreDisplay = document.getElementById('final-score');
const characterPreview = document.getElementById('character-preview');
const obstaclePreview = document.getElementById('obstacle-preview');
const passwordPopup = document.getElementById('passwordPopup');
const passwordInput = document.getElementById('passwordInput');
const submitPassword = document.getElementById('submitPassword');

// Game state variables
let score = 0;
let isJumping = false;
let isGameOver = false;
let isInvincible = false; // Player invincibility flag
let obstacleSpeed = 6; // Initial speed of the obstacle

// Character and obstacle images
const characters = {
    dino: 'https://img.icons8.com/ios/452/dinosaur.png',
    cat: 'https://img.icons8.com/ios/452/cat.png',
    bird: 'https://img.icons8.com/ios/452/bird.png'
};

const obstacles = {
    cactus: 'https://img.icons8.com/ios/452/cactus.png',
    rock: 'https://img.icons8.com/ios/452/rock.png',
    tree: 'https://www.clker.com/cliparts/3/W/e/d/M/L/black-and-white-tree.svg'
};

// Show password input when the invisible button is clicked
document.querySelector('.invisible-button').addEventListener('click', () => {
    passwordPopup.style.display = passwordPopup.style.display === 'block' ? 'none' : 'block';
});

// Submit password
submitPassword.addEventListener('click', () => {
    const password = passwordInput.value;
    if (password === 'YouFoundTheMystery') {
        passwordPopup.style.display = 'none';
        isInvincible = true; // Set invincibility
        alert('You are now unstoppable!');
    } else {
        alert('Incorrect password. Please try again.');
    }
});

// Start the game
startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    selectScreen.style.display = 'flex'; // Show selection screen
});

// Play the game
playButton.addEventListener('click', () => {
    selectScreen.style.display = 'none'; // Hide selection screen
    gameContainer.style.display = 'block'; // Show game container
    instructions.style.display = 'block'; // Show instructions
    resetGame(); // Reset game state
});

// Update character based on selection
function updateCharacter() {
    const selectedCharacter = characterSelect.value;
    dinosaur.style.backgroundImage = `url(${characters[selectedCharacter]})`;
    characterPreview.src = characters[selectedCharacter]; // Update character preview
}

// Update obstacle based on selection
function updateObstacle() {
    const selectedObstacle = obstacleSelect.value;
    obstacle.style.backgroundImage = `url(${obstacles[selectedObstacle]})`;
    obstaclePreview.src = obstacles[selectedObstacle]; // Update obstacle preview
}

// Reset game state
function resetGame() {
    score = 0; // Reset score
    scoreDisplay.textContent = score; // Update score display
    isJumping = false; // Reset jump state
    isGameOver = false; // Reset game over state
    obstacleSpeed = 6; // Reset obstacle speed

    // Reset dinosaur position (ensure this matches your CSS setup)
    dinosaur.style.bottom = '20px'; // Adjust according to your layout
    obstacle.style.right = '-60px'; // Reset obstacle position

    updateCharacter(); // Update character
    updateObstacle(); // Update obstacle
    updateObstaclePosition(); // Start obstacle movement
}

// Jump function
function jump() {
    if (isJumping || isGameOver) return;
    isJumping = true;
    dinosaur.classList.add('jump');

    setTimeout(() => {
        dinosaur.classList.remove('jump');
        isJumping = false;
    }, 500);
}

// Collision detection
function checkCollision() {
    const dinosaurRect = dinosaur.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    if (
        dinosaurRect.x < obstacleRect.x + obstacleRect.width &&
        dinosaurRect.x + dinosaurRect.width > obstacleRect.x &&
        dinosaurRect.y < obstacleRect.y + obstacleRect.height &&
        dinosaurRect.y + dinosaurRect.height > obstacleRect.y
    ) {
        if (!isInvincible) {
            endGame();
        }
    }
}

// End game function
function endGame() {
    isGameOver = true;
    finalScoreDisplay.textContent = score; // Show final score
    gameContainer.style.display = 'none'; // Hide game container
    tryAgainScreen.style.display = 'flex'; // Show try again screen
}

// Move obstacle and update score
function updateObstaclePosition() {
    if (isGameOver) return;

    let obstaclePosition = parseInt(window.getComputedStyle(obstacle).getPropertyValue('right'));
    obstacle.style.right = obstaclePosition + obstacleSpeed + 'px';

    // Increase speed based on score
    if (score > 0 && score % 10 === 0) {
        obstacleSpeed += 1; // Increase speed every 10 points
    }

    if (obstaclePosition > 600) {
        obstacle.style.right = '-60px';
        score++;
        updateScoreDisplay();
    }

    checkCollision();
    requestAnimationFrame(updateObstaclePosition);
}

// Update score display to show 100 when reached
function updateScoreDisplay() {
    scoreDisplay.textContent = score;
    if (score >= 100) { // Change the score threshold to 100
        gameContainer.style.display = 'none';
        congratsPage.style.display = 'block'; // Show congrats page at 100 points
    }
}

// Event listeners for jump and selections
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        jump();
    }
});

document.addEventListener('click', jump);
characterSelect.addEventListener('change', updateCharacter);
obstacleSelect.addEventListener('change', updateObstacle);

// Try Again button functionality
tryAgainButton.addEventListener('click', () => {
    tryAgainScreen.style.display = 'none'; // Hide try again screen
    gameContainer.style.display = 'block'; // Show game container again
    resetGame(); // Reset game state but keep character selection
});

// Back to Home button functionality
backHomeButton.addEventListener('click', () => {
    tryAgainScreen.style.display = 'none'; // Hide try again screen
    startScreen.style.display = 'flex'; // Show start screen
    resetGame(); // Reset game state
});