/* eslint-disable react/prop-types */
export default function Card({ name, imageLink, id, onClickFunction }) {
    return (
        <div
            className="card"
            key={id}
            onClick={onClickFunction}
        >
            <div className="name">{name}</div>
            <img src={imageLink} />
        </div>
    );
}
