const fs = require("fs");

const getItems = async () => {
    const file = await fs.readFileSync('/Users/gordonmacmaster/Documents/Projects/2023AdventCode/2023adventofcode/day7/data.txt', 'utf8');
    return file.split('\n')
}

const strengths = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
const otherCards = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
const strengthsWithJoker = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J']
const handOrders = ['fiveKind', 'fourKind', 'fullHouse', 'threeKind', 'twoPair', 'pair', 'highCard']

const getRankCount = hand => {
    const rankCount = {};
    for (const card of hand) {
        const rank = card.charAt(0);
        if (rankCount[rank]) {
            rankCount[rank]++;
        } else {
            rankCount[rank] = 1;
        }
    }
    return rankCount;
}

const isKind = (hand, num, rankCount) => {
    for (const rank in rankCount) {
        if (rankCount[rank] === num) {
            return true;
        }
    }
    return false;
}


const getHandType = (hand) => {
    const rankCount = getRankCount(hand)
    const uniqueCards = Object.keys(rankCount).length;


    if(isKind(hand, 5, rankCount)) {
        return "fiveKind"
    }
    if(isKind(hand, 4, rankCount)) {
        return "fourKind"
    }
    if(isKind(hand, 3, rankCount) && isKind(hand, 2, rankCount)) {
        return "fullHouse"
    }
    if(isKind(hand, 3, rankCount)) {
        return "threeKind"
    }
    if(isKind(hand, 2, rankCount) && uniqueCards === 3) {
        return "twoPair"
    }
    if(isKind(hand, 2, rankCount)) {
        return "pair"
    }

    return "highCard";
}

const getHands = (lines, useJoker = false) => {
    let hands = [];
    lines.forEach(line => {
        if (line !== '') {
            const [hand, bid] = line.split(' ')
            const parsedBid = parseInt(bid)
            let handType = getHandType(hand, useJoker)
            if (useJoker) {
                // Replace the joker with other cards
                let betterHands = []
                for (const otherCard of otherCards) {
                    const newHand = hand.replaceAll('J', otherCard)
                    const newHandType = getHandType(newHand)
                    const isBetter = handOrders.indexOf(newHandType) < handOrders.indexOf(handType)
                    if (isBetter) {
                        betterHands.push({
                            hand: newHand,
                            handType: newHandType,
                        })
                    }
                }
                if (betterHands.length > 0) {
                    const sorted = betterHands.sort(sortByTypeThenCards)
                    handType = sorted[0].handType
                }
            }
            hands.push({
                hand,
                bid: parsedBid,
                handType: handType
            })
        }
    })
    return hands;
}

const sortByTypeThenCards = (a, b) => {
    const handTypeA = a.handType;
    const handTypeB = b.handType;
    if (handTypeA === handTypeB) {
        const cardA = a.hand
        const cardB = b.hand
        for (let i = 0; i < cardA.length; i++) {
            const rankA = cardA.charAt(i);
            const rankB = cardB.charAt(i);
            const aIndex = strengths.indexOf(rankA)
            const bIndex = strengths.indexOf(rankB)
            if (aIndex > bIndex) {
                return 1
            }
            if (aIndex < bIndex) {
                return -1
            }
        }
        return 0
    } else {
        return handOrders.indexOf(handTypeA) - handOrders.indexOf(handTypeB)
    }
}

const sortByTypeThenCardsWithJoker = (a, b) => {
    const handTypeA = a.handType;
    const handTypeB = b.handType;
    if (handTypeA === handTypeB) {
        const cardA = a.hand
        const cardB = b.hand
        for (let i = 0; i < cardA.length; i++) {
            const rankA = cardA.charAt(i);
            const rankB = cardB.charAt(i);
            const aIndex = strengthsWithJoker.indexOf(rankA)
            const bIndex = strengthsWithJoker.indexOf(rankB)
            if (aIndex > bIndex) {
                return 1
            }
            if (aIndex < bIndex) {
                return -1
            }
        }
        return 0
    } else {
        return handOrders.indexOf(handTypeA) - handOrders.indexOf(handTypeB)
    }
}

const part1 = async () => {
    const lines = await getItems();
    const hands = getHands(lines);
    const numHandsByHand = {}
    for (const hand in hands) {
        const handType = hands[hand].hand
        if (numHandsByHand[handType]) {
            numHandsByHand[handType]++
        } else {
            numHandsByHand[handType] = 1
        }
    }
    const handsByType = {};
    for (const hand in hands) {
        const handType = hands[hand].handType
        if (handsByType[handType]) {
            handsByType[handType].push(hand)
        } else {
            handsByType[handType] = [hand]
        }
    }

    let allHands = Object.values(hands)
    allHands = allHands.sort(sortByTypeThenCards)
    const numCards = allHands.length
    let total = 0;
    for (let i = 0; i < numCards; i++) {
        const hand = allHands[i]
        const bid = hand.bid
        const rank = (numCards - i)
        total += bid * rank;
    }
    console.log('Total Part 1: ', total)
}

const part2 = async () => {
    const lines = await getItems();
    const hands = getHands(lines, true);
    const numHandsByHand = {}
    for (const hand in hands) {
        const handType = hands[hand].hand
        if (numHandsByHand[handType]) {
            numHandsByHand[handType]++
        } else {
            numHandsByHand[handType] = 1
        }
    }
    const handsByType = {};
    for (const hand in hands) {
        const handType = hands[hand].handType
        if (handsByType[handType]) {
            handsByType[handType].push(hand)
        } else {
            handsByType[handType] = [hand]
        }
    }

    let allHands = Object.values(hands)
    allHands = allHands.sort(sortByTypeThenCardsWithJoker)
    const numCards = allHands.length
    let total = 0;
    for (let i = 0; i < numCards; i++) {
        const hand = allHands[i]
        const bid = hand.bid
        const rank = (numCards - i)
        total += bid * rank;
    }
    console.log('Total Part 2: ', total)
}

part1();
part2();
