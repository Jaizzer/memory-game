import { useEffect, useState } from 'react';

export default function App() {
    const [characters, setCharacters] = useState([]);

    // Retrieve demon slayer API
    useEffect(() => {
        fetch('https://demon-slayer-api.onrender.com/v1/')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setCharacters(
                    data.map((character) => {
                        return { ...character, clickCount: 0 };
                    })
                );
            })
            .catch((error) => {
                console.error('Error: ', error);
            });
    }, []);
    return <></>;
}
