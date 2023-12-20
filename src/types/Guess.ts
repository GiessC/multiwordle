import axios, { AxiosError } from 'axios';
import { trackPromise } from 'react-promise-tracker';

const ALPHABET: string = 'abcdefghijklmnopqrstuvwxyz';

const MAX_LETTERS: number = 5;

export enum GuessResult {
    WRONG,
    PARTIAL,
    CORRECT,
}

export default class Guess {
    private _letters: string[];
    private _currentIndex: number;
    private _entered: boolean;

    constructor() {
        this._letters = ['', '', '', '', ''];
        this._currentIndex = 0;
        this._entered = false;
    }

    public getLetter(index: number): string | null {
        if (index < 0 || index > this._letters.length) {
            console.error('Index specified to Guess.getLetter() out of bounds');
            return null;
        }
        return this._letters[index];
    }

    public get currentLetterIndex(): number {
        return this._currentIndex;
    }

    public clear() {
        this._currentIndex = 0;
        this._letters = ['', '', '', '', ''];
    }

    public deleteLetter() {
        if (this._currentIndex === 0) return;

        this._currentIndex -= 1;
        this._letters[this._currentIndex] = '';
    }

    public set currentLetter(newLetter: string) {
        if (this._currentIndex >= MAX_LETTERS) {
            console.error('Cannot assign new letter: Guess is already full');
            return;
        }
        this._letters[this._currentIndex] = newLetter;
        this._currentIndex += 1;
    }

    public compare(word: string): GuessResult[] {
        if (!word) return [];

        const result: GuessResult[] = Array(5).fill(GuessResult.WRONG);

        const wrongMap = new Map<string, number>();

        for (let i = 0; i < this._letters.length; i++) {
            if (this._letters[i] === word[i]) {
                result[i] = GuessResult.CORRECT;
            } else {
                wrongMap.set(word[i], (wrongMap.get(word[i]) || 0) + 1);
            }
        }

        for (let i = 0; i < this._letters.length; i++) {
            if (result[i] === GuessResult.CORRECT) continue;

            if (wrongMap.has(this._letters[i])) {
                result[i] = GuessResult.PARTIAL;
                wrongMap.set(
                    this._letters[i],
                    (wrongMap.get(this._letters[i]) || 0) - 1,
                );
            }
        }

        return result;
    }

    public get isFilled(): boolean {
        for (const letter of this._letters) {
            if (!letter || !ALPHABET.includes(letter)) {
                return false;
            }
        }
        return true;
    }

    public async isWord(): Promise<boolean> {
        if (!this.isFilled) {
            throw new Error(
                'Failed checking guess.isWord(): guess is not filled',
            );
        }
        if (!process.env.REACT_APP_DICTIONARY_API) {
            throw new Error('Dictionary API error: no URL could be found');
        }
        try {
            const response = await trackPromise(
                axios.get(
                    `${
                        process.env.REACT_APP_DICTIONARY_API
                    }/${this.toString()}`,
                ),
            );
            console.debug(response);
            return true;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (error?.response?.status === 404) return false;
                if (error.response?.status === 429)
                    throw new Error(
                        'Too many requests! Guesses are being entered too quick for us too keep up!',
                    );
                console.error(error);
            } else {
                throw error;
            }
        } finally {
            return false;
        }
    }

    public get letters(): string[] {
        return this._letters;
    }

    public get entered(): boolean {
        return this._entered;
    }

    public set entered(newEntered: boolean) {
        this._entered = newEntered;
    }

    public toString(): string {
        return (
            this._letters[0] +
            this._letters[1] +
            this._letters[2] +
            this._letters[3] +
            this._letters[4]
        );
    }
}

