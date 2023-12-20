import { isString } from 'lodash';
import { generate } from 'random-words';
import { GameStatus } from './GameStatus';
import { v4 as uuidv4 } from 'uuid';
import Guess from './Guess';

export default class Game {
    private _id: string;
    private _word: string;
    private _guesses: Guess[];
    private _gameStatus: GameStatus;
    private _guessesAllowed: number;

    constructor(guessesAllowed: number) {
        this._id = uuidv4();
        this._word = '';
        const _word = generate({ minLength: 5, maxLength: 5 });
        if (isString(_word)) {
            // Should always be true, types are weird here
            this._word = _word;
        }
        this._guesses = [];
        this._gameStatus = GameStatus.IN_PROGRESS;
        this._guessesAllowed = guessesAllowed;
    }

    public enterGuess(guess: Guess) {
        if ([GameStatus.WIN, GameStatus.LOSS].includes(this.gameStatus)) return;
        if (!guess.isFilled) return;
        if (!guess.isWord()) return;

        console.debug(this._guesses.length, this._guessesAllowed);
        if (this._guesses.length < this._guessesAllowed) {
            const newGuesses = [...this.guesses];
            newGuesses.push(guess);
            this.gameStatus = this.checkLatestGuess();
            this._guesses = newGuesses;
        }
    }

    public checkLatestGuess(): GameStatus {
        console.debug(this.guesses);
        if (this.guesses[this.guesses.length - 1].toString() === this._word) {
            return GameStatus.WIN;
        } else if (this.guesses.length >= this._guessesAllowed) {
            return GameStatus.LOSS;
        }
        return this.gameStatus;
    }

    public get word(): string {
        return this._word;
    }

    public get guesses(): Guess[] {
        return this._guesses;
    }

    public get gameStatus(): GameStatus {
        return this._gameStatus;
    }

    public set gameStatus(newStatus: GameStatus) {
        this._gameStatus = newStatus;
    }

    public get id(): string {
        return this._id;
    }
}

