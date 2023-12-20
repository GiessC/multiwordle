export enum CellColor {
    NOT_ENTERED = 'bg-inherit text-black',
    NOT_A_WORD = 'bg-inherit text-red-500',
    WRONG = 'bg-neutral-400 text-black',
    PARTIAL = 'bg-yellow-500 text-white',
    CORRECT = 'bg-green-500 text-white',
}

export interface CellProps {
    letter: string | null;
    color?: CellColor;
    guessEntered?: boolean;
}

const Cell = ({
    letter = '',
    color = CellColor.NOT_ENTERED,
    guessEntered = false,
}: CellProps) => {
    return (
        <div
            className={`flex items-center justify-center border-2 border-gray-700 text-6xl aspect-square ${
                guessEntered ? color : CellColor.NOT_ENTERED
            }`}
        >
            {letter?.toLocaleUpperCase()}
        </div>
    );
};

export default Cell;

