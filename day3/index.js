const fs = require("fs");

const getItems = async () => {
    const file = await fs.readFileSync('/Users/gordonmacmaster/Documents/Projects/2023AdventCode/2023adventofcode/day3/data.txt', 'utf8');
    return file.split('\n')
}

const isNumber = /^[0-9]+$/;

const isNextToSymbol = (index, lineIndex, symbolLocations, numLines, lineLength, obj={}, num) => {
    let isNextToSymbol = false;
    let locationsToCheck = [];
    if (lineIndex > 0) {
        locationsToCheck.push(`${lineIndex - 1},${index}`);
        if (index > 0) {
            locationsToCheck.push(`${lineIndex - 1},${index - 1}`);
        }
        if (index < lineLength) {
            locationsToCheck.push(`${lineIndex - 1},${index + 1}`);
        }
    }
    if (lineIndex < numLines) {
        locationsToCheck.push(`${lineIndex + 1},${index}`);
        if (index > 0) {
            locationsToCheck.push(`${lineIndex + 1},${index - 1}`);
        }
        if (index < lineLength) {
            locationsToCheck.push(`${lineIndex + 1},${index + 1}`);
        }
    }
    if (index > 0) {
        locationsToCheck.push(`${lineIndex},${index - 1}`);
    }
    if (index < lineLength) {
        locationsToCheck.push(`${lineIndex},${index + 1}`);
    }
    for (const loc of locationsToCheck) {
        if (symbolLocations.includes(loc)) {
            isNextToSymbol = true;
            if(obj[loc] && !obj[loc].includes(num)) {
                console.log('here')
                obj[loc].push(num)
            }
            break;
        }
    }


    return isNextToSymbol;
}

const main = async () => {
    const items = await getItems()
    const engineMap = [];
    const symbolLocations = []
    for (const index in items) {
        const item = items[index];
        if (item.length > 0) {
            const temp = [];
            for (const ind in item) {
                const i = item[ind];
                temp.push(i);
                if (!i.match(isNumber) && i !== '.') {
                    symbolLocations.push(`${index},${ind}`);
                }
            }
            engineMap.push(temp);
        }
    }

    let numberResult = []
    let missingNumbers = []
    for (const lineIndex in engineMap) {
        const line = engineMap[lineIndex];
        //const result = {};
        const results = [];
        let currentNumber = '';

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (!isNaN(Number(char))) {
                let currentNumber = char;
                let currentIndex = i;
                while (!isNaN(Number(line[i + 1]))) {
                    currentNumber += line[i + 1];
                    i++;
                }
                results.push({[currentNumber]:currentIndex})
            }
        }
        for (const temp of results) {
            for (const item in temp) {
                const numDigits = item.length;
                const firstDigit = temp[item];
                const newResult = [];
                for (let i = 0; i < numDigits; i++) {
                    newResult.push(firstDigit + i);
                }
                temp[item] = newResult;
            }
        }
        for(const temp of results){
            for (const number in temp) {
                const numberIndexes = temp[number];
                let numNextToSymbol = false;
                for (const index of numberIndexes) {
                    const nextToSymbol = isNextToSymbol(index, parseInt(lineIndex), symbolLocations, engineMap.length, line.length);
                    if (nextToSymbol) {
                        numNextToSymbol = true;
                    }
                }
                if (numNextToSymbol) {
                    numberResult.push(parseInt(number));
                } else {
                    missingNumbers.push(parseInt(number));
                }
            }
        }
    }
   // console.log(numberResult)
    //console.log(missingNumbers)
    const total = numberResult.reduce((a, b) => a + b, 0);
    console.log('Total', total)
}

const part2 = async () => {
    const items = await getItems()
    const engineMap = [];
    const symbolLocations = []
    const gearAdjacentNumbers = {}
    for (const index in items) {
        const item = items[index];
        if (item.length > 0) {
            const temp = [];
            for (const ind in item) {
                const i = item[ind];
                temp.push(i);
                if (i === '*') {
                    symbolLocations.push(`${index},${ind}`);
                    gearAdjacentNumbers[`${index},${ind}`] = []
                }
            }
            engineMap.push(temp);
        }
    }
    console.log(gearAdjacentNumbers)
    console.log(symbolLocations)

    let numberResult = []
    let missingNumbers = []
    for (const lineIndex in engineMap) {
        const line = engineMap[lineIndex];
        //const result = {};
        const results = [];
        let currentNumber = '';

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (!isNaN(Number(char))) {
                let currentNumber = char;
                let currentIndex = i;
                while (!isNaN(Number(line[i + 1]))) {
                    currentNumber += line[i + 1];
                    i++;
                }
                results.push({[currentNumber]:currentIndex})
            }
        }
        for (const temp of results) {
            for (const item in temp) {
                const numDigits = item.length;
                const firstDigit = temp[item];
                const newResult = [];
                for (let i = 0; i < numDigits; i++) {
                    newResult.push(firstDigit + i);
                }
                temp[item] = newResult;
            }
        }
        for(const temp of results){
            for (const number in temp) {
                const numberIndexes = temp[number];
                let numNextToSymbol = false;
                for (const index of numberIndexes) {
                    const nextToSymbol = isNextToSymbol(index, parseInt(lineIndex), symbolLocations, engineMap.length, line.length, gearAdjacentNumbers, parseInt(number));
                    if (nextToSymbol) {
                        numNextToSymbol = true;
                    }
                }
                if (numNextToSymbol) {
                    numberResult.push(parseInt(number));
                } else {
                    missingNumbers.push(parseInt(number));
                }
            }
        }
    }
   // console.log(numberResult)
    console.log(gearAdjacentNumbers)
    let total = 0;
    for(const key in gearAdjacentNumbers){
        const arr = gearAdjacentNumbers[key]
        console.log(arr)
        if(arr.length > 1){
            const first = arr[0]
            const second = arr[1]
            total += first * second
        }
    }
    console.log('Part 2 Total', total)
}

main();
part2();
