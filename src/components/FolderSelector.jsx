import { css } from "@emotion/css";

const buttonStyle = css`
    color: white;
    font-family: "Cormorant Garamond", serif;
    font-size: inherit;
    font-weight: inherit;
    padding: 1rem 0;
    outline: none;
    background: none;
    border: none;
    border-bottom: 1px solid white;
    user-select: none;
    cursor: pointer;
    &:hover {
        outline: none;
        box-shadow: 0 1px 0 0 white;
    }
    &:focus {
        outline: none;
        box-shadow: 0 1px 0 0 white;
    }
`;

const FolderSelector = (props) => {
    const { folder, folders, nextFolder } = props;

    const getButton = () => {
        return (
            <button
                className={buttonStyle}
                onClick={nextFolder}
                title="Click to Change"
            >
                {folders.length && folder !== null
                    ? folders[folder].name.slice(0, -1)
                    : null}
            </button>
        );
    };

    return <div>{folder !== null ? getButton() : null}</div>;
};

export { FolderSelector };
