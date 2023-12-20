export interface CellProps {
    letter: string | null;
}

const Cell = ({ letter = '' }: CellProps) => {
    return (
        <div className='flex items-center justify-center border-2 border-gray-700 text-6xl aspect-square'>
            {letter?.toLocaleUpperCase()}
        </div>
    );
};

export default Cell;

