import { useEffect } from 'react';

export default function App() {
    // Retrieve demon slayer API
    useEffect(() => {
        fetch('https://demon-slayer-api.onrender.com/v1/').then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json()
        }).then(data => {
            console.log(data);
        }).catch(error => {
            console.error('Error: ', error);
        });
    }, []);
    return <></>;
}
