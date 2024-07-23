import { useEffect, useState } from 'react';

export default function App() {
    const [characters, setCharacters] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    

    function handleClick(id) {
        const updatedClickCount = characters.map((character) => {
            if (character.id === id) {
                if (character.clickCount === 1) {
                    setGameOver(true)
                }
                return { ...character, clickCount: character.clickCount + 1 };
            }
            return character;
        });

        setCharacters(updatedClickCount);
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

    if (gameOver) {
        return (
            <div className='game-over'>
                You Lost!!!
            </div>
        )
    }

    return (
        <>
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
