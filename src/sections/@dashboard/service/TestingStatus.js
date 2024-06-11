import { Dialog, DialogTitle, MenuItem, TableCell } from '@mui/material';
import Select from '@mui/material/Select';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useStatusUpdateStatusById } from 'services/serviceServices';
import { onCloseModal, onOpenModal } from '../../../redux/slices/calendar';
import { useDispatch, useSelector } from '../../../redux/store';
import DialogAssigned from './DialogAssigned';

TestingStatus.propTypes = {
  itemId: PropTypes.object,
  status: PropTypes.string,
};

export default function TestingStatus({ itemId, status }) {
  const dispatch = useDispatch();
  const [allstatus, setAllstatus] = useState('');
  const [assignee, setAssignee] = useState([]);
  const { updateStatus } = useStatusUpdateStatusById();
  const userId = localStorage.getItem('userId');
  useEffect(() => {
    setAllstatus(status);
  }, [status]);

  const [statusPage, setStatusPage] = useState('New');
  const [statusfor, setStatusfor] = useState();

  useEffect(() => {
    if (allstatus === 'New') {
      setStatusPage('New');
    } else if (allstatus === 'Assigned') {
      setStatusPage('Assigned');
    } else if (allstatus === 'On The Way') {
      setStatusPage('On The Way');
    } else if (allstatus === 'On Progress') {
      setStatusPage('On Progress');
    } else if (allstatus === 'Completed') {
      setStatusPage('Completed');
    } else if (allstatus === 'Hold On Our Side') {
        setStatusPage('Hold On Our Side');
    } else if (allstatus === 'Hold On Client Side') {
        setStatusPage('Hold On Client Side');
    } else if (allstatus === 'Canceled') {
        setStatusPage('Canceled');
    }
  }, [allstatus]);

  const onStatus = async (data) => {
    setStatusPage(data);
  };

  const onSubmit = async (value) => {
    console.log(value, 'value', itemId);
    setStatusPage(value);
    const payload = {
      status: value,
      id: itemId,
      assign_to: '',
      user_id: userId,
    };
    updateStatus(payload);
  };
  const onAssignStaff = async (value) => {
     console.log(value, 'value111', itemId);
    setStatusPage('Assigned');
    const payload = {
      status: 'Assigned',
      id: itemId,
      assign_to: value,
      user_id: userId,
    };
    updateStatus(payload);
  };

  const { openModal } = useSelector((state) => state.calendar);

  const handleCloseModal = () => {
    dispatch(onCloseModal());
    setStatusfor('');
  };

  const handleAddEvent = (value) => {
    setStatusfor(value);
    dispatch(onOpenModal());
  };

  return (
    <>
      <TableCell align="left">
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          onChange={(e) => onStatus(e.target.value)}
          value={statusPage}
          sx={{ height: '40px', width: 120 }}
        >
          <MenuItem value='New' onClick={() => onSubmit('New')}>
            New
          </MenuItem>
          <MenuItem value='Assigned' onClick={() => handleAddEvent('Assigned')}>
            Assigned
          </MenuItem>

          <MenuItem value='On The Way' onClick={() => onSubmit('On The Way')}>
            On The Way
          </MenuItem>

          <MenuItem value='On Progress' onClick={() => onSubmit('On Progress')}>
            On Progress
          </MenuItem>

          <MenuItem value='Completed' onClick={() => onSubmit('Completed')}>
            Completed
          </MenuItem>

          <MenuItem value='Hold On Our Side' onClick={() => onSubmit('Hold On Our Side')}>
          Hold On Our Side
          </MenuItem>
          <MenuItem value='Hold On Client Side' onClick={() => onSubmit('Hold On Client Side')}>
          Hold On Client Side
          </MenuItem>
          <MenuItem value='Canceled' onClick={() => onSubmit('Canceled')}>
          Canceled
          </MenuItem>
        </Select>
      </TableCell>

      {statusfor === 'Assigned' ? (
        <Dialog fullWidth maxWidth="lg" open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Assigned</DialogTitle>
          <DialogAssigned
            id={itemId}
            statusPage={statusPage}
            onAssignStaff={onAssignStaff}
            setStatusfor={setStatusfor}
            onCancel={handleCloseModal}
            setAssignee={setAssignee}
            pageName="service"
          />
        </Dialog>
      ) : null}
    </>
  );
}
