import { IconButton, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover/MenuPopover';

HsnTableRow.propTypes = {
    row: PropTypes.object,
    index: PropTypes.number,
    onEditRow: PropTypes.func,
};

export default function HsnTableRow({ row, index, onEditRow }) {
    const [openPopover, setOpenPopover] = useState(null);
    const { title, hsnCode } = row;

    const handleOpenPopover = (event) => {
        setOpenPopover(event.currentTarget);
    };

    const handleClosePopover = () => {
        setOpenPopover(null);
    };

    return (
        <>
            <TableRow hover>
                <TableCell align="left">{index + 1}</TableCell>

                <TableCell>
                    {title}
                </TableCell>

                <TableCell>
                    <Typography variant="subtitle2">{hsnCode}</Typography>
                </TableCell>
                <TableCell align="right">
                    <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <MenuPopover
                open={openPopover}
                onClose={handleClosePopover}
                arrow="right-top"
                sx={{ width: 160 }}
            >
                <MenuItem
                    onClick={() => {
                        onEditRow();
                        handleClosePopover();
                    }}
                >
                    <Iconify icon="eva:edit-fill" />
                    Edit
                </MenuItem>
            </MenuPopover>
        </>
    );
}
