import { css, cx, keyframes } from '@emotion/css';
import { useState, useEffect } from 'react';

const Loader = (props) => {
  const { loading } = props;
  const [loaderStyle, setLoaderStyle] = useState('');

  useEffect(() => {
    setLoaderStyle(loading ? loaderAnimation : '');
  }, [loading]);

  return <div className={cx(loader, loaderStyle)} />;
};

export { Loader };

const loader = css`
  flex: none;
  left: 0px;
  height: 16px;
  width: 0px;
  margin-left: 0;
  box-shadow: 0 -1px 0 0 white;
`;

const loaderKeyframes = keyframes`
        from {
          margin-left: 0;
          width: 0px;
        }

        49% {
          margin-left: 0;
          width: 100%;
        }
        50% {
          margin-left: auto;
          width: 100%;
        }

        to {
          margin-left: auto;
          width: 0px;
        }
    `;

const loaderAnimation = css`
  animation: ${loaderKeyframes} 10s ease-out infinite 0.25s;
  animation-fill-mode: forwards;
  animation-direction: normal;
`;
