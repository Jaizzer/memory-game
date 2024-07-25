import { useEffect, useState } from 'react';
import randomizeArray from '@chriscodesthings/randomize-array';

export default function App() {
    const [characters, setCharacters] = useState([]);
    const [currentScore, setCurrentScore] = useState(0);
    const [bestScore, setBestScore] = useState(0)
    const [cardCount, setCardCount] = useState(null);

    function handleClick(id) {
        const updatedCharacterClickCount = characters.map((character) => {
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
            setCharacters(characters.map(character => {
                return {...character, clickCount: 0}
            }));

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
                setCharacters(randomizeArray(
                    data.results.map((character) => {
                        return { ...character, clickCount: 0, id: Math.floor(Math.random() * 9999) };
                    })).slice(0, cardCount)
                );
            })
            .catch((error) => {
                console.error('Error: ', error);
            });
    }, [cardCount]);

    function handleDifficulty(event) {
        const difficulty = event.target.id;
        switch (difficulty) {
            case 'easy':
                setCardCount(10);
                break;
            case 'medium':
                setCardCount(15);
                break;
            case 'hard':
                setCardCount(20);
                break;
            default:
                break;
        }
    }

    // Render cards
    return (
        <>      
            <div className='difficulty-selection'>
                <div className='prompt-headline'>Choose Difficulty</div>
                <div onClick={handleDifficulty} className='difficulty-option' id='easy'>Easy</div>
                <div onClick={handleDifficulty} className='difficulty-option' id='medium'>Medium</div>
                <div onClick={handleDifficulty} className='difficulty-option' id='hard'>Hard</div>
            </div>

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
