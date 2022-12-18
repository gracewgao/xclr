import React from "react";

export interface Star {
  clr: number[];
  img: number;
  coors: number[];
  size: number;
  angle: number;
}

const stars = [];

export const StarSvg = (props: Star) => {
  return props.img == 1 ? (
    <svg
      width={`${props.size}px`}
      viewBox="0 0 63 67"
      fill={`rgb(${props.clr.join(",")})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M29.4624 0.111803L23.9188 24.5104L0.971121 26.0258L20.9247 39.6853L23.5108 66.6705L36.1575 48.1157L59.5816 56.2134L48.4555 34.7541L62.458 20.0711L40.3283 18.7646L29.4624 0.111803Z"
        fill="current"
      />
    </svg>
  ) : (
    <svg
      width={`${props.size}px`}
      viewBox="0 0 58 57"
      fill={`rgb(${props.clr.join(",")})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M57.907 18.3868L34.988 18.3868L23.7714 0.552902L17.8124 23.9883L0.633186 29.8714L15.1388 41.1919L15.1388 56.2355L31.9163 48.1408L50.521 56.2355L44.1326 35.0077L57.907 18.3868Z"
        fill="current"
      />
    </svg>
  );
};
