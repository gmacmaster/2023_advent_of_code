const fs = require("fs");

const getItems = async () => {
    const file = await fs.readFileSync('/Users/gordonmacmaster/Documents/Projects/2023AdventCode/2023adventofcode/day6/data.txt', 'utf8');
    return file.split('\n')
}

const getRaceInfo = lines=>{
    const info = {}
    for(const line of lines){
        if(line.length>0){
            let trimmed = line.trim().replace('     ', ' ').replace('   ', ' ').replace('   ', ' ').replace('     ', ' ').replace('   ', ' ').replace('  ', ' ').replace('  ', ' ').replace('  ', ' ').replace('  ', ' ').replace('  ', ' ')
            const [infoFor, races] = trimmed.split(':')
            const trimmedInfoFor = infoFor.trim()
            const trimmedRaces = races.trim()
            const raceArray = trimmedRaces.split(' ')
            info[trimmedInfoFor] = raceArray.map(item=>parseInt(item))
        }

    }
    return info;
}

const getRaceInfoPart2 = lines=>{
    const info = {}
    for(const line of lines){
        if(line.length>0){
            const [infoFor, races] = line.split(':')
            const trimmedInfoFor = infoFor.replace(/\s/g, '');
            const trimmedRaces = races.replace(/\s/g, '');
            const raceArray = trimmedRaces.split(' ')
            info[trimmedInfoFor] = raceArray.map(item=>parseInt(item))
        }

    }
    return info;
}

const calculateDistance = (holdTime, totalTime) =>{
    const remainingTime = totalTime - holdTime;
    return remainingTime * holdTime;
}

const getNumWinningTimes = (raceInfo, raceNum)=>{
    const time = raceInfo['Time'][raceNum]
    const distance = raceInfo['Distance'][raceNum]
    const winningTimes = []
    for(let i=0; i<=time; i++){
        const distanceCovered = calculateDistance(i, time)
        if(distanceCovered>distance){
            winningTimes.push(i)
        }
    }
    return winningTimes.length
}

const part1 = async () => {
    const items = await getItems()
    const raceInfo = getRaceInfo(items)
    const numRaces = Object.keys(raceInfo['Time']).length
    let numWinningTimes = 1
    let numWinningTimesArray = []
    for(let i=0; i<numRaces; i++){
        const numWinningTimesForRace = getNumWinningTimes(raceInfo, i)
        numWinningTimesArray.push(numWinningTimesForRace)
        numWinningTimes *= numWinningTimesForRace
    }
    console.log(numWinningTimesArray)
    console.log('Num winning possibilities part 1: ', numWinningTimes)
}

const part2 = async () => {
    const items = await getItems()
    const raceInfo = getRaceInfoPart2(items)
    const numRaces = Object.keys(raceInfo['Time']).length
    let numWinningTimes = 1
    let numWinningTimesArray = []
    for(let i=0; i<numRaces; i++){
        const numWinningTimesForRace = getNumWinningTimes(raceInfo, i)
        numWinningTimesArray.push(numWinningTimesForRace)
        numWinningTimes *= numWinningTimesForRace
    }
    console.log(numWinningTimesArray)
    console.log('Num winning possibilities part 2: ', numWinningTimes)
}

part1();
part2();
