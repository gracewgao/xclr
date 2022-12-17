import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ClrCell from "./components/ClrCell/ClrCell";
const GRID_SIZE = 5;
const CELL_SIZE = 80;

interface Selection {
  clr: number[];
  index?: number;
}

const shuffle = (arr: Selection[]): void => {
  const ret = arr;
  for (let i = 0; i < arr.length; ++i) {
    const j = Math.floor(Math.random() * arr.length);
    const t = ret[i];
    ret[i] = ret[j];
    ret[j] = t;
  }
};

const randomClr = () =>
  [...Array(3)].map((i) => Math.floor(50 + Math.random() * 205));

const averageClr = (a: number[], b: number[]): number[] => {
  return a.map((val, i) => (val + b[i]) / 2);
};

const generateDupeClr = (real: number[], diff: number): number[] => {
  const res = real.map((val, i) => val + (-diff + Math.random() * diff * 2));
  return res;
};

const randomCoor = (): number[] => {
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

  const [hiddenCoors, setHiddenCoors] = useState<number[][]>([randomCoor()]);
  const [curCoors, setCurCoors] = useState([-1, -1]);
  const [isRevealMode, setIsRevealMode] = useState(false);
  const [selections, setSelections] = useState<Selection[]>([]);
  const [score, setScore] = useState(4);

  const resetGrid = () => {
    setRowClrs([...Array(GRID_SIZE)].map(() => randomClr()));
    setColClrs([...Array(GRID_SIZE)].map(() => randomClr()));
    setHiddenCoors([randomCoor()]);
  };

  useEffect(() => {
    const newSelections: Selection[] = [
      {
        index: 0,
        clr: averageClr(rowClrs[hiddenCoors[0][0]], colClrs[hiddenCoors[0][1]]),
      },
    ];

    for (let i = 0; i < score / 2 + 1; i++) {
      const sel: Selection = {
        clr: generateDupeClr(newSelections[0].clr, 50),
      };
      newSelections.push(sel);
    }
    shuffle(newSelections);
    setSelections(newSelections);
  }, [hiddenCoors]);

  useEffect(() => {
    resetGrid();
  }, [score]);

  useEffect(() => {
    const handleTabKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        event.preventDefault();
        if (score === 0) {
          console.log("come on now");
        }
        setScore(0);
      }
    };
    document.addEventListener("keydown", handleTabKeyDown);
    return () => {
      document.removeEventListener("keydown", handleTabKeyDown);
    };
  }, []);

  return (
    <Page score={score}>
      <TitleRow>
        <Title>xclr</Title>
        <Column>
          <Link href="https://www.github.com/gracewgao/xclr">grace</Link>
          <Link href="https://www.github.com/harrchiu">harrison</Link>
        </Column>
      </TitleRow>
      <InfoRow>
        <StyledButton
          onClick={() => {
            setIsRevealMode(!isRevealMode);
          }}
        >
          {isRevealMode ? "hide hint" : "show hint"}
        </StyledButton>
        <ScoreText>Score: {score}</ScoreText>
      </InfoRow>
      <Column>
        {rowClrs.map((rClr, rId) => {
          return (
            <Row>
              {colClrs.map((cClr, cId) => {
                const isHidden =
                  hiddenCoors.findIndex(
                    (arr) => arr[0] === rId && arr[1] === cId
                  ) != -1;

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
                    key={`${rId}-${cId}`}
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
      <GuessSection>
        {selections.map((sel: Selection, id) => {
          return (
            <ClrCell
              key={`sel-${id}`}
              onClick={() => {
                if (sel.index === undefined) {
                  if (score === 0) {
                    resetGrid();
                  }
                  setScore(0);
                  return;
                }
                setScore(score + 1);
              }}
              rgb={sel.clr}
              size={CELL_SIZE}
              style={{ cursor: "pointer" }}
            />
          );
        })}
      </GuessSection>
      {/* real:
      <ClrCell
        rgb={averageClr(rowClrs[hiddenCoors[0][0]], colClrs[hiddenCoors[0][1]])}
        size={CELL_SIZE}
      /> */}
    </Page>
  );
};

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const TitleRow = styled(Row)`
  margin: 0 0 10px 30px;
`;

const Link = styled.a`
  padding: 0;
  font-size: 12px;
`;

const Title = styled.div`
  font-size: 48px;
  font-weight: bold;
  margin-right: 5px;
`;

const ScoreText = styled.div`
  font-size: 20px;
`;

const StyledButton = styled.button`
  font-size: 15px;
  padding: 5px 20px;
  border: solid 1px #707070;
  border-shadow: none;
  background-color: transparent;
  cursor: pointer;
`;

const Page = styled(Column)<{ score: number }>`
  height: 100vh;
  width: 100vw;
  background-color: white;
  justify-content: center;
  align-items: center;
  background-image: ${(props) =>
    props.score > 4
      ? "url('https://www.iconpacks.net/icons/2/free-star-icon-2768-thumb.png')"
      : "none"};
`;

const InfoRow = styled(Row)`
  margin-bottom: 20px;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const GuessSection = styled(Row)`
  margin-top: 20px;
  gap: 5px;
  max-width: ${GRID_SIZE * CELL_SIZE}px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

export default App;
