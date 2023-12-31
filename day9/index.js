const fs = require("fs");

const getInput = async () => {
    const file = await fs.readFileSync('/Users/gordonmacmaster/Documents/Projects/2023AdventCode/2023adventofcode/day9/data.txt', 'utf8');
    return file.split('\n')
}

const getHistory = (input) => {
    const history = []
    for (const line of input) {
        if (line === '') continue;
        const split = line.split(' ')
        const splitNums = split.map(i => parseInt(i))
        history.push(splitNums)
    }
    return history
}

const arrayHasAllSameValues = (arr) => {
    const first = arr[0];
    for (const num of arr) {
        if (num !== first) return false;
    }
    return true;
}

const calculateNextNumber = (history) => {
    const diffs = []
    let i = 0;
    for (i; i < history.length - 1; i++) {
        const nextNum = history[i + 1]
        const curNum = history[i]
        const diff = nextNum - curNum;
        diffs.push(diff)
    }
    const diffsAreSame = arrayHasAllSameValues(diffs)
    if (diffsAreSame) {
        return history[history.length - 1] + diffs[0]
    }
    const nextLastItem = calculateNextNumber(diffs)
    return nextLastItem + history[history.length - 1]
}


const run = async () => {
    const input = await getInput()
    const history = getHistory(input)
    console.log('Part 1:')
    console.time('part1')
    const part1Nums = history.map(line => calculateNextNumber(line))
    const sumPart1 = part1Nums.reduce((a, b) => a + b, 0)
    console.timeEnd('part1')
    console.log('Part 1 result: ', sumPart1)

    console.log('\nPart 2:')
    console.time('part2')
    const part2Nums = history.map(line => calculateNextNumber(line.reverse()))
    const sumPart2 = part2Nums.reduce((a, b) => a + b, 0)
    console.timeEnd('part2')
    console.log('Part 2 result: ', sumPart2)
}

run();
