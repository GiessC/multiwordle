import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import { GuessResult } from '../../types/Guess';
import Cell, { CellColor } from './Cell';

export interface GuessRowProps {
    guessLetters: string[];
    guessResult: GuessResult[];
    guessEntered?: boolean;
    guessIsWord?: boolean;
}

const RESULT_TO_COLOR_MAP = {
    [GuessResult.CORRECT]: CellColor.CORRECT,
    [GuessResult.PARTIAL]: CellColor.PARTIAL,
    [GuessResult.WRONG]: CellColor.WRONG,
    [GuessResult.NONE]: CellColor.NOT_ENTERED,
};

const GuessRow = ({
    guessLetters,
    guessResult,
    guessEntered = false,
    guessIsWord = true,
}: GuessRowProps) => {
    const [colors, setColors] = useState<CellColor[]>([]);

    useEffect(() => {
        const colors: CellColor[] = [
            RESULT_TO_COLOR_MAP[guessResult[0]] || CellColor.NOT_ENTERED,
            RESULT_TO_COLOR_MAP[guessResult[1]] || CellColor.NOT_ENTERED,
            RESULT_TO_COLOR_MAP[guessResult[2]] || CellColor.NOT_ENTERED,
            RESULT_TO_COLOR_MAP[guessResult[3]] || CellColor.NOT_ENTERED,
            RESULT_TO_COLOR_MAP[guessResult[4]] || CellColor.NOT_ENTERED,
        ];

        setColors(colors);
    }, [guessEntered, guessResult]);

    return (
        <div className='grid grid-cols-5 gap-1'>
            {[0, 1, 2, 3, 4].map((index: number) => (
                <Cell
                    key={uuidv4()}
                    letter={guessLetters[index]}
                    color={colors[index]}
                    guessEntered={guessEntered}
                    guessIsWord={guessIsWord}
                />
            ))}
        </div>
    );
};

export default GuessRow;

