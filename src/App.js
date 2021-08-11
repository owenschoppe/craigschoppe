import { useState, useEffect, useCallback } from "react";
import { Controls } from "./components/Controls";
import { FolderSelector } from "./components/FolderSelector";
import { TitleBlock } from "./components/TitleBlock";
import { Attribution } from "./components/Attribution";
// import { useStickyState } from "./components/useStickyState";
import { css, cx } from "@emotion/css";
// import ig from "./instagram.png";
import { Gallery } from "./components/Gallery";
import { Loader } from "./components/Loader";

const getFiles = async () => {
  const data = await (await fetch("/files")).json();

  const images = data[0]
    .filter((file) => file.name.slice(-1) !== "/")
    .map((file) => Object.assign(file, { folder: file.name.split("/")[0] })) //Filter out folders
    .sort((file) => file.folder)
    .map((file, i) => Object.assign(file, { index: i }));

  const folders = data[0]
    .filter((file) => file.name.slice(-1) === "/")
    .map((file) => {
      const folderImages = getImages(images, file);
      return Object.assign(file, {
        start: folderImages[0].index,
        end: folderImages[folderImages.length - 1].index,
      });
    });

  return { images, folders };
};

const getImages = (images, folder) => {
  return images.filter((image) => image.id.startsWith(folder.id));
};

function App() {
  const [allImages, setAllImages] = useState([]);
  const [image, setImage] = useState(null);
  const [nextImage, setnImage] = useState(null);
  const [prevImage, setpImage] = useState(null);
  const [folders, setFolders] = useState([]);
  const [folder, setFolder] = useState(null);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const getPrevIndex = useCallback(
    () => (index - 1 + allImages.length) % allImages.length,
    [index, allImages]
  );

  const getNextIndex = useCallback(
    () => (index + 1) % allImages.length,
    [index, allImages]
  );

  const prev = () => {
    console.log("prev");
    setLoading(true);
    setIndex(getPrevIndex());
  };

  const next = () => {
    console.log("next");
    setLoading(true);
    setIndex(getNextIndex());
  };

  const nextFolder = () => {
    setFolder((folder + 1 + folders.length) % folders.length);
  };

  // Intialize app
  useEffect(() => {
    console.log("Created in loving memory of my dad. -Owen");
  }, []);

  //Select a random folder to start
  useEffect(() => {
    getFiles().then(({ images, folders }) => {
      setAllImages(images);
      setFolders(folders);
      if (folder === null) setFolder(~~(Math.random() * folders.length)); // For initial random folder
    });
  }, [folder]);

  //Go to the first image when the folder changes
  useEffect(() => {
    if (folders.length && folder !== null) {
      setIndex(folders[folder].start);
    }
  }, [allImages, folders, folder]);

  //Set the images when the index changes
  useEffect(() => {
    if (allImages) {
      setImage(allImages[index]);
      setnImage(allImages[getNextIndex()]);
      setpImage(allImages[getPrevIndex()]);
    }
  }, [allImages, index, getNextIndex, getPrevIndex]);

  return (
    <div className={appStyle}>
      <h1 className={cx(headerStyle, h1)}>
        <FolderSelector image={image} nextFolder={nextFolder} />
        <span className={cx(name)}>
          by Craig Schoppe
          <Attribution />
        </span>
      </h1>
      <Gallery
        image={image}
        nextImage={nextImage}
        prevImage={prevImage}
        next={next}
        prev={prev}
        loading={loading}
        setLoading={setLoading}
      />
      <Loader loading={loading} />
      <div className={footerStyle}>
        <Controls image={image} handleNext={next} handlePrev={prev}>
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
  font-family: "Cormorant Garamond", Georgia, serif;
`;

const h1 = css`
  margin: 0;
  font-size: 1.25rem;
  user-select: none;
  @media (min-width: 740px) {
    font-size: 1.5rem;
  }
  @media (min-width: 1024px) {
    font-size: 2rem;
  }
`;

const name = css`
  padding: 1rem 0;
  flex: 0 0 auto;
  margin-left: 0.125rem;
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
