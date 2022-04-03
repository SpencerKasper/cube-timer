import React, {useEffect} from 'react';
import {
    alpha,
    Box,
    Checkbox,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Toolbar,
    Tooltip,
    Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import {visuallyHidden} from '@mui/utils';
import {Solve} from "../redux/reducers/solveReducer";
import {TimeFormatter} from "../utils/TimeFormatter";

export const SolveSelectionTable = ({
                                        solves,
                                        width,
                                        selectable = true,
                                        onSelectedChanged = (value) => null
                                    }: { solves: Solve[], width?: string, selectable?: boolean; onSelectedChanged?: (value) => any }) => {
    useEffect(() => {
        setSelected([]);
    }, [solves]);
    const rows = solves ? solves : [];
    type Order = 'asc' | 'desc';

    interface HeadCell {
        disablePadding: boolean;
        id: keyof Solve;
        label: string;
        numeric: boolean;
    }

    const headCells: readonly HeadCell[] = [
        {
            id: 'cubeType',
            numeric: false,
            disablePadding: true,
            label: 'Cube Type',
        },
        {
            id: 'time',
            numeric: true,
            disablePadding: false,
            label: 'Solve Time',
        },
    ];

    interface EnhancedTableProps {
        numSelected: number;
        onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Solve) => void;
        onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
        order: Order;
        orderBy: string;
        rowCount: number;
    }

    function EnhancedTableHead(props: EnhancedTableProps) {
        const {onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} =
            props;
        const createSortHandler =
            (property: keyof Solve) => (event: React.MouseEvent<unknown>) => {
                onRequestSort(event, property);
            };

        return (
            <TableHead>
                <TableRow>
                    {selectable && <TableCell padding="checkbox">
                        <Checkbox
                            color="primary"
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{
                                'aria-label': 'select all desserts',
                            }}
                        />
                    </TableCell>}
                    {headCells && headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={'center'}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    }

    interface EnhancedTableToolbarProps {
        numSelected: number;
    }

    const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
        const {numSelected} = props;

        return (
            <Toolbar
                sx={{
                    pl: {sm: 2},
                    pr: {xs: 1, sm: 1},
                    ...(numSelected > 0 && {
                        bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                    }),
                }}
            >
                {numSelected > 0 ? (
                    <Typography
                        sx={{flex: '1 1 100%'}}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography
                        sx={{flex: '1 1 100%'}}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        Solves
                    </Typography>
                )}
                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton>
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Filter list">
                        <IconButton>
                            <FilterListIcon/>
                        </IconButton>
                    </Tooltip>
                )}
            </Toolbar>
        );
    };

    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Solve>('number');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Solve,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        let updated;
        if (event.target.checked) {
            updated = rows ? rows.map((n) => n.solveId) : [];
            setSelected(updated);
        } else {
            updated = [];
            setSelected(updated);
        }
        onSelectedChanged(updated);
    };

    const handleClick = (event, solveId: string) => {
        let updated;
        if (event.target.checked) {
            updated = [...selected, solveId];
            setSelected(updated);
        } else {
            updated = selected.filter(item => item !== solveId);
            setSelected(updated);
        }
        onSelectedChanged(updated);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (name: string | number) => selected.indexOf(String(name)) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
    return (
        <Box sx={{width: width ? width : '100%'}}>
            <Paper sx={{width: '100%', mb: 2}}>
                <EnhancedTableToolbar numSelected={selected.length}/>
                <TableContainer>
                    <Table
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.solveId);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.solveId)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.solveId}
                                            selected={isItemSelected}
                                        >
                                            {selectable && <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                />
                                            </TableCell>}
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                                align={'center'}
                                            >
                                                {row.cubeType}
                                            </TableCell>
                                            <TableCell
                                                align="center">{new TimeFormatter().getFullTime(row.time)}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
};