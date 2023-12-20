import { v4 as uuidv4 } from 'uuid';
import Guess from '../../types/Guess';
import GuessRow from './GuessRow';
import { useEffect, useState } from 'react';

export interface BoardProps {
    guesses: Guess[];
    word: string;
}

const Board = ({ guesses, word }: BoardProps) => {
    const [isWord, setIsWord] = useState<boolean[]>([]);

    useEffect(() => {
        const updateIsWord = async () => {
            const newIsWord: boolean[] = Array(guesses.length);

            for (let i = 0; i < newIsWord.length; i++) {
                if (!guesses[i].isFilled || (await !guesses[i].isWord())) {
                    newIsWord[i] = true;
                }
            }

            setIsWord(newIsWord);
        };

        updateIsWord();
    }, [guesses]);

    return (
        <div className={`grid gap-1 w-1/3 h-full m-auto overflow-y-auto`}>
            {guesses.map((guess: Guess, index: number) => (
                <GuessRow
                    key={uuidv4()}
                    guessLetters={guess.letters}
                    guessResult={guess.compare(word)}
                    guessEntered={guess.entered}
                    guessIsWord={isWord[index]}
                />
            ))}
        </div>
    );
};

export default Board;

