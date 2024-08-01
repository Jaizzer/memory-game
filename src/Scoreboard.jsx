/* eslint-disable react/prop-types */
export default function Scoreboard({ currentScore, bestScore }) {
    return (
        <div className="scoreboard">
            <div className="current-score">Current Score: {currentScore}</div>
            <div className="best-score">Best Score: {bestScore}</div>
        </div>
    );
}
