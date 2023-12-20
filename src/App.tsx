import { useCallback, useEffect, useReducer, useState } from 'react';
import './App.css';
import Board from './components/board/Board';
import Guess from './types/Guess';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const GUESSES_ALLOWED = 21;

const EMPTY_GUESSES: Guess[] = [];
for (let i = 0; i < GUESSES_ALLOWED; i++) {
    EMPTY_GUESSES.push(new Guess());
}

const App = () => {
    const [guesses, setGuesses] = useState<Guess[]>(EMPTY_GUESSES);
    const [currentGuess, setCurrentGuess] = useState<number>(0);
    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    const updateGuess = useCallback(
        (letter: string) => {
            setGuesses((prev: Guess[]) => {
                prev[currentGuess].currentLetter = letter;

                return prev;
            });
        },
        [currentGuess],
    );

    const enterGuess = useCallback(() => {
        if (guesses[currentGuess].isValid) {
            setCurrentGuess((prev: number) => prev + 1);
        }
    }, [currentGuess, guesses]);

    const clearGuess = useCallback(() => {
        setGuesses((prev: Guess[]) => {
            prev[currentGuess].clear();

            return prev;
        });
    }, [currentGuess]);

    const deleteLetter = useCallback(() => {
        setGuesses((prev: Guess[]) => {
            prev[currentGuess].deleteLetter();

            return prev;
        });
    }, [currentGuess]);

    useEffect(() => {
        const handleKeyDown = (event: Event) => {
            if (!(event instanceof KeyboardEvent)) return;
            if (
                !event.ctrlKey &&
                !event.shiftKey &&
                ALPHABET.includes(event.key.toLowerCase())
            ) {
                updateGuess(event.key.toLowerCase());
                forceUpdate();
                return;
            }
            if (!event.ctrlKey && !event.shiftKey && event.key === 'Enter') {
                enterGuess();
                return;
            }
            if (event.ctrlKey && event.key === 'Backspace') {
                clearGuess();
                forceUpdate();
                return;
            }
            if (!event.shiftKey && event.key === 'Backspace') {
                deleteLetter();
                forceUpdate();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [
        clearGuess,
        currentGuess,
        deleteLetter,
        enterGuess,
        guesses,
        updateGuess,
    ]);

    return (
        <div className='pt-1 w-screen h-screen'>
            <Board guesses={guesses} />
        </div>
    );
};

export default App;

