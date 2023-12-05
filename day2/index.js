const fs = require("fs");

const getItems = async () => {
    const file = await fs.readFileSync('/Users/gordonmacmaster/Documents/Projects/2023AdventCode/2023adventofcode/day2/data.txt', 'utf8');
    return file.split('\n')
}

const cubeNums = {
    'red': 12,
    'green': 13,
    'blue': 14,
}

const parseLines = (lines) => {
    const parsedLines = []
    for (const line of lines) {
        if(line?.length> 0){
            let gamePossible = true
            const split = line.split(':')
            const [game, setsString] = split
            const parsedGame = game.split(' ');
            const gameNum = parseInt(parsedGame[1]);
            const sets = setsString.trim().split(';')
            for(const set of sets){
                const trimmedSet = set.trim();
                const pulls = trimmedSet.split(',').map(p=>p.trim());
                for(const pull of pulls){
                    const [num, color] = pull.split(' ')
                    const parsedNum = parseInt(num)
                    const isPossible = parsedNum<=cubeNums[color]
                    if(!isPossible){
                        gamePossible = false
                    }
                }
            }
            if(gamePossible){
                parsedLines.push(gameNum)
            }
        }
    }
    return parsedLines
}

const getPower = (lines) => {
    const parsedLines = []
    for (const line of lines) {
        if(line?.length> 0){
            const split = line.split(':')
            const [game, setsString] = split
            const sets = setsString.trim().split(';')
            const minNums = {
                'red': 0,
                'green': 0,
                'blue': 0,
            }
            for(const set of sets){
                const trimmedSet = set.trim();
                const pulls = trimmedSet.split(',').map(p=>p.trim());
                for(const pull of pulls){
                    const [num, color] = pull.split(' ')
                    const parsedNum = parseInt(num)
                    if(parsedNum>minNums[color]){
                        minNums[color] = parsedNum
                    }
                }
            }
            const power = minNums.red*minNums.green*minNums.blue
            parsedLines.push(power)
        }
    }
    return parsedLines
}

const part1 = async () => {
    const items = await getItems()
    const parsedItems = parseLines(items)
    const total = parsedItems.reduce((acc, curr)=>acc+curr, 0)
    console.log('Total', total)
}
const part2 = async () => {
    const items = await getItems()
    const parsedItems = getPower(items)
    const total = parsedItems.reduce((acc, curr)=>acc+curr, 0)
    console.log('Total', total)
}

part1();
part2();
