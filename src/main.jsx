import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import MusicButton from './MusicButton.jsx';
import sfx from './assets/sound.mp3';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
        <MusicButton></MusicButton>
        <audio id="hitSound" src={sfx}></audio>
    </React.StrictMode>
);
