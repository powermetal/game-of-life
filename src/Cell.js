import React from 'react'

const Cell = ({ cellSize, x, y }) => {
    return (
        <div className="Cell" style={{
            left: `${cellSize * x + 1}px`,
            top: `${cellSize * y + 1}px`,
            width: `${cellSize - 1}px`,
            height: `${cellSize - 1}px`,
            backgroundColor: "white",
            position: "absolute"
        }} />
    )
}

export default Cell
