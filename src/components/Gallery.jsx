import { useState } from "react";
import { css, cx, keyframes } from "@emotion/css";
import { useSwipeable } from "react-swipeable";

const Gallery = (props) => {
    const { image, nextImage, next, prevImage, prev, setLoading } = props;

    const [left, setLeft] = useState(0);
    const [direction, setDirection] = useState(0);
    const [animationStyle, setAnimationStyle] = useState("");

    const getLeft = () => `calc(-100% - 2rem + ${left}px)`;

    const swipeStyle = css`
        left: ${getLeft()};
    `;

    const slideLeft = keyframes`
        from {
          left: ${getLeft()};
        }

        to {
          left: calc(-200% - 4rem);
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
          left: calc(-100% - 2rem);
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
            className={cx(galleryStyle, swipeStyle, animationStyle)}
            {...handlers}
            onAnimationEnd={handleEndAnimation}
        >
            {prevImage ? (
                <img
                    className={cx(imageStyle, prevStyle)}
                    sizes="100vw"
                    src={`https://storage.googleapis.com/craigschoppe-images/${prevImage.id}`}
                    srcSet={`https://storage.googleapis.com/craigschoppe-images/${prevImage.id} 1920w, https://storage.googleapis.com/craigschoppe-images-small/${prevImage.id} 800w`}
                    alt={`${prevImage.name}, by Craig Schoppe.`}
                    width="1920px"
                    height="auto"
                />
            ) : null}
            {image ? (
                <img
                    className={cx(imageStyle)}
                    sizes="100vw"
                    src={`https://storage.googleapis.com/craigschoppe-images/${image.id}`}
                    srcSet={`https://storage.googleapis.com/craigschoppe-images/${image.id} 1920w, https://storage.googleapis.com/craigschoppe-images-small/${image.id} 800w`}
                    alt={`${image.name}, by Craig Schoppe.`}
                    width="1920px"
                    height="auto"
                    onLoad={
                        resetGallery //The problem is that the image index updates, and then the browser tries to fetch the image.
                    }
                />
            ) : null}
            {nextImage ? (
                <img
                    className={cx(imageStyle, nextStyle)}
                    sizes="100vw"
                    src={`https://storage.googleapis.com/craigschoppe-images/${nextImage.id}`}
                    srcSet={`https://storage.googleapis.com/craigschoppe-images/${nextImage.id} 1920w, https://storage.googleapis.com/craigschoppe-images-small/${nextImage.id} 800w`}
                    alt={`${nextImage.name}, by Craig Schoppe.`}
                    width="1920px"
                    height="auto"
                />
            ) : null}
        </div>
    );
};

export { Gallery };

const galleryStyle = css`
    max-height: 100%;
    width: calc(300% + 4rem);
    min-height: 0;
    min-width: 0;
    display: flex;
    flex: 1 1 100%;
    justify-content: center;
    align-items: center;
    margin: 1rem 0;
    touch-action: pan-x pan-y;
    position: relative;
    // @media (min-width: 740px) {
    //     margin: 1rem;
    // }
    // @media (min-width: 1024px) {
    //     margin: 3rem;
    // }
`;

const imageStyle = css`
    max-height: 100%;
    max-width: 100%;
    width: 100%;
    object-fit: contain;
    display: block;
    // @media (min-width: 740px) {
    //     padding: 1rem;
    // }
    // @media (min-width: 1024px) {
    //     padding: 3rem;
    // }
`;

const prevStyle = css`
    left: -100vw;
    margin-right: 2rem;
`;

const nextStyle = css`
    right: 100vw;
    margin-left: 2rem;
`;
