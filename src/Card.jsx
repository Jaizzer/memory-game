/* eslint-disable react/prop-types */
export default function Card({ imageLink, id, onClickFunction }) {
    return (
        <div className="card" key={id} onClick={onClickFunction}>
            <img src={imageLink} />
        </div>
    );
}
