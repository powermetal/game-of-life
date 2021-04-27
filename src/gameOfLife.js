import * as R from 'ramda'

const getNeighbors = ([x, y]) => {
    return [
        [x - 1, y + 1],
        [x - 1, y],
        [x - 1, y - 1],
        [x, y + 1],
        [x + 1, y + 1],
        [x + 1, y],
        [x + 1, y - 1],
        [x, y - 1]
    ]
}

const countNeighbors = (cellsAlive, candidate) => {
    return R.intersection(cellsAlive, getNeighbors(candidate)).length
}

export const evolve = (cells) => {
    const neighbors = cells.map(cell => getNeighbors(cell)).reduce((acc, neighbors) => {
        return R.union(acc, neighbors)
    }, [])

    return neighbors.reduce((acc, candidate) => {
        const neighborCount = countNeighbors(cells, candidate)

        if (neighborCount === 3 || (neighborCount === 2 && R.includes(candidate, cells)))
            acc.push(candidate)
        return acc
    }, [])
}

export const parse = (s, offset = 0) => {
    return R.unnest(s.split('\n')
        .map((line, y) => line.trim().split('').map((c, x) => c === 'O' ? [x + offset, y + offset] : null)))
        .filter(c => c !== null)
}