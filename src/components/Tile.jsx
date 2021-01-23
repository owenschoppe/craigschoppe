const Tile = (props) => {
    const { image } = props;
    return (
        <a className="tile" href="#">
            <img
                src={`https://storage.googleapis.com/craigschoppe-images/${image}`}
                alt={image}
                height="350"
            />
        </a>
    );
};

export { Tile };
