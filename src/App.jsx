import { useEffect, useState } from 'react';
import randomizeArray from '@chriscodesthings/randomize-array';

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
            // Reset all cards' click counts
            const updatedCharacters = randomizeArray(
                selectedCharacters.map((character) => {
                    return { ...character, clickCount: 0 };
                })
            );
            setSelectedCharacters(updatedCharacters);

            // Reset current score
            setCurrentScore(0);
        } else {
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

            // Increment current score
            let updatedCurrentScore = currentScore + 1;
            setCurrentScore(updatedCurrentScore);

            // Update best score if beaten
            if (updatedCurrentScore > bestScore) {
                setBestScore(updatedCurrentScore);
            }
        }
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

    // Render cards
    return (
        <>
            {currentScore === selectedCharacters.length ? <div className="victory-notification">You Won</div> : null}
            <div className="scoreboard">
                <div className="current-score">Current Score: {currentScore}</div>
                <div className="best-score">Best Score: {bestScore}</div>
            </div>
            <div className="deck">
                {selectedCharacters.map((character) => {
                    return (
                        <div
                            className="card"
                            key={character.id}
                            onClick={() => {
                                handleClick(character.id);
                            }}
                        >
                            <div className="name">{character.name}</div>
                            <img src={character.image} />
                            {/* <div className='clickCount'>Click Count: {character.clickCount}</div> */}
                        </div>
                    );
                })}
            </div>
        </>
    );
}
