import { v4 as uuidv4 } from 'uuid';
import Guess from '../../types/Guess';
import GuessRow from './GuessRow';

export interface BoardProps {
    guesses: Guess[];
}

const Board = ({ guesses }: BoardProps) => {
    return (
        <div className={`grid gap-1 w-1/3 h-full m-auto overflow-y-auto`}>
            {guesses.map((guess: Guess) => (
                <GuessRow key={uuidv4()} guess={guess} />
            ))}
        </div>
    );
};

export default Board;

