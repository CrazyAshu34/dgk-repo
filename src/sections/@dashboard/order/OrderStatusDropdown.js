import { MenuItem } from '@mui/material';
import Select from '@mui/material/Select';
import PropTypes from 'prop-types';
import Label from '../../../components/label';

OrderStatusDropdown.propTypes = {
  rowData: PropTypes.object,
  updateStatus: PropTypes.string,
  orderStatus: PropTypes.string,
  orderStatusTimeline: PropTypes.array,
};
export default function OrderStatusDropdown({ rowData, handleChange, orderStatus, orderStatusTimeline }) {
  let orderStatusOptions = orderStatusTimeline;
  let updateStatus = "PLACED";
  const attemptedStatuses = ["PLACED", "PROCESSING", "PACKED", "ASSIGN_TO_SHIPROCKET"];
  const attemptedExchangeStatus = ["EXCHANGE_INITIATED", "EXCHANGE_ACCEPTED", "EXCHANGE_PRODUCT_PICKED_UP", "EXCHANGE_RECEIVED", "EXCHANGE_PROCESSING", "EXCHANGE_PACKED", "EXCHANGE_ASSIGN_TO_SHIPROCKET"];
  const attemptedReturnedStatus = ["RETURN_INITIATED", "RETURN_ACCEPTED", "RETURN_PRODUCT_PICKED_UP", "RETURNED"];
  const attemptedCancelledStatus = ["CANCELLED"];

  let options = attemptedStatuses;
  // CHECK ORDER EXCHANGE_INITIATED OR NOT
  const exchangeInitiatedIndex = orderStatusTimeline.findIndex(item => item.status === "EXCHANGE_INITIATED");
  const isExchangeInitiated = orderStatusTimeline.some(item => item.status === "EXCHANGE_INITIATED");
  if (exchangeInitiatedIndex !== -1 && isExchangeInitiated) {
    const filteredExchangeArray = orderStatusTimeline.filter((item, index) => index >= exchangeInitiatedIndex);
    orderStatusOptions = filteredExchangeArray;
    updateStatus = "EXCHANGE_INITIATED";
    options = attemptedExchangeStatus;
  }
  // CHECK ORDER EXCHANGE_INITIATED OR NOT
  const returnInitiatedIndex = orderStatusTimeline.findIndex(item => item.status === "RETURN_INITIATED");
  const isReturnInitiated = orderStatusTimeline.some(item => item.status === "RETURN_INITIATED");
  if (returnInitiatedIndex !== -1 && isReturnInitiated) {
    const filteredReturnArray = orderStatusTimeline.filter((item, index) => index >= returnInitiatedIndex);
    orderStatusOptions = filteredReturnArray;
    updateStatus = "RETURN_INITIATED";
    options = attemptedReturnedStatus;
  }
  // CHECK ORDER CANCEL OR NOT
  const cancelledInitiatedIndex = orderStatusTimeline.findIndex(item => item.status === "CANCELLED");
  const isOrderCancelled = orderStatusTimeline.some(item => item.status === "CANCELLED");
  if (cancelledInitiatedIndex !== -1 && isOrderCancelled) {
    const filteredCancelledArray = orderStatusTimeline.filter((item, index) => index >= cancelledInitiatedIndex);
    orderStatusOptions = filteredCancelledArray;
    updateStatus = "";
    options = attemptedCancelledStatus;
  }
  console.log("rowData=", rowData);

  return (
    <>
      {orderStatus === "PLACED" ||
        orderStatus === "PROCESSING" ||
        orderStatus === "PACKED" ||
        orderStatus === "ASSIGN_TO_SHIPROCKET" ||
        orderStatus === "CANCELLED" ||
        orderStatus === "EXCHANGE_INITIATED" ||
        orderStatus === "EXCHANGE_ACCEPTED" ||
        orderStatus === "EXCHANGE_PRODUCT_PICKED_UP" ||
        orderStatus === "EXCHANGE_RECEIVED" ||
        orderStatus === "EXCHANGE_PROCESSING" ||
        orderStatus === "EXCHANGE_PACKED" ||
        orderStatus === "EXCHANGE_ASSIGN_TO_SHIPROCKET" ||
        orderStatus === "RETURN_INITIATED" ||
        orderStatus === "RETURN_ACCEPTED" ||
        orderStatus === "RETURN_PRODUCT_PICKED_UP" ||
        orderStatus === "RETURNED" ? <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          style={{ display: 'block', fontSize: '0.875rem' }}
          value={orderStatus}
          onChange={(event) => handleChange(event, updateStatus, rowData?.orderDetails?.orderMode)}
        >
        {options?.map((status) => (
          <MenuItem key={status} value={status}
            disabled={
              orderStatus === status ||
              orderStatusOptions.some(
                (timelineItem) => timelineItem.status === status
              )
            }
          >
            {status}
          </MenuItem>
        ))}
      </Select>
        :
        <Label
          variant="soft"
          color={
            (orderStatus === 'RETURN_INITIATED' && 'warning') ||
            (orderStatus === 'EXCHANGE_INITIATED' && 'warning') ||
            (orderStatus === 'SHIPROCKET_DELIVERED' && 'success') ||
            (orderStatus === 'EXCHANGED' && 'success') ||
            (orderStatus === 'CANCELLED' && 'error') ||
            'primary'
          }
        >
          {orderStatus}
        </Label>

      }

    </>
  );
}; 
