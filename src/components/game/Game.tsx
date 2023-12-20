import Board from '../board/Board';
import Game from '../../types/Game';
import Guess from '../../types/Guess';

interface GameProps {
    game: Game;
    currentGuess: Guess;
    isWord: boolean;
}

const GameComponent = ({ game, currentGuess, isWord }: GameProps) => {
    return (
        <div className='pt-1 w-full h-full'>
            <Board game={game} currentGuess={currentGuess} isWord={isWord} />
        </div>
    );
};

export default GameComponent;

