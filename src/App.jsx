import { useEffect, useState } from 'react';
import randomizeArray from '@chriscodesthings/randomize-array';

export default function App() {
    const [characters, setCharacters] = useState([]);
    const [currentScore, setCurrentScore] = useState(0);
    const [bestScore, setBestScore] = useState(0)
    const [menuDisplay, setMenuDisplay] = useState(true);

    function handleClick(id) {
        let updatedCharacterClickCount = characters.map((character) => {
            if (character.id === id) {
                return { ...character, clickCount: character.clickCount + 1 };
            }
            return character;
        });

        const cardWasClickedTwice = updatedCharacterClickCount.find(character => character.clickCount === 2) ? true : false;
        if (!cardWasClickedTwice) {
            // Update scores
            const nextScore = currentScore + 1;
            setCurrentScore(nextScore);
            if (nextScore > bestScore) {
                setBestScore(nextScore);
            }
        } else {
            // Reset click counts
            updatedCharacterClickCount = characters.map(character => {
                return {...character, clickCount: 0}
            });

            // Reset score
            setCurrentScore(0);
        }
        // Randomize updated click counts
        setCharacters(randomizeArray(updatedCharacterClickCount));
    }

    // Retrieve Rick and Morty API
    useEffect(() => {
        fetch("https://rickandmortyapi.com/api/character")
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
        setMenuDisplay(false)
        
        setCharacters(randomizeArray(
            characters.map((character) => {
                return { ...character, clickCount: 0, id: Math.floor(Math.random() * 9999) };
            })).slice(0, newCardCount)
        )
    }

    if (menuDisplay) {
        return (
            <div className='menu'>
                <div className="logo"></div>
                <div className='difficulty-selection'>
                    <div className='prompt-headline'>Choose Difficulty</div>
                    <div onClick={() => {startGame(10)}} className='difficulty-option'>Easy</div>
                    <div onClick={() => {startGame(15)}} className='difficulty-option'>Medium</div>
                    <div onClick={() => {startGame(20)}} className='difficulty-option'>Hard</div>
                </div>
            </div>
        )
    }

    // Render cards
    return (
        <>      
            {cardCount && 
                <>
                    { currentScore === characters.length ? <div className='victory-notification'>You Won</div> : null}
                    <div className='scoreboard'>
                        <div className='current-score'>Current Score: {currentScore}</div>
                        <div className='best-score'>Best Score: {bestScore}</div>
                    </div>
                    <div className="deck">
                        {characters.map((character) => {
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
            }
        </>
    );
}
