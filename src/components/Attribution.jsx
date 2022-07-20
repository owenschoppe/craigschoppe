import { css } from '@emotion/css';
import cc from '../assets/creative-commons.svg';
import { assistiveText } from './SharedStyles';

const Attribution = () => {
  return (
    <span className={attributionStyle}>
      <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">
        <img
          alt="Creative Commons License"
          style={{ borderWidth: 0 }}
          src={cc}
          width="0.75rem"
          height="0.75rem"
        />
        <span className={assistiveText}>
          This work is licensed under a Creative Commons
          Attribution-NonCommercial-NoDerivatives 4.0 International License.
        </span>
      </a>
    </span>
  );
};

export { Attribution };

const attributionStyle = css`
  margin-left: 0.125rem;
  display: inline-block;
  & > a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    &:hover,
    &:focus {
      outline: none;
      border: none;
      box-shadow: 0 0 0 1px white;
    }
    & img {
      width: 0.75rem;
      height: 0.75rem;
    }
  }
`;
