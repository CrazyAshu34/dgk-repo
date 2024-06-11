import { IconButton, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover/MenuPopover';

ColorFamiliesTableRow.propTypes = {
    row: PropTypes.object,
    index: PropTypes.number,
    onEditRow: PropTypes.func,
};

export default function ColorFamiliesTableRow({ row, index, onEditRow }) {
    const [openPopover, setOpenPopover] = useState(null);
    const { colorName, hexaColor } = row;

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
                    <Typography variant="subtitle2">{colorName}</Typography>
                </TableCell>

                <TableCell align="left">
                    <div
                        style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: hexaColor,
                            float: 'left',
                            marginRight: '5px'
                        }}
                    ></div>{hexaColor}

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
