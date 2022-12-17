import React from 'react'
import styled from "styled-components";

export const Flex = styled.div<{ justify?: string}>`
    display: flex;
    flex-direction: column;
    justify-content: ${(props) => props.justify ? props.justify : "center"};
    align-items: center
`