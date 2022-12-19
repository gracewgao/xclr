import React from "react";
import styled from "styled-components";

interface IClrCellProps {
  rgb: number[];
  size: number;
  isHidden?: boolean;
}

const ClrCell: React.FC<IClrCellProps & React.HTMLAttributes<HTMLElement>> = ({
  ...props
}) => {
  return <Cell {...props}>{props.isHidden ? "?" : props.children}</Cell>;
};

const Cell = styled.div.attrs<IClrCellProps>(({ isHidden, rgb, size }) => ({
  style: {
    backgroundColor: isHidden ? `rgb(255, 255, 255)` : `rgb(${rgb.join(",")})`,
    width: `${size}px`,
    height: `${size}px`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "50px",
  },
}))``;

export default ClrCell;
