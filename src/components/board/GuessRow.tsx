import Guess from '../../types/Guess';
import Cell from './Cell';

export interface GuessRowProps {
    guess: Guess;
}

const GuessRow = ({ guess }: GuessRowProps) => {
    return (
        <div className='grid grid-cols-5 gap-1'>
            <Cell letter={guess.getLetter(0)} />
            <Cell letter={guess.getLetter(1)} />
            <Cell letter={guess.getLetter(2)} />
            <Cell letter={guess.getLetter(3)} />
            <Cell letter={guess.getLetter(4)} />
        </div>
    );
};

export default GuessRow;

