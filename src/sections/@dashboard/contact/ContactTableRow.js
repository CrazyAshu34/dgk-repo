import { TableCell, TableRow, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { CustomAvatar } from 'components/custom-avatar';
import moment from 'moment';
import PropTypes from 'prop-types';

ContactTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  onOpenDialog: PropTypes.func,
};

export default function ContactTableRow({ row, index, onOpenDialog }) {
  const { name, contactNo, emailId, city, createdAt } = row;

  return (
    <TableRow hover>
      <TableCell align="left">{index + 1}</TableCell>

      <TableCell onClick={() => onOpenDialog()} sx={{ cursor: 'pointer' }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <CustomAvatar name={name} />

          <div>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </div>
        </Stack>
      </TableCell>

      <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={() => onOpenDialog()}>
        {contactNo}
      </TableCell>

      <TableCell align="left">{emailId}</TableCell>

      <TableCell align="left">{city}</TableCell>
      <TableCell align="left">{moment(createdAt).format('DD MMM YYYY')}</TableCell>
    </TableRow>
  );
}
