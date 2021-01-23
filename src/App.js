import { useState, useEffect } from "react";
import "./App.css";
import { Controls } from "./components/Controls";
import { css } from "@emotion/css";
import ig from "./instagram.png";

const getImages = async () => {
    const images = await fetch("/files");
    return images.json();
};

const appStyle = css`
    background-color: black;
    color: white;
    display: flex;
    height: 100vh;
    flex-direction: column;
`;

const headerStyle = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    font-family: "Cormorant Garamond", serif;
`;

const galleryStyle = css`
    position: relative;
    max-height: 100%;
    max-width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1 1 auto;
    min-height: 0;
    @media (min-width: 420px) {
        margin: 1rem;
    }
    @media (min-width: 720px) {
        margin: 3rem;
    }
`;

const imageStyle = css`
    max-height: 100%;
    max-width: 100%;
`;

const instagramStyle = css`
    width: 24px;
    height: 24px;
    content: "";
    display: block;
    background-image: url(${ig});
    filter: invert(100%);
    background-size: contain;
    background-repeat: no-repeat;
`;

const footerStyle = css`
    position: absolute;
    bottom: 1rem;
    right: 1rem;
`;

function App() {
    const [images, setImages] = useState([]);
    const [image, setImage] = useState(null);
    const [index, setIndex] = useState(0); //Make sticky?

    useEffect(() => {
        getImages().then((images) => {
            setImages(images);
        });
    }, []);

    useEffect(() => {
        console.log(images, index);
        if (images) setImage(images[index]);
    }, [images, index]);

    return (
        <div className={appStyle}>
            <header className={headerStyle}>
                <h1>by Craig Schoppe</h1>
                <Controls array={images} index={index} setIndex={setIndex} />
            </header>
            <div className={galleryStyle}>
                {image ? (
                    <img
                        className={imageStyle}
                        src={`https://storage.googleapis.com/craigschoppe-images/${image}`}
                        alt={image}
                    />
                ) : null}
            </div>
            <div className={footerStyle}>
                <a
                    className={instagramStyle}
                    href="https://www.instagram.com/wood_by_schoppe/"
                >
                    <span className="assistiveText">Instagram</span>
                </a>
                <a
                    rel="license"
                    href="http://creativecommons.org/licenses/by-nc-nd/4.0/"
                >
                    <img
                        alt="Creative Commons License"
                        style="border-width:0"
                        src="https://i.creativecommons.org/l/by-nc-nd/4.0/80x15.png"
                    />
                </a>
                <br />
                This work is licensed under a{" "}
                <a
                    rel="license"
                    href="http://creativecommons.org/licenses/by-nc-nd/4.0/"
                >
                    Creative Commons Attribution-NonCommercial-NoDerivatives 4.0
                    International License
                </a>
                .
            </div>
        </div>
    );
}

export default App;
