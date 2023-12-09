const fs = require("fs");

const getItems = async () => {
    const file = await fs.readFileSync('/Users/gordonmacmaster/Documents/Projects/2023AdventCode/2023adventofcode/day8/data.txt', 'utf8');
    return file.split('\n')
}

const parseNetworkInstructions = (items) => {
    const firstLine = items[0];
    const otherLines = items.slice(1);
    const networkLookup = {};
    otherLines.forEach(line => {
        const trimmedLine = line.replace(/\s/g, '');
        if (trimmedLine.includes('=')) {
            const [key, value] = trimmedLine.split('=');
            let replacedValue = value.replace(/\(/g, '');
            replacedValue = replacedValue.replace(/\)/g, '');
            const splitValue = replacedValue.split(',');
            networkLookup[key] = {
                L: splitValue[0],
                R: splitValue[1],
            }
        }
    })
    return {
        instructions: firstLine.split(''),
        networkLookup: networkLookup,
    }
}

const part1 = async () => {
    const items = await getItems()
    const {networkLookup, instructions} = parseNetworkInstructions(items);
    let longInstructions = [];

    for (let i = 0; i < 106; i++) {
        longInstructions = longInstructions.concat(instructions);
    }

    let currentStepNum = 0;
    let currentStep = 'AAA';
    while (currentStepNum < longInstructions.length && currentStep !== 'ZZZ') {
        const currentStepInstructions = networkLookup[currentStep];
        const currentInstruction = longInstructions[currentStepNum];
        currentStep = currentStepInstructions[currentInstruction];
        currentStepNum++;
    }
    console.log('Step 1: ', currentStepNum)
}

const getNodesThatEndInLetter = (networkLookup, letter) => {
    const keys = Object.keys(networkLookup);
    const nodesThatEndInLetter = [];
    keys.forEach(key => {
        const lastChar = key[key.length - 1];
        if (lastChar === letter) {
            nodesThatEndInLetter.push(key);
        }
    })
    return nodesThatEndInLetter;
}

const getLastChar = (string) => {
    return string[string.length - 1];
}

const checkIfAllNodesEndInZ = (nodes) => {
    let allNodesEndInZ = true;
    nodes.forEach(node => {
        const currentLastChar = getLastChar(node);
        if (currentLastChar !== 'Z') {
            allNodesEndInZ = false;
        }
    })
    return allNodesEndInZ;
}

function gcd(a, b) {
    if (a) return gcd(b % a, a)
    else return b
}

function lcm(a, b) {
    return a * b / gcd(a, b)
}

const part2Slow = async () => {
    const items = await getItems()
    const {networkLookup, instructions} = parseNetworkInstructions(items);
    let longInstructions = [];

    for (let i = 0; i < 1000000; i++) {
        longInstructions = longInstructions.concat(instructions);
    }

    let currentStepNum = 0;
    let currentLetter = 'A';
    let currentNodes = getNodesThatEndInLetter(networkLookup, currentLetter);
    let currentStep = currentNodes[0];
    let allNodesEndInZ = false;
    console.log(currentNodes)
    while (currentStepNum < 2 && !allNodesEndInZ) {
        let newNodes = [];
        const currentInstruction = longInstructions[currentStepNum];
        //console.log('Current step: ', currentStep, 'Current step num: ', currentStepNum, currentNodes, currentInstruction)
        for (const node of currentNodes) {
            const nextNode = networkLookup[node][currentInstruction];
            newNodes.push(nextNode)
        }
        if (checkIfAllNodesEndInZ(newNodes)) {
            console.log('All nodes end in Z')
            allNodesEndInZ = true;
        }
        //console.log('New nodes: ', newNodes)
        currentNodes = newNodes;
        if (currentStep % 100000000000 === 0) {
            console.log('Current step: ', currentStep, 'Current step num: ', currentStepNum, currentNodes, currentInstruction)
        }
        currentStepNum++;
    }
    console.log(longInstructions.length)
    console.log('Step 2 (slow): ', currentStepNum)
}

function getLcm(array) {
    let result = array[0];
    for (let i = 1; i < array.length; i++) {
        result = lcm(result, array[i]);
    }
    return result;
}


const part2 = async () => {
    const items = await getItems()
    const {networkLookup, instructions} = parseNetworkInstructions(items);
    let currentStepNum = 0;
    let currentLetter = 'A';
    let currentNodes = getNodesThatEndInLetter(networkLookup, currentLetter);
    let numberOfSteps = []

    let longInstructions = [];
    for (let i = 0; i < 100; i++) {
        longInstructions = longInstructions.concat(instructions);
    }

    while (currentNodes.length !== numberOfSteps.length) {
        currentNodes.forEach((curr, idx) => {
            if (curr.endsWith('Z')) {
                numberOfSteps.push(currentStepNum)
            }
            currentNodes[idx] = networkLookup[curr][longInstructions[currentStepNum]]
        })
        //console.log(currentStepNum, currentNodes, currentStepNum % instructions.length)
        currentStepNum++
    }

    const answer = getLcm(numberOfSteps)
    console.log('Step 2: ', answer)
}

part1();
part2();
