import { v4 as uuidv4 } from 'uuid';
import Guess, { GuessResult } from '../../types/Guess';
import GuessRow from './GuessRow';
import Game from '../../types/Game';
import { useEffect } from 'react';

export interface BoardProps {
    game: Game;
    currentGuess: Guess;
    isWord: boolean;
}

const Board = ({ game, currentGuess, isWord }: BoardProps) => {
    return (
        <div className={`grid gap-1 w-1/3 h-full m-auto overflow-y-auto`}>
            {game.guesses.map((guess: Guess) => (
                <GuessRow
                    key={uuidv4()}
                    guessLetters={guess.letters}
                    guessResult={guess.compare(game.word)}
                    guessEntered={true}
                    guessIsWord={true}
                />
            ))}
            <GuessRow
                guessLetters={currentGuess.letters}
                guessResult={[
                    GuessResult.NONE,
                    GuessResult.NONE,
                    GuessResult.NONE,
                    GuessResult.NONE,
                    GuessResult.NONE,
                ]}
                guessEntered={false}
                guessIsWord={isWord}
            />
        </div>
    );
};

export default Board;

