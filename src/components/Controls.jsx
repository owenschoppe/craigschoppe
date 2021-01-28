import { useEffect } from "react";
import { css, cx } from "@emotion/css";
import arrow from "../arrow.svg";

const controlsStyle = css`
    font-family: "Poppins", Arial, sans-serif;
    display: flex;
    flex: 1 1 auto;
    justify-content: space-between;
    align-items: center;
`;

const button = css`
    width: 60px;
    height: 60px;
    color: white;
    background: none;
    border: none;
    user-select: none;
    cursor: pointer;
    &:hover {
        outline: none;
        border: 1px solid #ccc;
    }
    &:focus {
        outline: none;
        border: 1px solid white;
    }
`;

const prev = css`
    transform: rotate(180deg);
    justify-self: center;
    align-self: center;
    width: 20px;
    height: 20px;
`;
const next = css`
    justify-self: center;
    align-self: center;
    width: 20px;
    height: 20px;
`;

const Controls = (props) => {
    const { image, handleNext, handlePrev } = props;

    const handleKeyboard = (e) => {
        if (e.key === "ArrowLeft") {
            // left arrow
            handlePrev();
        } else if (e.key === "ArrowRight") {
            // right arrow
            handleNext();
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyboard);
        return () => {
            window.removeEventListener("keydown", handleKeyboard);
        };
    }, [image]);

    return (
        <div className={controlsStyle}>
            <button
                className={cx(button)}
                onClick={handlePrev}
                title="Click to Go Back"
            >
                <img
                    src={arrow}
                    className={prev}
                    alt="Previous"
                    width="20px"
                    height="20px"
                />
            </button>
            {props.children}
            <button
                className={cx(button)}
                onClick={handleNext}
                title="Click to Advance"
            >
                <img
                    src={arrow}
                    className={next}
                    alt="Next"
                    width="20px"
                    height="20px"
                />
            </button>
        </div>
    );
};
export { Controls };
