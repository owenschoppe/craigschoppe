import { useEffect } from "react";
import { css } from "@emotion/css";

const h1 = css`
    margin: 1rem 0;
    font-size: 1.5rem;
    @media (min-width: 420px) {
        font-size: 2rem;
    }
`;

const buttonStyle = css`
    color: white;
    font-family: "Cormorant Garamond", serif;
    font-size: 16px;
    outline: none;
    background: none;
    border: none;
    border-bottom: 1px solid white;
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
    const { folder, folders, setFolder } = props;

    const handleClick = () => {
        setFolder(folders[(folder + 1 + folders.length) % folders.length]);
    };

    useEffect(() => {
        console.log("folder", folder);
    }, [folder]);

    const getButton = () => {
        return (
            <button
                className={buttonStyle}
                onClick={handleClick}
                title="Click to Change"
            >
                <h1 className={h1}>{folders[folder].name.slice(0, -1)}</h1>
            </button>
        );
    };

    return <div>{folder !== null ? getButton() : null}</div>;
};

export { FolderSelector };
