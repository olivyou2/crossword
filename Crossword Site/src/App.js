/* eslint-disable no-throw-literal */
import { useEffect, useRef, useState } from 'react';
import './App.css';
import { findIndex, inference, line } from "./lib/crossword"

class Grid {
  constructor() {
    this.gridMap = {};
    this.gridMap.width = 0;
    this.gridMap.height = 0;
    this.gridMap.default = undefined;
  }

  set(x, y, value) {
    if (x >= this.gridMap.width) {
      this.gridMap.width = x;
    }
    if (y >= this.gridMap.height) {
      this.gridMap.height = y;
    }

    this.gridMap[`${x}/${y}`] = value;
  }

  get(x, y) {
    if (x > this.gridMap.width) {
      throw `${x} is over than ${this.gridMap.width} {width}`;
    }

    if (y > this.gridMap.height) {
      throw `${y} is over than ${this.gridMap.height} {height}`;
    }

    if (this.gridMap[`${x}/${y}`]) {
      return this.gridMap[`${x}/${y}`];
    } else {
      return this.default;
    }
  }
}

/**
 * 
 * @param {line} routeLine
 * @param {Grid} grid
 * @param {number} px
 * @param {number} py
 * @param {boolean} horizonal
 */
function RenderLines(routeLine, grid, px, py, horizonal) {
  if (!grid) {
    grid = new Grid();
  }

  if (!px) px = 0;
  if (!py) py = 0;
  if (horizonal === undefined) horizonal = true;

  for (let i = 0; i < routeLine.length; i++) {
    const char = routeLine.word[i];
    const index = i;

    let x = px;
    let y = py;
    if (horizonal) {
      x += index;
    } else {
      y += index;
    }

    grid.set(x, y, {
      rootX: px,
      rootY: py,
      index: routeLine.index,
      horizonal: horizonal,
      wordIndex: index
    });

    for (const connection of routeLine.connection) {
      if (connection.from === index) {
        RenderLines(connection.vline, grid, x - (horizonal ? 0 : connection.to), y - (horizonal ? connection.to : 0), !horizonal);
      }
    }
  }
}

function App() {
  const canvasRef = useRef();

  const [rootLine, setRootLine] = useState(new line(7, 0));
  const [refreshCounter, setRefresh] = useState(1);

  const [gridState, setGrid] = useState(new Grid());
  const [functions, setFunctions] = useState({});
  const [indexCounter, setIndexCounter] = useState(1);

  const refresh = () => {
    setRefresh(refreshCounter + 1);
  }

  const increaseCounter = () => {
    setIndexCounter(indexCounter + 1);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const grid = new Grid();

    RenderLines(rootLine, grid, 0, 0, false);
    setGrid(grid);

    const ctx = canvasRef.current.getContext('2d');

    for (const key of Object.keys(grid.gridMap)) {
      if (key !== "default" && key !== "width" && key !== "height") {
        const split = key.split('/');
        const x = split[0];
        const y = split[1];

        ctx.strokeRect(x * 32 + 64, y * 32 + 64, 32, 32);

        const index = grid.gridMap[key].index;
        const wordIndex = grid.gridMap[key].wordIndex;

        const line = findIndex(rootLine, index);
        const char = line.word[wordIndex];
        if (char) {
          ctx.font = "24px serif"
          ctx.textAlign = "center"
          ctx.fillText(char, x * 32 + 64 + 16, y * 32 + 64 + 22);
        }
      }
    }

  }, [rootLine, refreshCounter]);

  const clickListener = (e) => {
    const xIndex = Math.floor((e.clientX - 64) / 32);
    const yIndex = Math.floor((e.clientY - 64) / 32);

    const info = gridState.get(xIndex, yIndex);
    if (info) {
      const index = info.index;

      const findLine = findIndex(rootLine, index);

      const lengthStr = prompt("몇 글자 입니까");
      const toIndexStr = prompt("몇 번째 글자와 대치됩니까?");

      /*
      const lengthStr = "5";
      const toIndexStr = "0";
      */

      if (!isNaN(lengthStr) && !isNaN(toIndexStr)) {
        const length = parseInt(lengthStr);
        const toIndex = parseInt(toIndexStr);

        let index = 0;

        if (info.horizonal) {
          const dx = xIndex - info.rootX;

          index = dx;
        } else {
          const dy = yIndex - info.rootY;

          index = dy;
        }

        const newLine = new line(length, indexCounter);
        increaseCounter();

        findLine.add(newLine, index, toIndex);
        setRootLine(rootLine);
        refresh();
      } else {
        alert("숫자만 입력하시오..");
      }
    }
  }

  const pressListener = (e) => {
    if (e.key === "i") {
      const raw = prompt("로우");
      const json = JSON.parse(raw);

      for (const word of json) {
        if (rootLine.length === word.length) {
          rootLine.word = word;

          const result = inference(json, rootLine);
          setRootLine(rootLine);
        }
      }
      refresh();
    }
  };

  useEffect(() => {
    window.removeEventListener("click", functions.clickListener);
    window.removeEventListener("keydown", functions.pressListener);

    setFunctions({
      ...functions,
      clickListener,
      pressListener
    });

    window.addEventListener("click", clickListener);
    window.addEventListener("keydown", pressListener);
  }, [gridState]);

  return (
    <div className="App">
      <div>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default App;
