import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer'
import './board.css';
import * as R from 'ramda'
import { evolve, parse } from './gameOfLife';

const Board = () => {

    const numRows = 30
    const numCols = 30

    const makeGrid = () => {
        const rows = [];
        for (let i = 0; i < numRows; i++) {
            rows.push(Array.from(Array(numCols), () => 0))
        }

        return rows
    }

    const [state, setState] = useState(() => {
        return { grid: makeGrid(), alive: [] }
    })

    const [pattern, setPattern] = useState('')

    const [running, setRunning] = useState(false)

    const nextState = (prevState) => {
        const alive = evolve(prevState.alive)
        const grid = makeGrid()
        alive.forEach(([cx, cy]) => {
            if (cx >= 0 && cy >= 0)
                grid[cx][cy] = 1
        })
        return {
            alive: alive,
            grid: grid
        }
    }

    const makeGridFromPattern = (cells) => {
        const alive = cells
        const grid = makeGrid()
        alive.forEach(([cx, cy]) => {
            if (cx >= 0 && cy >= 0)
                grid[cx][cy] = 1
        })
        return {
            alive: alive,
            grid: grid
        }
    }

    const runningRef = useRef(running)
    runningRef.current = running

    const runSimulation = useCallback(() => {
        if (!runningRef.current)
            return
        setState(prevState => nextState(prevState))
        setTimeout(runSimulation, 100)
    }, [])

    const onSubmit = (e) => {
        e.preventDefault()
        setState(makeGridFromPattern(parse(pattern, 7)))
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '2rem' }}>
                <button style={{ padding: '1rem' }} onClick={() => {
                    setRunning(!running)
                    if (!running) {
                        runningRef.current = true
                        runSimulation()
                    }
                }}>
                    {running ? 'stop' : 'start'}
                </button>
                <form style={{ display: 'flex', flexDirection: 'column' }}>
                    <textarea placeHolder="Paste your pattern here or draw it in the board" style={{ height: '300px', width: '300px' }} onChange={e => setPattern(e.target.value)}></textarea>
                    <button style={{ padding: '1rem' }} onClick={onSubmit}>Submit</button>
                </form>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${numCols}, 30px)` }}>
                {state.grid.map((rows, x) =>
                    rows.map((col, y) =>
                        <div
                            key={`${x}:${y}`}
                            onClick={() => {
                                const newState = produce(state, stateCopy => {
                                    stateCopy.grid[x][y] = stateCopy.grid[x][y] === 1 ? 0 : 1
                                    stateCopy.alive = stateCopy.alive.find(cell => cell[0] === x && cell[1] === y) ? R.without([[x, y]], stateCopy.alive) : R.append([x, y], stateCopy.alive)
                                })
                                setState(newState)
                            }}
                            style={{ width: 30, height: 30, backgroundColor: state.grid[x][y] ? 'black' : 'white', border: 'solid 1px black' }}
                        />
                    )
                )}
            </div>
        </div>
    )
}

export default Board
