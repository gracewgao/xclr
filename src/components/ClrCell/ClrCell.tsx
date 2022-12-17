import React, { useState } from "react";
import styled from "styled-components";

interface IClrCellProps {
  rgb: number[];
  size: number;
  isHidden: boolean;
}

const ClrCell: React.FC<IClrCellProps & React.HTMLAttributes<HTMLElement>> = ({
  //   rgb,
  //   size,
  //   isHidden,
  ...props
}) => {
  return (
    <Cell
      //   rgb={rgb} size={size} isHidden={isHidden}
      {...props}
    >
      {props.isHidden ? "?" : ""}
    </Cell>
  );
};

const Cell = styled.div<IClrCellProps>`
  background-color: ${(props: IClrCellProps) =>
    props.isHidden ? `rgb(255, 255, 255)` : `rgb(${props.rgb.join(",")})`};
  width: ${(props: IClrCellProps) => props.size}px;
  height: ${(props: IClrCellProps) => props.size}px;
`;

export default ClrCell;
