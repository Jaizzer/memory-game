import { useEffect, useState } from 'react';
import randomizeArray from '@chriscodesthings/randomize-array';

export default function App() {
    const [characters, setCharacters] = useState([]);
    const [currentScore, setCurrentScore] = useState(0);
    const [bestScore, setBestScore] = useState(0)

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
            
            // Randomize updated click counts
            setCharacters(randomizeArray(updatedCharacterClickCount));
        } else {
            // Reset click counts
            setCharacters(characters.map(character => {
                return {...character, clickCount: 0}
            }));

            // Reset score
            setCurrentScore(0);
        }
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

    // Render cards
    return (
        <>  
            <div className='scoreboard'>
                <div className='current-score'>Current Score: {currentScore}</div>
                <div className='best-score'>Best Score: {bestScore}</div>
            </div>
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
                        <div className='clickCount'>Click Count: {character.clickCount}</div>
                    </div>
                );
            })}
        </>
    );
}
