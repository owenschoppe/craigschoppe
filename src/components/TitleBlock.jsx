import { css } from "@emotion/css";

const TitleBlock = (props) => {
    const { image } = props;

    const getNameFromPath = (name) => {
        return name.split("/")[1].split(".")[0];
    };

    const formatName = (name) => {
        const suffix = name.slice(-1);
        return suffix === "_" ? "Untitled" : name;
    };

    return (
        <span className={title}>
            {image ? formatName(getNameFromPath(image.name)) : null}
            {props.children}
        </span>
    );
};

const title = css`
    margin: 0 1rem;
    display: flex;
    align-items: center;
`;

export { TitleBlock };
