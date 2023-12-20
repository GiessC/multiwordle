const ALPHABET: string = 'abcdefghijklmnopqrstuvwxyz';

const MAX_LETTERS: number = 5;

export default class Guess {
    private _letters: string[];
    private _currentIndex: number;

    constructor() {
        this._letters = ['', '', '', '', ''];
        this._currentIndex = 0;
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

    public get isValid(): boolean {
        for (const letter of this._letters) {
            if (!letter || !ALPHABET.includes(letter)) {
                return false;
            }
        }
        return true;
    }

    public get letters(): string[] {
        return this._letters;
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

