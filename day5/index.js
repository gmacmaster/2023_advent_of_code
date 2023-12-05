const fs = require("fs");

const getItems = async () => {
    const file = await fs.readFileSync('/Users/gordonmacmaster/Documents/Projects/2023AdventCode/2023adventofcode/day5/data.txt', 'utf8');
    return file.split('\n')
}

// Break out the seeds I need to plant and the mappings
const breakOutRows = rows =>{
    const seedRow = rows[0];
    const rest = rows.slice(1);
    let lastMapKey='';
    const map={};
    rest.forEach(r=>{
        const trimmed = r.trim();
        if(trimmed.length===0){
            return
        }
        if(trimmed.includes('map:')){
            lastMapKey = trimmed.replace(' map:','');
            map[lastMapKey]=[]
        } else {
            map[lastMapKey].push(trimmed)
        }
    })
    const splitSeed = seedRow.split('seeds: ');
    const seedsToPlant = splitSeed[1].split(' ').map(s=>s.trim());
    return {
        seeds: seedsToPlant,
        map
    }
}

// Break out mappings into an object that shows the range of values that can be mapped
const getMaps = (map) => {
    const finalMap = {};
    for(const key in map){
        finalMap[key] = [];
        const mapArray = map[key];
        for(const row of mapArray){
            const trimmed = row.trim().split(' ').map(s=>s.trim());
            const [destination, source, rangeLength] = trimmed;
            const parsedLength = parseInt(rangeLength);
            const parsedSource = parseInt(source);
            const parsedDestination = parseInt(destination);
            finalMap[key].push({
                minSource: parsedSource,
                maxSource: parsedSource+parsedLength-1,
                minDestination: parsedDestination,
                maxDestination: parsedDestination+parsedLength-1
            })
        }
    }
    return finalMap;
}

// Tells me which map to use next
const mapMaps = {
    'seed-to-soil': 'soil-to-fertilizer',
    'soil-to-fertilizer': 'fertilizer-to-water',
    'fertilizer-to-water': 'water-to-light',
    'water-to-light': 'light-to-temperature',
    'light-to-temperature': 'temperature-to-humidity',
    'temperature-to-humidity': 'humidity-to-location',
    'humidity-to-location': ''
}


// Recursively traverses the maps to get the final value
const getDataFromMap = (searchNum, mapName, maps)=>{
    if(!maps[mapName]|| mapName===''){
        return searchNum;
    }
    const currentMap = maps[mapName];
    const parsedSearchNum = parseInt(searchNum);
    let foundRange = null;
    let searchResult = parsedSearchNum
    for(const range of currentMap){
        if(parsedSearchNum>=range.minSource && parsedSearchNum<=range.maxSource){
            foundRange = range;
            break;
        }
    }
    if(foundRange){
        const {minSource, minDestination} = foundRange;
        const diff = parsedSearchNum-minSource;
        searchResult = minDestination + diff;
    }

    return getDataFromMap(searchResult, mapMaps[mapName], maps);
}

const part1 = async () => {
    console.time('part1');
    const items = await getItems();
    const {seeds, map} = breakOutRows(items);
    const maps = getMaps(map);
    let lowest = 9999999999;
    for(const seed of seeds){
       const num2 = getDataFromMap(seed, 'seed-to-soil', maps)
        if(num2<lowest){
            lowest = num2;
        }
    }
    console.log('Lowest: ', lowest)
    console.timeEnd('part1');
}

const getV2Seeds = (seeds) => {
    let newSeeds = [];
    for(let i = 0; i<seeds.length-1; i+=2){
        const seed = seeds[i];
        const numSeeds = seeds[i+1];
        const parsedNumSeeds = parseInt(numSeeds);
        const parsedSeed = parseInt(seed);
        newSeeds.push({
            seedStart: parsedSeed,
            seedEnd: parsedSeed+parsedNumSeeds
        })
    }
    return newSeeds
}

const part2 = async () => {
    console.time('part2');
    const items = await getItems();
    const {seeds, map} = breakOutRows(items);
    const allSeeds = getV2Seeds(seeds);
    const maps2 = getMaps(map);
    let lowest = 9999999999;
    for(const seed of allSeeds){
        const {seedStart, seedEnd} = seed;
        for(let i = seedStart; i<=seedEnd; i++){
            const num = getDataFromMap(i, 'seed-to-soil', maps2)
            if(num<lowest){
                lowest = num;
            }
        }
    }
    console.log('Lowest: ', lowest)
    console.timeEnd('part2');
}

part1();
part2();
