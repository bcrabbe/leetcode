import chai from 'chai'
const assert = chai.assert

const example1 = () => {
    const input = "catsanddog"
    const wordDict = ["cat","cats","and","sand","dog"]
    const output = ["cats and dog","cat sand dog"]
    assert.includeMembers(solution(input, wordDict), output)
}

const example2 = () => {
    const input = "pineapplepenapple"
    const wordDict = ["apple","pen","applepen","pine","pineapple"]
    const output = ["pine apple pen apple","pineapple pen apple","pine applepen apple"]
    assert.includeMembers(solution(input, wordDict), output)
}

const example3 = () => {
    const input = "catsandog"
    const wordDict = ["cats","dog","sand","and","cat"]
    const output: Array<string> = []
    assert.includeMembers(solution(input, wordDict), output)
}


const solution = (input: string, wordList: Array<string>): Array<string> => {
    console.log(input, wordList)
    const dict = wordListToDict(wordList)
    let solutions: Array<string> = []
    const findSolutions = (candidate: string, dict: WordDict, possibles: Array<string>) => {
        console.log(solutions, possibles, candidate)
        if (candidate.length === 0) {
            solutions = [...solutions, possibles.join(' ')]
        }
        let matching = true, i = 0
        while(matching) {
            const candidateChar = candidate[i] as Char
            const dictCharNode = dict[i][candidateChar]
            if (!dictCharNode) {
                matching = false
                break
            }
            if (dictCharNode.isFullWord) findSolutions(candidate.substring(i + 1), dict, [...possibles, candidate.substring(0, i + 1)])
            if (candidate[i + 1] === undefined || !dictCharNode.nextChars.includes(candidate[i + 1] as Char)) {
                matching = false
                break
            }
            ++i
        }
    }
    findSolutions(input, dict, [])
    console.log(solutions)
    return solutions
}

type Char = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'

type WordDict = Array<{
    [key in Char]?: CharNode
}>

type CharNode = {
    nextChars: Array<Char>,
    isFullWord: boolean
}

const wordListToDict = (wordList: Array<string>): WordDict => {
    return wordList.reduce(
        (dict: WordDict, word: string): WordDict => {
            return (Array.from(word) as Array<Char>).reduce(
                (dict: WordDict, char: Char, indexInWord: number) => {
                    const isFullWord = indexInWord === word.length - 1
                    dict[indexInWord] = {
                        ...dict[indexInWord],
                        [char]: addToCharNode(
                            isFullWord,
                            word[indexInWord + 1] as Char | undefined,
                            dict[indexInWord] && dict[indexInWord][char]
                        )
                    }
                    return dict
                },
                dict
            ) as WordDict
        },
        [{}]
    ) as WordDict
}


const addToCharNode = (
    isFullWord: boolean,
    nextChar?: Char,
    existingEntry?: CharNode
): CharNode => {
    return isFullWord ? {
        ...(existingEntry ?? { nextChars: [], isFullWord: false }),
        isFullWord: true
    } : {
        ...(existingEntry ?? { nextChars: [], isFullWord: false }),
        nextChars: (existingEntry?.nextChars ?? []).reduce(
            (acc, char) => acc.includes(char) ? acc : [...acc, char],
            [nextChar]
        ) as Array<Char>
    }
}


const isWord = (dict: WordDict, word: string): boolean => {
    return !!(Array.from(word) as Array<Char>).reduce(
        (result: boolean, char: Char, index: number): boolean => {
            return !result || !!(
                dict[index] && dict[index][char] && (
                    dict[index][char]!.isFullWord ||
                        dict[index][char]!.nextChars.includes(word[index + 1] as Char))
            )
        },
        true
    )
}

example1()
example2()
example3()
