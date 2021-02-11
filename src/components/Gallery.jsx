import { useState } from "react";
import { css, cx, keyframes } from "@emotion/css";
import { useSwipeable } from "react-swipeable";

const Gallery = (props) => {
    const { image, nextImage, next, prevImage, prev, setLoading } = props;

    const [left, setLeft] = useState(0);
    const [direction, setDirection] = useState(0);
    const [animationStyle, setAnimationStyle] = useState("");

    const getLeft = () => `calc(-100% + ${left}px)`;

    const swipeStyle = css`
        left: ${getLeft()};
    `;

    const slideLeft = keyframes`
        from {
          left: ${getLeft()};
        }

        to {
          left: -200%;
        }
    `;

    const animateLeft = css`
        animation: ${slideLeft} 1s ease-out 1;
        animation-fill-mode: forwards;
        animation-direction: normal;
    `;

    const slideRight = keyframes`
        from {
          left: ${getLeft()};
        }

        to {
          left: 0;
        }
    `;

    const animateRight = css`
        animation: ${slideRight} 1s ease-out 1;
        animation-fill-mode: forwards;
        animation-direction: normal;
    `;

    const slideHome = keyframes`
        from {
          left: ${getLeft()};
        }

        to {
          left: -100%;
        }
    `;

    const animateHome = css`
        animation: ${slideHome} 1s ease-out 1;
        animation-fill-mode: forwards;
        animation-direction: normal;
    `;

    const threshold = 40;

    const getDirection = (eventData) =>
        eventData.deltaX > threshold
            ? "prev"
            : eventData.deltaX < -threshold
            ? "next"
            : "home";

    const resetGallery = () => {
        setAnimationStyle("");
        setLeft(0);
        setLoading(false);
    };

    const swipeAction = {
        next: next,
        home: resetGallery,
        prev: prev,
    };

    const swipeAnimation = {
        next: animateLeft,
        home: animateHome,
        prev: animateRight,
    };

    const config = {
        delta: 10, // min distance(px) before a swipe starts
        preventDefaultTouchmoveEvent: false, // call e.preventDefault *See Details*
        trackTouch: true, // track touch input
        trackMouse: false, // track mouse input
        rotationAngle: 0, // set a rotation angle
    };

    const handlers = useSwipeable({
        onSwiped: (eventData) => {
            const direction = getDirection(eventData);
            setDirection(direction);
            setAnimationStyle(swipeAnimation[direction]);
        },
        onSwiping: (eventData) => {
            setLeft(eventData.deltaX);
        },
        ...config,
    });

    const handleEndAnimation = () => {
        swipeAction[direction]();
    };

    return (
        <div
            key={`${image ? image.id : "empty"}`}
            className={cx(galleryStyle, swipeStyle, animationStyle)}
            {...handlers}
            onAnimationEnd={handleEndAnimation}
        >
            {prevImage ? (
                <div className={cx(frameStyle, prevArea)}>
                    <img
                        key={prevImage.id}
                        className={cx(imageStyle, prevStyle)}
                        sizes="100vw"
                        src={`https://storage.googleapis.com/craigschoppe-images/${prevImage.id}`}
                        srcSet={`https://storage.googleapis.com/craigschoppe-images/${prevImage.id} 1920w, https://storage.googleapis.com/craigschoppe-images-small/${prevImage.id} 800w`}
                        alt={`${prevImage.name}, by Craig Schoppe.`}
                        width="1920px"
                        height="auto"
                    />
                </div>
            ) : null}
            {image ? (
                <div className={cx(frameStyle, currentArea)}>
                    <img
                        key={image.id}
                        className={cx(imageStyle)}
                        sizes="100vw"
                        src={`https://storage.googleapis.com/craigschoppe-images/${image.id}`}
                        srcSet={`https://storage.googleapis.com/craigschoppe-images/${image.id} 1920w, https://storage.googleapis.com/craigschoppe-images-small/${image.id} 800w`}
                        alt={`${image.name}, by Craig Schoppe.`}
                        width="1920px"
                        height="auto"
                        onLoad={resetGallery}
                    />
                </div>
            ) : null}
            {nextImage ? (
                <div className={cx(frameStyle, nextArea)}>
                    <img
                        key={nextImage.id}
                        className={cx(imageStyle, nextStyle)}
                        sizes="100vw"
                        src={`https://storage.googleapis.com/craigschoppe-images/${nextImage.id}`}
                        srcSet={`https://storage.googleapis.com/craigschoppe-images/${nextImage.id} 1920w, https://storage.googleapis.com/craigschoppe-images-small/${nextImage.id} 800w`}
                        alt={`${nextImage.name}, by Craig Schoppe.`}
                        width="1920px"
                        height="auto"
                    />
                </div>
            ) : null}
        </div>
    );
};

export { Gallery };

const galleryStyle = css`
    max-height: 100%;
    width: 300%;
    height: 100%;
    min-height: 0;
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
    grid-column-gap: 2rem;
    grid-template-rows: minmax(0, 1fr);
    grid-template-areas: "prev current next";
    touch-action: pan-x pan-y;
    position: relative;
    // margin: 1rem 0;
    // @media (min-width: 740px) {
    //     margin: 1rem 0;
    // }
    // @media (min-width: 1024px) {
    //     margin: 3rem 0;
    // }
`;

const imageStyle = css`
    max-height: 100%;
    max-width: 100%;
    width: 100%;
    object-fit: contain;
    display: block;
`;

const prevStyle = css``;

const nextStyle = css``;

const frameStyle = css`
    display: flex;
    margin: 1rem 0;
    @media (min-width: 740px) {
        margin: 1rem;
    }
    @media (min-width: 1024px) {
        margin: 3rem;
    }
`;

const prevArea = css`
    grid-area: prev;
`;

const nextArea = css`
    grid-area: next;
`;

const currentArea = css`
    grid-area: current;
`;
