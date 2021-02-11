import { css } from "@emotion/css";

const FolderSelector = (props) => {
    const { image, nextFolder } = props;

    const getButton = () => {
        return (
            <button
                className={buttonStyle}
                onClick={nextFolder}
                title="Click to Change"
            >
                {image.folder}
            </button>
        );
    };

    return <div>{image ? getButton() : null}</div>;
};

export { FolderSelector };

const buttonStyle = css`
    color: white;
    font-family: "Cormorant Garamond", serif;
    font-size: inherit;
    font-weight: inherit;
    padding: 1rem 0;
    outline: none;
    background: none;
    border: none;
    box-shadow: 0 1px 0 0 white;
    user-select: none;
    cursor: pointer;
    &:hover {
        outline: none;
        box-shadow: 0 2px 0 0 white;
    }
    &:focus {
        outline: none;
        box-shadow: 0 2px 0 0 white;
    }
`;