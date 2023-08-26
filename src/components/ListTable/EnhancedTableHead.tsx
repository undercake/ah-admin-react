import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';

interface EnhancedTableProps {
    numSelected: number;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    rowCount: number;
    titles: {[key:string]: any}
    loading?: boolean;
}

export default function EnhancedTableHead({
    onSelectAllClick,
    numSelected,
    rowCount,
    titles,
    loading=false
}: EnhancedTableProps) {

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        disabled={loading}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                        sx={{
                            '.dark & svg': {color: '#ccc'}
                        }}
                    />
                </TableCell>
                {Object.keys(titles).map((key, ind) => (
                    <TableCell
                        key={ind}
                        align='left'
                        padding='normal'
                        sx={{'.dark &': {color: '#eee'}}}
                    >
                        {titles[key].name}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}