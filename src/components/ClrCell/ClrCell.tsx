import React, { useState } from "react";
import styled from "styled-components";
import Column from "../../App";

interface IClrCellProps {
  rgb: number[];
  size: number;
  isHidden?: boolean;
}

const ClrCell: React.FC<IClrCellProps & React.HTMLAttributes<HTMLElement>> = ({
  ...props
}) => {
  return <Cell {...props}>{props.isHidden ? "?" : ""}</Cell>;
};

const Cell = styled.div.attrs<IClrCellProps>((props) => ({
  style: {
    backgroundColor: props.isHidden
      ? `rgb(255, 255, 255)`
      : `rgb(${props.rgb.join(",")})`,
  },
}))`
  width: ${(props: IClrCellProps) => props.size}px;
  height: ${(props: IClrCellProps) => props.size}px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
`;

export default ClrCell;
