import { IconButton, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import Select from '@mui/material/Select';
import { Stack } from '@mui/system';
import { CustomAvatar } from 'components/custom-avatar';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover/MenuPopover';
import { useUpdateDesignationById } from '../../../services/designationServices';

DesignationTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  onEditRow: PropTypes.func,
};

export default function DesignationTableRow({ row, index, onEditRow }) {
  const [openPopover, setOpenPopover] = useState(null);
  const [statusPage, setStatusPage] = useState(null);

  const { _id, designationStatus, designationName } = row;

  const { updateDesignation } = useUpdateDesignationById();

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };
  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  useEffect(() => {
    if (designationStatus === 'Active') {
      setStatusPage('Active');
    } else {
      setStatusPage('InActive');
    }
  }, [designationStatus]);

  const onSubmit = async (data) => {
    setStatusPage(data);
    const payload = {
      id: _id,
      designationStatus: data,
    };
    updateDesignation(payload);
  };

  return (
    <>
      <TableRow hover>
        <TableCell align="left">{index + 1}</TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <CustomAvatar name={designationName} />

            <div>
              <Typography variant="subtitle2" noWrap>
                {designationName}
              </Typography>
            </div>
          </Stack>
        </TableCell>

        <TableCell align="left">
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            onChange={(e) => onSubmit(e.target.value)}
            value={statusPage}
            sx={{ height: '40px', width: 120 }}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="InActive">InActive</MenuItem>
          </Select>
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
