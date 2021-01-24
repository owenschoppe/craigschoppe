import { useState, useEffect } from "react";
import "./App.css";
import { Controls } from "./components/Controls";
import { FolderSelector } from "./components/FolderSelector";
import { TitleBlock } from "./components/TitleBlock";
import { css } from "@emotion/css";
import ig from "./instagram.png";

const getFiles = async () => {
    const data = await (await fetch("/files")).json();

    const images = data[0].filter((file) => file.name.slice(-1) !== "/"); //Filter out folders
    // .map((file) => file.id);
    const folders = data[0].filter((file) => file.name.slice(-1) === "/"); //Find folders
    // .map((folder) => folder.id);
    console.log(data, images, folders);
    return { images, folders };
};

const getImages = (images, folder) => {
    return images.filter((image) => image.id.startsWith(folder.id));
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

const h1 = css`
    margin: 1rem 0;
    font-size: 1.5rem;
    @media (min-width: 420px) {
        font-size: 2rem;
    }
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
    margin-left: 0.25rem;
`;

const footerStyle = css`
    margin-left: 1rem;
    margin-right: 1rem;
    margin-bottom: 3rem;
    display: flex;
    justify-content: center;
    @media (min-width: 720px) {
        margin-left: 3rem;
        margin-right: 3rem;
    }
`;

const attributionStyle = css`
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
`;

function App() {
    const [allImages, setAllImages] = useState([]);
    const [images, setImages] = useState([]);
    const [image, setImage] = useState(null);
    const [folders, setFolders] = useState([]);
    const [folder, setFolder] = useState(null);

    const [index, setIndex] = useState(0); //Make sticky?

    useEffect(() => {
        getFiles().then(({ images, folders }) => {
            setAllImages(images);
            setFolders(folders);
            setFolder(folders[0]);
        });
    }, []);

    useEffect(() => {
        console.log(images, folders, folder);
        if (folder) setImages(getImages(allImages, folder));
    }, [allImages, folder]);

    useEffect(() => {
        console.log(images, index);
        if (images) setImage(images[index]);
    }, [images, index]);

    const handlePrev = () => {
        setIndex((index - 1 + images.length) % images.length);
    };

    const handleNext = () => {
        setIndex((index + 1) % images.length);
    };

    return (
        <div className={appStyle}>
            <header className={headerStyle}>
                <FolderSelector
                    folder={folder}
                    folders={folders}
                    setFolder={setFolder}
                />
                <h1 className={h1}>by Craig Schoppe</h1>
            </header>
            <div className={galleryStyle}>
                {image ? (
                    <img
                        className={imageStyle}
                        src={`https://storage.googleapis.com/craigschoppe-images/${image.id}`}
                        alt={image.name}
                    />
                ) : null}
            </div>
            <div className={footerStyle}>
                <Controls
                    image={image}
                    handleNext={handleNext}
                    handlePrev={handlePrev}
                >
                    <TitleBlock image={image} />
                </Controls>
                <div className={attributionStyle}>
                    <a
                        rel="license"
                        href="http://creativecommons.org/licenses/by-nc-nd/4.0/"
                    >
                        <img
                            alt="Creative Commons License"
                            style={{ borderWidth: 0 }}
                            src="https://i.creativecommons.org/l/by-nc-nd/4.0/80x15.png"
                        />
                    </a>
                    <span className="assistiveText">
                        This work is licensed under a{" "}
                        <a
                            rel="license"
                            href="http://creativecommons.org/licenses/by-nc-nd/4.0/"
                        >
                            Creative Commons
                            Attribution-NonCommercial-NoDerivatives 4.0
                            International License
                        </a>
                        .
                    </span>
                    {/* <a
                        className={instagramStyle}
                        href="https://www.instagram.com/wood_by_schoppe/"
                    >
                        <span className="assistiveText">Instagram</span>
                    </a> */}
                </div>
            </div>
        </div>
    );
}

export default App;
