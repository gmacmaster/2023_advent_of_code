const fs = require("fs");

const getLines = async () => {
    const file = await fs.readFileSync('/Users/gordonmacmaster/Documents/Projects/2023AdventCode/2023adventofcode/day10/data.txt', 'utf8');
    return file.split('\n')
}

const getMap = lines => {
    const map = []
    lines.forEach(line => {
        if (line !== '') {
            map.push(line.split(''))
        }
    })
    return map
}

const getConnected = (map, xString, yString, numX, numY) => {
    const x = parseInt(xString)
    const y = parseInt(yString)
    const value = map[y][x];
    const temp = []
    switch (value) {
        case '.':
            return temp;
        case '|':
            // check up and down
            if (y > 0) {
                temp.push(`${x},${y - 1}`)
            }
            if (y < numY) {
                temp.push(`${x},${y + 1}`)
            }
            return temp;
        case '-':
            // check left and right
            if (x > 0) {
                temp.push(`${x - 1},${y}`)
            }
            if (x < numX) {
                temp.push(`${x + 1},${y}`)
            }
            return temp;
        case 'L':
            // check 90 bend up and right. (x,y-1) and (x+1,y)
            if (y > 0) {
                temp.push(`${x},${y - 1}`)
            }
            if (x < numX) {
                temp.push(`${x + 1},${y}`)
            }
            return temp;
        case 'J':
            // check 90 bend up and left. (x,y-1) and (x-1,y)
            if (y > 0) {
                temp.push(`${x},${y - 1}`)
            }
            if (x > 0) {
                temp.push(`${x - 1},${y}`)
            }
            return temp;
        case '7':
            // check 90 bend down and left. (x,y+1) and (x-1,y)
            if (y < numY) {
                temp.push(`${x},${y + 1}`)
            }
            if (x > 0) {
                temp.push(`${x - 1},${y}`)
            }
            return temp;
        case 'F':
            // check 90 bend down and right. (x,y+1) and (x+1,y)
            if (y < numY) {
                temp.push(`${x},${y + 1}`)
            }
            if (x < numX) {
                temp.push(`${x + 1},${y}`)
            }
            return temp;
        default:
            return temp;
    }
}

const getStartingPoint = map => {
    for (const y in map) {
        for (const x in map[y]) {
            if (map[y][x] === 'S') {
                return `${x},${y}`
            }
        }
    }
}

const getPointsConnectedToPoint = (connectedGraph, pointString) => {
    const points = []
    for (const point in connectedGraph) {
        if (connectedGraph[point].connected.includes(pointString)) {
            points.push(point)
        }
    }
    return points
}

const getNextDirection = (value, currDirection) => {
    switch (value) {
        case 'L':
            return value === 'east' ? 'north' : 'east';
        case 'J':
            return value === 'east' ? 'north' : 'west';
        case '7':
            return value === 'north' ? 'west' : 'south';
        case 'F':
            return value === 'north' ? 'east' : 'south';
        default:
            return currDirection;
    }
}

const getPointToRight = (connectedGraph, point, currDirection) => {
    const split = point.split(',')
    const x = parseInt(split[0])
    const y = parseInt(split[1]);
    let newX = x;
    let newY = y;
    switch (currDirection) {
        case 'north':
            newX = x + 1;
            break;
        case 'east':
            newY = y + 1;
            break;
        case 'south':
            newX = x - 1;
            break;
        case 'west':
            newY = y - 1;
            break;
        default:
            break
    }
    return connectedGraph[`${newX},${newY}`]
}

const followConnectedPathBackToStart = (connectedGraph, point, currDistance, enclosedPoints, currentDirection) => {
    const currPoint = connectedGraph[point]
    const pointToRight = getPointToRight(connectedGraph, point, currentDirection)
    console.log('\n\n\n-----')
    console.log('currPoint,', currPoint, currentDirection)
    console.log('pointToRight,', pointToRight)
    console.log(enclosedPoints)
    if(pointToRight.value === '.' && !enclosedPoints.includes(pointToRight.key)) {
        console.log(pointToRight)
        console.log('adding ', pointToRight.key, ' to enclosedPoints', currentDirection)
        enclosedPoints.push(pointToRight.key)
    }
    for (const p of currPoint.connected) {
        const temp = connectedGraph[p]
        if (!temp.visited && !temp.isStart) {
            temp.visited = true
            const nextDirection = getNextDirection(temp.value, currentDirection)
            followConnectedPathBackToStart(connectedGraph, p, currDistance + 1, enclosedPoints, nextDirection)
        }
    }
}

const part1 = async () => {
    const lines = await getLines()
    console.time('part1')
    const map = getMap(lines)
    const connectedGraph = {};
    const startingPoint = getStartingPoint(map)
    const numX = map[0].length
    const numY = map.length
    for (const y in map) {
        for (const x in map[y]) {
            connectedGraph[`${x},${y}`] = {
                connected: getConnected(map, x, y, numX, numY),
                value: map[y][x],
                key: `${x},${y}`
            }
        }
    }
    const pointsConnectedToStart = getPointsConnectedToPoint(connectedGraph, startingPoint)
    connectedGraph[startingPoint] = {
        connected: pointsConnectedToStart,
        value: 'S',
        distanceFromStart: 0,
    }
    followConnectedPath(connectedGraph, startingPoint, 0)
    let maxPointsFromStart = 0;
    for (const point in connectedGraph) {
        if (connectedGraph[point].distanceFromStart > maxPointsFromStart) {
            maxPointsFromStart = connectedGraph[point].distanceFromStart
        }
    }
    console.timeEnd('part1')
    console.log(`Part 1: ${maxPointsFromStart}`)
}

const followConnectedPath = (connectedGraph, point, currDistance) => {
    const currPoint = connectedGraph[point]
    for (const p of currPoint.connected) {
        const temp = connectedGraph[p]
        if (!temp.distanceFromStart || temp.distanceFromStart > currDistance) {
            temp.distanceFromStart = currDistance + 1
            followConnectedPath(connectedGraph, p, currDistance + 1)
        }
    }
}

const part2 = async () => {
    const lines = await getLines()
    console.time('part2')
    const map = getMap(lines)
    const connectedGraph = {};
    const startingPoint = getStartingPoint(map)
    const numX = map[0].length
    const numY = map.length
    for (const y in map) {
        for (const x in map[y]) {
            connectedGraph[`${x},${y}`] = {
                connected: getConnected(map, x, y, numX, numY),
                value: map[y][x],
                visited: false,
                key: `${x},${y}`
            }
        }
    }
    const pointsConnectedToStart = getPointsConnectedToPoint(connectedGraph, startingPoint)
    connectedGraph[startingPoint] = {
        key: startingPoint,
        connected: pointsConnectedToStart,
        value: 'S',
        distanceFromStart: 0,
        visited: true,
        isStart: true,
    }
    const enclosedPoints = []
    const currentDirection = 'east';
    followConnectedPathBackToStart(connectedGraph, connectedGraph[startingPoint].connected[0], 0, enclosedPoints, currentDirection)
    let maxPointsFromStart = 0;
    for (const point in connectedGraph) {
        if (connectedGraph[point].distanceFromStart > maxPointsFromStart) {
            maxPointsFromStart = connectedGraph[point].distanceFromStart
        }
    }
    console.log(enclosedPoints)
    console.timeEnd('part2')
    console.log(`Part 2: ${maxPointsFromStart}`)
}

//part1();
part2()
