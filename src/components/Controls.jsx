import { useEffect, useState } from "react";
import { css, cx } from "@emotion/css";

const controlsStyle = css`
    font-family: "Poppins", sans-serif;
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
    const { array, index, setIndex } = props;

    const handleKeyboard = (e) => {
        if (e.key === "ArrowLeft") {
            // left arrow
            handlePrev();
        } else if (e.key === "ArrowRight") {
            // right arrow
            handleNext();
        }
    };

    const handlePrev = () => {
        setIndex((index - 1 + array.length) % array.length);
    };

    const handleNext = () => {
        setIndex((index + 1) % array.length);
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyboard);
        return () => {
            window.removeEventListener("keydown", handleKeyboard);
        };
    }, [array, handleKeyboard, index]);

    useEffect(() => {
        console.log("newIndex", index);
    }, [index]);

    return (
        <div className={controlsStyle}>
            <button className={cx(button, prev)} onClick={handlePrev}>
                ← <span className="assistiveText">Previous Photo</span>
            </button>
            <button className={cx(button, next)} onClick={handleNext}>
                → <span className="assistiveText">Next Photo</span>
            </button>
        </div>
    );
};
export { Controls };
