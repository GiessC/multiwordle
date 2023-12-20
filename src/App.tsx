import { useCallback, useEffect, useReducer, useState } from 'react';
import Guess from './types/Guess';
import { usePromiseTracker } from 'react-promise-tracker';
import GameComponent from './components/game/Game';
import Game from './types/Game';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const GAME_COUNT = 16;

const GUESSES_ALLOWED = 21;

const EMPTY_GUESSES: Guess[] = [];
for (let i = 0; i < GUESSES_ALLOWED; i++) {
    EMPTY_GUESSES.push(new Guess());
}

const DEFAULT_GAMES: Game[] = [];
for (let i = 0; i < GAME_COUNT; i++) {
    DEFAULT_GAMES.push(new Game(GUESSES_ALLOWED));
}

const App = () => {
    const [games, setGames] = useState<Game[]>(DEFAULT_GAMES);
    const [currentGuess, setCurrentGuess] = useState<Guess>(new Guess());
    const [isWord, setIsWord] = useState<boolean>(false);
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const { promiseInProgress: loading } = usePromiseTracker();

    useEffect(() => {
        const updateIsWord = async () => {
            if (!currentGuess.isFilled || (await currentGuess.isWord())) {
                setIsWord(true);
            } else {
                setIsWord(false);
            }
        };

        updateIsWord();
    }, [currentGuess]);

    const updateGuess = useCallback((letter: string) => {
        setCurrentGuess((prev: Guess) => {
            prev.currentLetter = letter;

            return prev;
        });
        forceUpdate();
    }, []);

    const enterGuess = useCallback(async () => {
        const guessIsEnterable =
            currentGuess.isFilled && (await currentGuess.isWord());

        setGames((prev: Game[]) => {
            if (guessIsEnterable) {
                currentGuess.entered = true;
                for (let i = 0; i < prev.length; i++) {
                    prev[i].enterGuess(currentGuess);
                }
            }

            return prev;
        });
    }, [currentGuess]);

    const clearGuess = useCallback(() => {
        setCurrentGuess((prev: Guess) => {
            prev.clear();

            return prev;
        });
    }, []);

    const deleteLetter = useCallback(() => {
        setCurrentGuess((prev: Guess) => {
            prev.deleteLetter();

            return prev;
        });
        forceUpdate();
    }, []);

    useEffect(() => {
        const handleKeyDown = async (event: Event) => {
            if (loading || !(event instanceof KeyboardEvent)) return;
            if (
                !event.ctrlKey &&
                !event.shiftKey &&
                ALPHABET.includes(event.key.toLowerCase())
            ) {
                updateGuess(event.key.toLowerCase());
                return;
            }
            if (!event.ctrlKey && !event.shiftKey && event.key === 'Enter') {
                enterGuess();
                return;
            }
            if (event.ctrlKey && event.key === 'Backspace') {
                clearGuess();
                return;
            }
            if (!event.shiftKey && event.key === 'Backspace') {
                deleteLetter();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [clearGuess, deleteLetter, enterGuess, loading, updateGuess]);

    return (
        <div className='grid grid-cols-2 w-screen h-screen'>
            {games.map((game: Game) => (
                <GameComponent
                    key={game.id}
                    game={game}
                    isWord={isWord}
                    currentGuess={currentGuess}
                />
            ))}
        </div>
    );
};

export default App;

