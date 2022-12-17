import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ClrCell from "./components/ClrCell/ClrCell";

const randomClr = () =>
  [...Array(3)].map((i) => Math.floor(50 + Math.random() * 205));

const GRID_SIZE = 5;
const CELL_SIZE = 80;

const averageClr = (a: number[], b: number[]): number[] => {
  return a.map((val, i) => (val + b[i]) / 2);
};

const randomCoor = (): [number, number] => {
  return [
    Math.floor(Math.random() * GRID_SIZE),
    Math.floor(Math.random() * GRID_SIZE),
  ];
};

const App = () => {
  const [rowClrs, setRowClrs] = useState(
    [...Array(GRID_SIZE)].map(() => randomClr())
  );
  const [colClrs, setColClrs] = useState(
    [...Array(GRID_SIZE)].map(() => randomClr())
  );

  const [hiddenCoors, setHiddenCoors] = useState<Set<[number, number]>>(
    new Set([randomCoor()])
  );
  const [curCoors, setCurCoors] = useState([-1, -1]);
  const [isRevealMode, setIsRevealMode] = useState(false);
  const [numSelections, setNumSelections] = useState(2);

  useEffect(() => {
    const handleTabKeyDown = (event: KeyboardEvent) => {
      console.log(event.key);
      if (event.key === "Tab") {
        event.preventDefault();
        setRowClrs([...Array(GRID_SIZE)].map(() => randomClr()));
        setColClrs([...Array(GRID_SIZE)].map(() => randomClr()));
      }
    };
    document.addEventListener("keydown", handleTabKeyDown);
  }, []);

  return (
    <Page>
      <StyledButton
        onClick={() => {
          setIsRevealMode(!isRevealMode);
        }}
      >
        click
      </StyledButton>
      <Grid>
        <Column>
          {rowClrs.map((rClr, rId) => {
            return (
              <Row>
                {colClrs.map((cClr, cId) => {
                  const isHidden = hiddenCoors.has([rId, cId]);
                  console.log(rId, cId, hiddenCoors, isHidden);
                  console.log("has", hiddenCoors.has([rId, cId]));

                  let [shownRClr, shownCClr] = [rClr, cClr];
                  if (isRevealMode) {
                    if (rId === curCoors[0] && cId !== curCoors[1]) {
                      shownCClr = rClr;
                    } else if (rId !== curCoors[0] && cId === curCoors[1]) {
                      shownRClr = cClr;
                    }
                  }
                  return (
                    <ClrCell
                      onMouseEnter={() => {
                        setCurCoors([rId, cId]);
                      }}
                      onMouseLeave={() => {
                        setCurCoors([-1, -1]);
                      }}
                      rgb={averageClr(shownRClr, shownCClr)}
                      size={CELL_SIZE}
                      isHidden={isHidden}
                    />
                  );
                })}
              </Row>
            );
          })}
        </Column>
      </Grid>
      <GuessSection>
        {/* {Array.from({ length: numSelections }).map(() => {})} */}
      </GuessSection>
    </Page>
  );
};

const StyledButton = styled.button`
  color: blue;
`;

const Page = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const GuessSection = styled(Row)`
  margin-top: 20px;
  gap: 5px;
`;

const Grid = styled.div``;

export default App;
