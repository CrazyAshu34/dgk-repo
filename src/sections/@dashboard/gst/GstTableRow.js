import { IconButton, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover/MenuPopover';

GstTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  onEditRow: PropTypes.func,
};

export default function GstTableRow({ row, index, onEditRow }) {
  const [openPopover, setOpenPopover] = useState(null);
  const { name, sgst, igst, totalGst } = row;

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
           {name}
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2">{sgst}</Typography>
        </TableCell>

        <TableCell align="left">{igst}</TableCell>
        <TableCell align="left">{totalGst}</TableCell>

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
