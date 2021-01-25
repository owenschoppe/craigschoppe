import { useState, useEffect } from "react";
import "./App.css";
import { Controls } from "./components/Controls";
import { FolderSelector } from "./components/FolderSelector";
import { TitleBlock } from "./components/TitleBlock";
import { css, cx } from "@emotion/css";
import ig from "./instagram.png";
import cc from "./creative-commons.svg";

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
    flex: 1 0 auto;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    padding-left: 1rem;
    padding-right: 0.125rem;
    font-family: "Cormorant Garamond", serif;
`;

const h1 = css`
    margin: 1rem 0;
    font-size: 1.25rem;
    @media (min-width: 375px) {
        font-size: 1.5rem;
    }
    @media (min-width: 420px) {
        font-size: 2rem;
    }
`;

const name = css`
    flex: 0 0 auto;
    margin-left: 0.125rem;
`;

const galleryStyle = css`
    max-height: 100%;
    max-width: 100%;
    min-height: 0;
    min-width: 0;
    display: flex;
    flex: 1 1 100%;
    justify-content: center;
    align-items: center;
    margin: 1rem 0;
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
    width: 100%;
    @media (min-width: 720px) {
        width: auto;
    }
    display: block;
    align-self: center;
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
    display: flex;
    flex: 1 0 auto;
    justify-content: center;
    margin-left: 1rem;
    margin-right: 1rem;
    margin-bottom: 1rem;
    @media (min-width: 720px) {
        margin-left: 3rem;
        margin-right: 3rem;
    }
`;

const attributionStyle = css`
    margin-left: 0.125rem;
    display: inline-block;
    & > a {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        &:hover,
        &:focus {
            outline: none;
            border: none;
            box-shadow: 0 0 0 1px white;
        }
        & img {
            width: 0.75rem;
            height: 0.75rem;
        }
    }
`;

function App() {
    const [allImages, setAllImages] = useState([]);
    const [images, setImages] = useState([]);
    const [image, setImage] = useState(null);
    const [folders, setFolders] = useState([]);
    const [folder, setFolder] = useState(null);

    const [index, setIndex] = useState(0); // Make sticky?

    // Intialize app
    useEffect(() => {
        getFiles().then(({ images, folders }) => {
            setAllImages(images);
            setFolders(folders);
            setFolder(~~(Math.random() * folders.length)); // For random folder
        });
    }, []);

    useEffect(() => {
        console.log(images, folders, folder);
        if (folder !== null) setImages(getImages(allImages, folders[folder]));
    }, [allImages, folder]);

    useEffect(() => {
        console.log(images, index);
        if (images) setImage(images[index]);
    }, [images, index]);

    const prevImage = () => {
        if (index === 0) {
            prevFolder();
        } else {
            setIndex((index - 1 + images.length) % images.length);
        }
    };

    const nextImage = () => {
        if (index === images.length - 1) {
            nextFolder();
        } else {
            setIndex((index + 1) % images.length);
        }
    };

    const prevFolder = () => {
        const newFolder = (folder - 1 + folders.length) % folders.length;
        const newImages = getImages(allImages, folders[newFolder]); //Can this be optimized away?
        setIndex(newImages.length - 1);
        setFolder(newFolder);
    };

    const nextFolder = () => {
        setIndex(0);
        setFolder((folder + 1 + folders.length) % folders.length);
    };

    return (
        <div className={appStyle}>
            <header className={headerStyle}>
                <FolderSelector
                    folder={folder}
                    folders={folders}
                    nextFolder={nextFolder}
                />
                <h1 className={cx(h1, name)}>
                    by Craig Schoppe
                    <span className={attributionStyle}>
                        <a
                            rel="license"
                            href="http://creativecommons.org/licenses/by-nc-nd/4.0/"
                        >
                            <img
                                alt="Creative Commons License"
                                style={{ borderWidth: 0 }}
                                src={cc}
                            />
                            <span className="assistiveText">
                                This work is licensed under a Creative Commons
                                Attribution-NonCommercial-NoDerivatives 4.0
                                International License.
                            </span>
                        </a>
                    </span>
                </h1>
            </header>
            <div className={galleryStyle}>
                {image ? (
                    <img
                        className={imageStyle}
                        sizes="100vw"
                        src={`https://storage.googleapis.com/craigschoppe-images/${image.id}`}
                        srcset={`https://storage.googleapis.com/craigschoppe-images/${image.id} 1920w, https://storage.googleapis.com/craigschoppe-images-small/${image.id} 800w`}
                        alt={`${image.name}, a photograph by Craig Schoppe.`}
                        height=""
                        width=""
                    />
                ) : null}
            </div>
            <div className={footerStyle}>
                <Controls
                    image={image}
                    handleNext={nextImage}
                    handlePrev={prevImage}
                >
                    <TitleBlock image={image}>
                        {/* {image ? (
                            
                        ) : null} */}
                    </TitleBlock>
                </Controls>
            </div>
            {/* <a
                        className={instagramStyle}
                        href="https://www.instagram.com/wood_by_schoppe/"
                    >
                        <span className="assistiveText">Instagram</span>
                    </a> */}
        </div>
    );
}

export default App;
