import { useCallback, useEffect, useState } from 'react';
import { generate } from 'random-words';
import Board from './components/board/Board';
import Guess, { GuessResult } from './types/Guess';
import { isEqual, isString } from 'lodash';
import { GameStatus } from './types/GameStatus';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const GUESSES_ALLOWED = 21;

const EMPTY_GUESSES: Guess[] = [];
for (let i = 0; i < GUESSES_ALLOWED; i++) {
    EMPTY_GUESSES.push(new Guess());
}

const Game = () => {
    const [word, setWord] = useState<string>('');
    const [guesses, setGuesses] = useState<Guess[]>(EMPTY_GUESSES);
    const [currentGuess, setCurrentGuess] = useState<number>(0);
    const [gameStatus, setGameStatus] = useState<GameStatus>(
        GameStatus.IN_PROGRESS,
    );

    useEffect(() => {
        const newWord: string[] = generate({ minLength: 5, maxLength: 5 });

        // Cheat, type claims generate returns string[], but returns string in this context
        if (isString(newWord)) {
            setWord(newWord);
            console.debug(newWord);
        }
    }, []);

    const updateGuess = useCallback(
        (letter: string) => {
            setGuesses((prev: Guess[]) => {
                const newGuesses = [...prev];

                newGuesses[currentGuess].currentLetter = letter;

                return newGuesses;
            });
        },
        [currentGuess],
    );

    const enterGuess = useCallback(async () => {
        if (
            guesses[currentGuess].isFilled &&
            (await guesses[currentGuess].isWord())
        ) {
            guesses[currentGuess].entered = true;
            if (
                isEqual(guesses[currentGuess].compare(word), [
                    GuessResult.CORRECT,
                    GuessResult.CORRECT,
                    GuessResult.CORRECT,
                    GuessResult.CORRECT,
                    GuessResult.CORRECT,
                ])
            )
                setGameStatus(GameStatus.WIN);
            setCurrentGuess((prev: number) => prev + 1);
        }
    }, [currentGuess, guesses, word]);

    const clearGuess = useCallback(() => {
        setGuesses((prev: Guess[]) => {
            const newGuesses = [...prev];

            newGuesses[currentGuess].clear();

            return newGuesses;
        });
    }, [currentGuess]);

    const deleteLetter = useCallback(() => {
        setGuesses((prev: Guess[]) => {
            const newGuesses = [...prev];

            newGuesses[currentGuess].deleteLetter();

            return newGuesses;
        });
    }, [currentGuess]);

    useEffect(() => {
        const handleKeyDown = async (event: Event) => {
            if (
                [GameStatus.WIN, GameStatus.LOSS].includes(gameStatus) ||
                !(event instanceof KeyboardEvent)
            )
                return;
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
    }, [
        clearGuess,
        currentGuess,
        deleteLetter,
        enterGuess,
        gameStatus,
        guesses,
        updateGuess,
    ]);

    return (
        <div className='pt-1 w-screen h-screen'>
            <Board guesses={guesses} word={word} />
        </div>
    );
};

export default Game;

