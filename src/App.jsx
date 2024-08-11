import { useEffect, useState } from 'react';
import randomizeArray from '@chriscodesthings/randomize-array';
import Card from './Card';
import Scoreboard from './Scoreboard';

export default function App() {
    const [characters, setCharacters] = useState([]);
    const [selectedCharacters, setSelectedCharacters] = useState([]);
    const [currentScore, setCurrentScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [menuDisplay, setMenuDisplay] = useState(true);

    function handleClick(characterId) {
        const characterAlreadyClicked = selectedCharacters.find((character) => character.clickCount === 1 && character.id === characterId)
            ? true
            : false;

        if (characterAlreadyClicked) {
            // Reset current score
            setCurrentScore(0);
        } else {
            // Increment current score
            let updatedCurrentScore = currentScore + 1;
            setCurrentScore(updatedCurrentScore);

            // Update best score if beaten
            if (updatedCurrentScore > bestScore) {
                setBestScore(updatedCurrentScore);
            }
        }

        // Increment click count of the clicked card
        const updatedCharacters = randomizeArray(
            selectedCharacters.map((character) => {
                if (character.id === characterId) {
                    return { ...character, clickCount: character.clickCount + 1 };
                }
                return character;
            })
        );
        setSelectedCharacters(updatedCharacters);
    }

    // Retrieve Rick and Morty API
    useEffect(() => {
        fetch('https://rickandmortyapi.com/api/character')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setCharacters(
                    data.results.map((character) => {
                        return { ...character, clickCount: 0, id: Math.floor(Math.random() * 9999) };
                    })
                );
            })
            .catch((error) => {
                console.error('Error: ', error);
            });
    }, []);

    function startGame(newCardCount) {
        // Remove menu once player chose a diffulty level
        setMenuDisplay(false);

        // Choose the chracters that will be used
        setSelectedCharacters(randomizeArray(characters).slice(0, newCardCount));
    }

    function goBackToMenu() {
        // Reset scores when going back to menu
        setBestScore(0);
        setCurrentScore(0);
        setMenuDisplay(true);
    }

    if (menuDisplay) {
        return (
            <div className="menu">
                <div className="logo"></div>
                <div className="difficulty-selection">
                    <div className="prompt-headline">Choose Difficulty</div>
                    <div
                        onClick={() => {
                            startGame(10);
                        }}
                        className="difficulty-option"
                    >
                        Easy
                    </div>
                    <div
                        onClick={() => {
                            document.querySelector('#hitSound').play();
                            startGame(15);
                        }}
                        className="difficulty-option"
                    >
                        Medium
                    </div>
                    <div
                        onClick={() => {
                            startGame(20);
                        }}
                        className="difficulty-option"
                    >
                        Hard
                    </div>
                </div>
            </div>
        );
    }

    // Create a game notification if the player lost or won
    const playerWon = selectedCharacters.every((character) => character.clickCount === 1);
    const playerLost = selectedCharacters.some((character) => character.clickCount === 2);
    const gameIsOver = playerWon || playerLost;
    if (gameIsOver) {
        return (
            <div className="notification-container">
                <div className="notification">
                    <div className="message defeat">{playerWon ? 'You Won!' : 'You Lost'}</div>
                    <div
                        className="action"
                        onClick={() => {
                            startGame(selectedCharacters.length);
                        }}
                    >
                        Play Again
                    </div>
                    <div className="action" onClick={goBackToMenu}>
                        Back to Menu
                    </div>
                </div>
            </div>
        );
    }

    // Render cards
    return (
        <>
            <div onClick={goBackToMenu} className="back-to-menu">
                Memory Game
            </div>
            <div className="play-area">
                <Scoreboard currentScore={currentScore} bestScore={bestScore} />
                <div className="deck">
                    {selectedCharacters.map((character) => {
                        return (
                            <Card
                                name={character.name}
                                key={character.id}
                                imageLink={character.image}
                                onClickFunction={() => {
                                    handleClick(character.id);
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
}
