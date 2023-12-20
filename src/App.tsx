import { useCallback, useEffect, useMemo, useState } from 'react';
import Game from './components/game/Game';
import { GameStatus } from './types/GameStatus';
import Guess, { GuessResult } from './types/Guess';
import { generate } from 'random-words';
import { usePromiseTracker } from 'react-promise-tracker';
import { v4 as uuidv4 } from 'uuid';
import { isEqual } from 'lodash';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const GAME_COUNT = 16;

const GUESSES_ALLOWED = 21;

const EMPTY_GUESSES: Guess[] = [];
for (let i = 0; i < GUESSES_ALLOWED; i++) {
    EMPTY_GUESSES.push(new Guess());
}

const App = () => {
    const [words, setWords] = useState<string[]>([]);
    const [guesses, setGuesses] = useState<Guess[]>(EMPTY_GUESSES);
    const [currentGuess, setCurrentGuess] = useState<number>(0);
    const [gameStatus, setGameStatus] = useState<GameStatus[]>(
        Array(GAME_COUNT).fill(GameStatus.IN_PROGRESS),
    );
    const [gameEndIndex, setGameEndIndex] = useState<number[]>(
        Array(GAME_COUNT).fill(-1),
    );
    const [isWord, setIsWord] = useState<boolean[]>([]);
    const { promiseInProgress: loading } = usePromiseTracker();

    useEffect(() => {
        const updateIsWord = async () => {
            const newIsWord: boolean[] = Array(guesses.length);

            for (let i = 0; i < newIsWord.length; i++) {
                newIsWord[i] = false;
                if (!guesses[i].isFilled || (await guesses[i].isWord())) {
                    newIsWord[i] = true;
                }
            }

            setIsWord(newIsWord);
        };

        updateIsWord();
    }, [guesses]);

    useEffect(() => {
        const newWords: string[] = generate({
            exactly: GAME_COUNT,
            minLength: 5,
            maxLength: 5,
        });

        setWords(newWords);
        console.debug(newWords);
    }, []);

    const games = useMemo(() => {
        const games = [];

        for (let i = 0; i < GAME_COUNT; i++) {
            if (gameStatus[i] === GameStatus.IN_PROGRESS) {
                games.push(
                    <Game
                        key={uuidv4()}
                        guesses={guesses}
                        word={words[i]}
                        isWord={isWord}
                    />,
                );
            } else {
                games.push(
                    <Game
                        key={uuidv4()}
                        guesses={guesses.slice(0, gameEndIndex[i])}
                        word={words[i]}
                        isWord={isWord}
                    />,
                );
            }
        }

        return games;
    }, [gameEndIndex, gameStatus, guesses, isWord, words]);

    const updateGameStatus = useCallback(() => {
        const newGameStatus: GameStatus[] = [];
        const newGameEndIndex: number[] = [];

        for (let i = 0; i < gameStatus.length; i++) {
            if (
                isEqual(guesses[currentGuess].compare(words[i]), [
                    GuessResult.CORRECT,
                    GuessResult.CORRECT,
                    GuessResult.CORRECT,
                    GuessResult.CORRECT,
                    GuessResult.CORRECT,
                ])
            ) {
                newGameStatus.push(GameStatus.WIN);
                newGameEndIndex.push(currentGuess);
            } else if (currentGuess >= GUESSES_ALLOWED) {
                newGameStatus.push(GameStatus.LOSS);
                newGameEndIndex.push(currentGuess);
            }
        }

        setGameStatus(newGameStatus);
        setGameEndIndex(newGameEndIndex);
    }, [currentGuess, gameStatus.length, guesses, words]);

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
        try {
            if (
                guesses[currentGuess].isFilled &&
                (await guesses[currentGuess].isWord())
            ) {
                guesses[currentGuess].entered = true;
                updateGameStatus();
                setCurrentGuess((prev: number) => prev + 1);
            }
        } catch (error: unknown) {
            console.error(error);
        }
    }, [currentGuess, guesses, updateGameStatus]);

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
    }, [
        clearGuess,
        currentGuess,
        deleteLetter,
        enterGuess,
        gameStatus,
        guesses,
        loading,
        updateGuess,
    ]);

    return (
        <div className='grid grid-cols-2 w-screen h-screen'>
            {games.map((game: React.ReactNode) => game)}
        </div>
    );
};

export default App;

