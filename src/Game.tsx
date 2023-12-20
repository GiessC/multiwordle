import Board from './components/board/Board';
import Guess from './types/Guess';

interface GameProps {
    guesses: Guess[];
    word: string;
    isWord: boolean[];
}

const Game = ({ guesses, word, isWord }: GameProps) => {
    return (
        <div className='pt-1 w-full h-full'>
            <Board guesses={guesses} word={word} isWord={isWord} />
        </div>
    );
};

export default Game;

