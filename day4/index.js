const fs = require("fs");

const getItems = async () => {
    const file = await fs.readFileSync('/Users/gordonmacmaster/Documents/Projects/2023AdventCode/2023adventofcode/day4/data.txt', 'utf8');
    return file.split('\n')
}


const getTotal = numWinning => {
    if (numWinning === 0) {
        return 0
    }
    let total = 1
    for (let i = 1; i < numWinning; i++) {
        total *= 2
    }
    return total
}

const parseLines = (lines) => {
    const parsedLines = []
    let total = 0
    for (const line of lines) {
        if (line?.length > 0) {
            let gamePossible = true
            const split = line.split(':')
            const [card, numbersString] = split

            const parsedCard = card.replace('  ', ' ').split(' ');
            const cardNum = parseInt(parsedCard[1]);
            const [winningNumber, myNumbers] = numbersString.trim().replace('  ', ' ').split('|')
            const trimmedMyNumbers = myNumbers.trim()
            const trimmedWinningNumber = winningNumber.replace('  ', ' ').trim()
            const splitMyNumbers = trimmedMyNumbers.replace('  ', ' ').split(' ')
            const splitWinningNumber = trimmedWinningNumber.replace('  ', ' ').split(' ')
            let numWinning = 0;
            for (const num of splitMyNumbers) {
                if (splitWinningNumber.includes(num)) {
                    numWinning++
                }
            }
            const cardTotal = getTotal(numWinning)
            total += cardTotal
            console.log('numWinning', cardNum, numWinning, cardTotal)
        }
    }
    return total
}


const isWinningCard = (card, winningNumber) => {

}
const getPower = (lines) => {
    const parsedLines = []
    let total = 0
    const cardMap = {}
    let numLines=0
    for (const line of lines) {
        if (line?.length > 0) {
            numLines++
            const split = line.split(':')
            const [card, numbersString] = split

            const parsedCard = card.replace('  ', ' ').replace('  ', ' ').replace('  ', ' ').split(' ');
            const cardNum = parseInt(parsedCard[1]);
            const [winningNumber, myNumbers] = numbersString.trim().replace('  ', ' ').split('|')
            const trimmedMyNumbers = myNumbers.trim()
            const trimmedWinningNumber = winningNumber.replace('  ', ' ').replace('  ', ' ').trim()
            const splitMyNumbers = trimmedMyNumbers.replace('  ', ' ').split(' ')
            const splitWinningNumber = trimmedWinningNumber.replace('  ', ' ').split(' ')
            if(!isNaN(cardNum)){
                cardMap[cardNum] = [{
                    winningNumber: splitWinningNumber,
                    myNumbers: splitMyNumbers
                }]
            }

        }
    }
    for (const cardNum in cardMap) {
        const cards = cardMap[cardNum]
        let currentCard = 0;
        while (currentCard < cards.length) {
            const {winningNumber, myNumbers} = cards[currentCard]
            let numWinning = 0;
            for (const num of myNumbers) {
                if (winningNumber.includes(num)) {
                    numWinning++
                }
            }
            const parsedCardNum = parseInt(cardNum)
            let i = parsedCardNum+1
            let starting = i
            for (i; i < starting+numWinning; i++) {
                if(i<=numLines){
                    cardMap[i].push(cardMap[i][0])
                }
            }
            currentCard++;
        }
    }
    for(const cardNum in cardMap){
        const cards = cardMap[cardNum]
        total += cards.length
        //console.log('cardNum',cardNum, cards.length)
    }
    return total
}

const part1 = async () => {
    const items = await getItems()
    const total = parseLines(items)
    //const total = parsedItems.reduce((acc, curr)=>acc+curr, 0)
    console.log('Total', total)
}
const part2 = async () => {
    const items = await getItems()
    const total = getPower(items)
    console.log('Total', total)
}

//part1();
part2();
