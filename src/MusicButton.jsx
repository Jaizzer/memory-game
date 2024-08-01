import backgroundMusic from './assets/backgroundMusic.mp3';
import musicOff from './assets/music-off.png';
import musicOn from './assets/music-on.png';
import { useState } from 'react';
export default function MusicButton() {
    const [audio, setAudio] = useState(false);
    return (
        <>
            <audio autoPlay loop>
                <source src={backgroundMusic} type="audio/mpeg" />
                Your browser does not support the audio element
            </audio>
            {audio ? (
                <button
                    className="play"
                    onClick={() => {
                        document.querySelector('audio').pause();
                        setAudio(false);
                    }}
                >
                    <img className="music-icon" src={musicOn} />
                </button>
            ) : (
                <button
                    className="pause"
                    onClick={() => {
                        document.querySelector('audio').play();
                        setAudio(true);
                    }}
                >
                    <img className="music-icon" src={musicOff} />
                </button>
            )}
        </>
    );
}
