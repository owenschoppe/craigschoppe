import { useEffect } from "react";
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
        console.log(e);
        if (e.keyCode == "37") {
            // left arrow
            handlePrev();
        } else if (e.keyCode == "39") {
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
    }, []);

    return (
        <div className={controlsStyle}>
            <button className={cx(button, prev)} onClick={handlePrev}>
                ←
            </button>
            <button className={cx(button, next)} onClick={handleNext}>
                →
            </button>
        </div>
    );
};
export { Controls };
