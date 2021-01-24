import { useEffect, useCallback } from "react";
import { css, cx } from "@emotion/css";

const controlsStyle = css`
    font-family: "Poppins", sans-serif;
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
    &:hover {
        outline: none;
        border: 1px solid #ccc;
    }
    &:focus {
        outline: none;
        border: 1px solid white;
    }
`;

const prev = css``;
const next = css``;

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
                className={cx(button, prev)}
                onClick={handlePrev}
                title="Click to Go Back"
            >
                ← <span className="assistiveText">Previous Photo</span>
            </button>
            {props.children}
            <button
                className={cx(button, next)}
                onClick={handleNext}
                title="Click to Advance"
            >
                → <span className="assistiveText">Next Photo</span>
            </button>
        </div>
    );
};
export { Controls };
