import { useState, useEffect } from "react";
import "./App.css";
import { Controls } from "./components/Controls";
import { FolderSelector } from "./components/FolderSelector";
import { TitleBlock } from "./components/TitleBlock";
import { Attribution } from "./components/Attribution";
// import { useStickyState } from "./components/useStickyState";
import { css, cx, keyframes } from "@emotion/css";
// import ig from "./instagram.png";
import { useSwipeable } from "react-swipeable";

const appStyle = css`
    background-color: black;
    color: white;
    display: flex;
    height: 100vh;
    flex-direction: column;
    overflow: hidden;
    touch-action: pan-y;
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
    margin: 0;
    font-size: 1.25rem;
    user-select: none;
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
    touch-action: pan-x pan-y;
    position: relative;
    left: 0;
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

// const instagramStyle = css`
//     width: 24px;
//     height: 24px;
//     content: "";
//     display: block;
//     background-image: url(${ig});
//     filter: invert(100%);
//     background-size: contain;
//     background-repeat: no-repeat;
//     margin-left: 0.25rem;
// `;

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

const getFiles = async () => {
    const data = await (await fetch("/files")).json();
    const images = data[0].filter((file) => file.name.slice(-1) !== "/"); //Filter out folders
    const folders = data[0].filter((file) => file.name.slice(-1) === "/"); //Find folders
    // console.log(data, images, folders);
    return { images, folders };
};

const getImages = (images, folder) => {
    return images.filter((image) => image.id.startsWith(folder.id));
};

function App() {
    const [allImages, setAllImages] = useState([]);
    const [images, setImages] = useState([]);
    const [image, setImage] = useState(null);
    const [folders, setFolders] = useState([]);

    // const [folder, setFolder] = useStickyState(null, "folder");
    // const [index, setIndex] = useStickyState(0, "index");
    const [folder, setFolder] = useState(null);
    const [index, setIndex] = useState(0);

    const [left, setLeft] = useState(0);
    const [animationStyle, setAnimationStyle] = useState("");

    const config = {
        delta: 10, // min distance(px) before a swipe starts
        preventDefaultTouchmoveEvent: false, // call e.preventDefault *See Details*
        trackTouch: true, // track touch input
        trackMouse: false, // track mouse input
        rotationAngle: 0, // set a rotation angle
    };

    const handlers = useSwipeable({
        onSwiped: (eventData) => {
            // setLeft(0);
        },
        onSwipedLeft: () => {
            nextImage();
            setAnimationStyle(animateLeft);
        }, // After LEFT swipe  (SwipeEventData) => void
        onSwipedRight: () => {
            prevImage();
            setAnimationStyle(animateRight);
        }, // After RIGHT swipe (SwipeEventData) => void
        onSwiping: (eventData) => {
            setLeft(eventData.deltaX);
        },
        ...config,
    });

    const swipeStyle = css`
        left: ${left}px;
    `;

    const slideLeft = keyframes`
        from {
          left: ${left}px;
        }

        to {
          left: -100%;
        }
    `;

    const animateLeft = css`
        animation: ${slideLeft} 1s ease-out 1;
        animation-fill-mode: forwards;
        animation-direction: normal;
    `;

    const slideRight = keyframes`
        from {
          left: ${left}px;
        }

        to {
          left: 100%;
        }
    `;

    const animateRight = css`
        animation: ${slideRight} 1s ease-out 1;
        animation-fill-mode: forwards;
        animation-direction: normal;
    `;

    // Intialize app
    useEffect(() => {
        getFiles().then(({ images, folders }) => {
            setAllImages(images);
            setFolders(folders);
            if (folder === null) setFolder(~~(Math.random() * folders.length)); // For initial random folder
        });
    }, [folder]);

    useEffect(() => {
        if (folders.length && folder !== null)
            setImages(getImages(allImages, folders[folder]));
    }, [allImages, folders, folder]);

    useEffect(() => {
        if (images) {
            setImage(images[index]);
        }
    }, [images, index]);

    const resetGallery = () => {
        setAnimationStyle("");
        setLeft(0);
    };

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
            <h1 className={cx(headerStyle, h1)}>
                <FolderSelector
                    folder={folder}
                    folders={folders}
                    nextFolder={nextFolder}
                />
                <span className={cx(name)}>
                    by Craig Schoppe
                    <Attribution />
                </span>
            </h1>
            <div
                className={cx(galleryStyle, swipeStyle, animationStyle)}
                {...handlers}
            >
                {image ? (
                    <img
                        className={cx(imageStyle)}
                        sizes="100vw"
                        src={`https://storage.googleapis.com/craigschoppe-images/${image.id}`}
                        srcset={`https://storage.googleapis.com/craigschoppe-images/${image.id} 1920w, https://storage.googleapis.com/craigschoppe-images-small/${image.id} 800w`}
                        alt={`${image.name}, by Craig Schoppe.`}
                        height=""
                        width=""
                        onLoad={
                            resetGallery //The problem is that the image index updates, and then the browser tries to fetch the image.
                        }
                    />
                ) : null}
            </div>
            <div className={footerStyle}>
                <Controls
                    image={image}
                    handleNext={nextImage}
                    handlePrev={prevImage}
                >
                    <TitleBlock image={image} />
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
