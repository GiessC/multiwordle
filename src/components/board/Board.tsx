import { v4 as uuidv4 } from 'uuid';
import Guess from '../../types/Guess';
import GuessRow from './GuessRow';

export interface BoardProps {
    guesses: Guess[];
    word: string;
    isWord: boolean[];
}

const Board = ({ guesses, word, isWord }: BoardProps) => {
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

