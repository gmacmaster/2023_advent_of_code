const fs = require("fs");

const getItems = async () => {
    const file = await fs.readFileSync('/Users/gordonmacmaster/Documents/Projects/2023AdventCode/2023adventofcode/day1/data.txt', 'utf8');
    return file.split('\n')
}

const numMap = {
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '0': 0,
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'zero': 0
}

const getFirstDigit = (word) => {
    let lowestIndex = 999999;
    let lowestDigit;
    for (const num of Object.keys(numMap)) {
        const index = word.indexOf(num)
        if (index !== -1 && index < lowestIndex) {
            lowestDigit = num;
            lowestIndex = index
        }
    }
    return numMap[lowestDigit]
}

const getLastDigit = (word) => {
    let foundIndex = -1;
    let highestDigit;
    for (const num of Object.keys(numMap)) {
        const index = word.lastIndexOf(num)
        if (index !== -1 && index > foundIndex) {
            highestDigit = num;
            foundIndex = index
        }
    }
    return numMap[highestDigit]
}

const main = async () => {
    const items = (await getItems())
    let total =0;
    for (const word of items) {
        if (word?.length) {
            const first = getFirstDigit(word)
            const last = getLastDigit(word)
            const combined = `${first}${last}`
            const parsed = parseInt(combined)
            if(!isNaN(parsed)){
                total +=parsed
            }
        }
    }
    console.log(total)
}

main();
