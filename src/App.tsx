import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ClrCell from "./components/ClrCell/ClrCell";
import { BsCheck, BsX } from "react-icons/bs";
import { GrPowerReset } from "react-icons/gr";
import { Star, StarSvg } from "./components/Star";

const GRID_SIZE = 5;
const CELL_SIZE = 80;

interface Selection {
  clr: number[];
  index?: number;
  wasChosen?: boolean;
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

const newStar = (clr: number[]): Star => {
  return {
    clr: clr,
    img: Math.floor(Math.random() * 2),
    coors: [
      Math.floor(Math.random() * window.innerWidth),
      Math.floor(Math.random() * 100),
    ],
    size: 30 + Math.floor(Math.random() * 30),
    angle: Math.floor(Math.random() * 180),
  };
};

const App: React.FC = () => {
  const [rowClrs, setRowClrs] = useState(
    [...Array(GRID_SIZE)].map(() => randomClr())
  );
  const [colClrs, setColClrs] = useState(
    [...Array(GRID_SIZE)].map(() => randomClr())
  );
  const [hiddenCoors, setHiddenCoors] = useState<number[][]>([randomCoor()]);
  const [curCoors, setCurCoors] = useState([-1, -1]); // [r,c] for grid, [-1, index] for selections
  const [isRevealMode, setIsRevealMode] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selections, setSelections] = useState<Selection[]>([]);
  const [score, setScore] = useState(0);
  const [isLost, setIsLost] = useState(false);
  const [isResetTooltipVisible, setIsResetTooltipVisible] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);

  const resetGrid = () => {
    setRowClrs([...Array(GRID_SIZE)].map(() => randomClr()));
    setColClrs([...Array(GRID_SIZE)].map(() => randomClr()));
    setHiddenCoors([randomCoor()]);
    setIsLost(false);
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
        if (score === 0 && !isLost) {
          console.log("come on now");
        }
        setScore(0);
        setStars([]);
      }
    };
    document.addEventListener("keydown", handleTabKeyDown);
    return () => {
      document.removeEventListener("keydown", handleTabKeyDown);
    };
  }, [score, isLost]);

  // let tooltipTimeout: any;

  return (
    <Page>
      {stars.map((star) => {
        console.log(star.coors);
        return (
          <StarWrapper {...star}>
            <StarSvg {...star} />
          </StarWrapper>
        );
      })}
      <TitleRow>
        <Title>xclr</Title>
        <Column>
          <Link href="https://www.github.com/gracewgao/xclr">grace</Link>
          <Link href="https://www.github.com/harrchiu">harrison</Link>
        </Column>
      </TitleRow>
      <TopRow>
        <InfoRow>
          <StyledButton
            onClick={() => {
              setIsPreviewMode(!isPreviewMode);
            }}
          >
            {isPreviewMode ? "preview on" : "preview off"}
          </StyledButton>
          <StyledButton
            onClick={() => {
              setIsRevealMode(!isRevealMode);
            }}
          >
            {isRevealMode ? "hover hint on" : "hover hint off"}
          </StyledButton>
          <ScoreText>Score: {score}</ScoreText>
          <StyledReset
            onClick={() => {
              if (!score) {
                resetGrid();
              }
              setScore(0);
              setStars([]);
            }}
            onMouseEnter={() => {
              setIsResetTooltipVisible(true);
              // setTimeout(() => {
              //   setIsResetTooltipVisible(true);
              // }, 1000);
            }}
            onMouseLeave={() => {
              // clearTimeout(tooltipTimeout);
              setIsResetTooltipVisible(false);
            }}
          />
          <ResetTooltip show={isResetTooltipVisible}>
            press tab to restart
          </ResetTooltip>
        </InfoRow>
      </TopRow>

      <Column>
        {rowClrs.map((rClr, rId) => {
          return (
            <Row>
              {colClrs.map((cClr, cId) => {
                const isMissing =
                  hiddenCoors.findIndex(
                    (arr) => arr[0] === rId && arr[1] === cId
                  ) !== -1;

                let [shownRClr, shownCClr] = [rClr, cClr];
                if (isRevealMode && curCoors[0] !== -1 && curCoors[1] !== -1) {
                  if (rId === curCoors[0] && cId !== curCoors[1]) {
                    shownCClr = rClr;
                  } else if (rId !== curCoors[0] && cId === curCoors[1]) {
                    shownRClr = cClr;
                  }
                }

                const selectionId = curCoors[0] === -1 ? curCoors[1] : -1;
                const cellColor =
                  isMissing && isPreviewMode && selectionId !== -1
                    ? selections[selectionId].clr
                    : averageClr(shownRClr, shownCClr);

                return (
                  <ClrCell
                    key={`${rId}-${cId}`}
                    onMouseEnter={() => {
                      setCurCoors([rId, cId]);
                    }}
                    onMouseLeave={() => {
                      setCurCoors([-1, -1]);
                    }}
                    rgb={cellColor}
                    size={CELL_SIZE}
                    isHidden={
                      isMissing &&
                      !isLost &&
                      !(isPreviewMode && selectionId !== -1)
                    }
                  >
                    {isMissing && isLost && <BsCheck />}
                  </ClrCell>
                );
              })}
            </Row>
          );
        })}
      </Column>
      <GuessSection>
        {selections.map((sel: Selection, id) => {
          let content = null;
          if (isLost) {
            if (sel.index !== undefined) {
              content = <BsCheck />;
            } else if (sel.wasChosen) {
              content = <BsX />;
            }
          }
          return (
            <ClrCell
              key={`sel-${id}`}
              onClick={() => {
                if (isLost) {
                  return;
                }
                if (sel.index === undefined) {
                  setIsLost(true);
                  const sels = selections;
                  selections[id].wasChosen = true;
                  setSelections([...sels]);
                  return;
                }
                setScore(score + 1);
                setStars([...stars, newStar(sel.clr)]);
              }}
              rgb={sel.clr}
              size={CELL_SIZE}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => {
                setCurCoors([-1, id]);
              }}
              onMouseLeave={() => {
                setCurCoors([-1, -1]);
              }}
            >
              {content}
            </ClrCell>
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

const ResetTooltip = styled(Row)<{ show: boolean }>`
  display: ${(props) => (props.show ? "block" : "none")};
  justify-content: center;
  align-items: center;
  font-size: 16px;
  position: absolute;
  right: -150px;
`;

const StyledReset = styled(GrPowerReset)`
  font-size: 24px;
  padding: 5px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: #eeeeee;
    border-radius: 2px;
  }
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

const Page = styled(Column)`
  height: 100vh;
  width: 100vw;
  background-color: white;
  justify-content: center;
  align-items: center;
`;

const InfoRow = styled(Row)`
  margin-bottom: 20px;
  justify-content: center;
  align-items: center;
  gap: 20px;
  position: relative;
`;

const TopRow = styled.div`
  position: relative;
`;

const GuessSection = styled(Row)`
  margin-top: 20px;
  gap: 5px;
  max-width: ${GRID_SIZE * CELL_SIZE}px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const StarWrapper = styled.div<Star>`
  position: absolute;
  top: ${(props) => props.coors[1]}px;
  left: ${(props) => props.coors[0]}px;
  transform: rotate(${(props) => props.angle}deg);
`;

export default App;
