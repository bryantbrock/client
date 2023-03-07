import { TableRow, TableCell, Typography } from '@mui/material';
import React from 'react'
import { styled } from '@mui/material/styles';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const HistoryRow = ({ doc }) => {
    const {
        id,
        details,
        user,
        action,
        timestamp,
    } = doc
    return (
        <StyledTableRow
            key={id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell align="left">
                {details}
            </TableCell>

            <TableCell align="left">
                {user.first_name} {user.last_name}
            </TableCell>

            <TableCell align="left">
                <Typography>
                    {new Date(timestamp).toLocaleString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </Typography>
            </TableCell>

            <TableCell align="left">
                <Typography>
                    {action}
                </Typography>
            </TableCell>
        </StyledTableRow>
    )
}

export default HistoryRow