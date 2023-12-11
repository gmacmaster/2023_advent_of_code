const fs = require("fs");

const getItems = async () => {
    const file = await fs.readFileSync('/Users/gordonmacmaster/Documents/Projects/2023AdventCode/2023adventofcode/day11/data.txt', 'utf8');
    return file.split('\n')
}

const getColumns = async (rows) => {
    const result = [];
    for (const row of rows) {
        if (row.length > 0) {
            result.push(row.split(''))
        }
    }
    return result;
}

const locateGalaxies = map => {
    const result = {
        rows: [],
        cols: [],
        galaxies: []
    }
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            if (map[row][col] === '#') {
                result.galaxies.push(`${row},${col}`);
                if (!result.rows.includes(row)) {
                    result.rows.push(row);
                }
                if (!result.cols.includes(col)) {
                    result.cols.push(col);
                }
            }
        }
    }
    result.rows.sort((a, b) => a - b);
    result.cols.sort((a, b) => a - b);
    return result;
}

const insertExtraRow = (map) => {
    const row = [];
    for (let col = 0; col < map[0].length; col++) {
        row.push('.')
    }
    return row;
}

const calculateDistanceBetweenGalaxies = (galaxy1, galaxy2) => {
    const [row1, col1] = galaxy1.split(',').map(x => parseInt(x));
    const [row2, col2] = galaxy2.split(',').map(x => parseInt(x));
    const leg1 = Math.abs(row1 - row2);
    const leg2 = Math.abs(col2 - col1);
    return leg1 + leg2
}

const calculateDistanceBetweenGalaxiesWithDistance = (galaxy1, galaxy2, emptyRows, emptyCols, distance) => {
    const [row1, col1] = galaxy1.split(',').map(x => parseInt(x));
    const [row2, col2] = galaxy2.split(',').map(x => parseInt(x));
    const yDistance = row2 - row1;
    const xDistance = col2 - col1;
    let xDistanceTotal = 0;
    let yDistanceTotal = 0;
    if (xDistance < 0) {
        for (let i = col1-1; i >= col2; i--) {
            if (emptyCols.includes(i)) {
                xDistanceTotal += distance;
            } else {
                xDistanceTotal++;
            }
        }
    } else {
        for (let i = col1; i < col2; i++) {
            if (emptyCols.includes(i)) {
                xDistanceTotal += distance;
            } else {
                xDistanceTotal++;
            }
        }
    }
    if (yDistance < 0) {
        for (let i = row1-1; i >= row2; i--) {
            if (emptyRows.includes(i)) {
                yDistanceTotal += distance;
            } else {
                yDistanceTotal++;
            }
        }
    } else {
        for (let i = row1; i < row2; i++) {
            if (emptyRows.includes(i)) {
                yDistanceTotal += distance;
            } else {
                yDistanceTotal++;
            }
        }
    }

    return xDistanceTotal + yDistanceTotal
}

const part1 = async () => {
    const rows = await getItems()
    console.time('part1')
    let map = await getColumns(rows)
    const locations = locateGalaxies(map)
    const numRows = map.length;
    const numCols = map[0].length;
    for (let i = numCols - 1; i >= 0; i--) {
        if (!locations.cols.includes(i)) {
            for (let row = 0; row < map.length; row++) {
                const currentRow = map[row];
                map[row] = [...currentRow.slice(0, i + 1), '.', ...currentRow.slice(i + 1)];
            }
        }
    }
    const newMap = [];
    for (let i = 0; i < numRows; i++) {
        newMap.push(map[i])
        if (!locations.rows.includes(i)) {
            newMap.push(insertExtraRow(map))
        }
    }
    const realLocations = locateGalaxies(newMap)
    let sum = 0;
    for (let i = 0; i < realLocations.galaxies.length; i++) {
        for (let j = i + 1; j < realLocations.galaxies.length; j++) {
            sum += calculateDistanceBetweenGalaxies(realLocations.galaxies[i], realLocations.galaxies[j])
        }
    }
    console.timeEnd('part1')
    console.log('Part 1: ', sum)
}

const part2 = async (distance) => {
    const rows = await getItems()
    console.time('part2')
    let map = await getColumns(rows)
    const locations = locateGalaxies(map)
    const numRows = map.length;
    const numCols = map[0].length;
    const emptyRows = [];
    const emptyCols = [];
    for (let i = 0; i < numRows; i++) {
        if (!locations.rows.includes(i)) {
            emptyRows.push(i)
        }
    }
    for (let i = 0; i < numCols; i++) {
        if (!locations.cols.includes(i)) {
            emptyCols.push(i)
        }
    }
    let sum = 0;
    for (let i = 0; i < locations.galaxies.length; i++) {
        for (let j = i + 1; j < locations.galaxies.length; j++) {
            sum += calculateDistanceBetweenGalaxiesWithDistance(locations.galaxies[i], locations.galaxies[j], emptyRows, emptyCols, distance)
        }
    }
    console.timeEnd('part2')
    console.log('Part 2: ', sum)
}

part1();
part2(1000000);
