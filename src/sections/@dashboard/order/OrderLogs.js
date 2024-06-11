import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab';
import {
  Card,
  CardContent,
  Stack,
  Typography
} from '@mui/material';
import moment from "moment";
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSettingsContext } from '../../../components/settings';


OrderLogs.propTypes = {
  orderData: PropTypes.array,
};
export default function OrderLogs({ orderData }) {
  const { themeStretch } = useSettingsContext();
  const [shipOrderData, setShipOrderData] = useState(null);
  const [shipReturnOrderData, setShipReturnOrderData] = useState(null);
  const [shipExchangeOrderData, setShipExchangeOrderData] = useState(null);



  return (
    <Card>
      {/* <CardHeader  /> */}
      {orderData?.orderStatusTimeline.length > 0 ?
        <CardContent
          sx={{
            '& .MuiTimelineItem-missingOppositeContent:before': {
              display: 'none',
            },
          }}
        >
          <Timeline>
            {orderData?.orderStatusTimeline.map((item, index) => (<>
              <OrderItem key={item._id} item={item} isLast={index === orderData?.orderStatusTimeline.length - 1} cancellationDetails={orderData?.cancellationDetails} />
            </>
            ))}
          </Timeline>
        </CardContent> : "No Order Logs!"}
    </Card>
  );
}


// ----------------------------------------------------------------------

OrderItem.propTypes = {
  isLast: PropTypes.bool,
  item: PropTypes.shape({
    status: PropTypes.string,
    timestamp: PropTypes.string,
  }),
  cancellationDetails: PropTypes.object,
};

function OrderItem({ item, isLast, cancellationDetails }) {
  console.log("====", item)
  const { status, timestamp } = item;
  return (<>
    {status === "ASSIGN_TO_SHIPROCKET" || status === "EXCHANGE_INITIATED" || status === "RETURN_INITIATED" ?
      <ShiprocketTracking isLast={isLast} status={status} timestamp={timestamp} />
      :
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot
            color={
              (status === 'PLACED' && 'primary') ||
              (status === 'PROCESSING' && 'info') ||
              (status === 'PACKED' && 'info') ||
              (status === 'ASSIGN_TO_SHIPROCKET' && 'success') ||
              (status === 'DELIVERED' && 'success') ||
              (status === 'EXCHANGE_INITIATED' && 'info') ||
              (status === 'EXCHANGE_ACCEPTED' && 'info') ||
              (status === 'RETURN_PRODUCT_PICKED_UP' && 'info') ||
              (status === 'RETURN_INITIATED' && 'info') ||
              (status === 'RETURN_ACCEPTED' && 'info') ||
              (status === 'RETURN_PRODUCT_PICKED_UP' && 'info') ||
              (status === 'EXCHANGED' && 'success') ||
              (status === 'RETURNED' && 'warning') ||
              (status === 'CANCELLED' && 'error') ||
              'primary'
            }
          />
          {isLast ? null : <TimelineConnector />}
        </TimelineSeparator>

        <TimelineContent>
          <Stack direction="column" alignItems="left" spacing={1}>
            <Typography variant="subtitle2">
              {status}
            </Typography>
            {/* <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {adminusers.length > 0 ? `Changed by -  ${adminusers[0]?.name}` : ''}
        </Typography> */}
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {/* {`Date Time -  ${moment(timestamp).utcOffset("+05:30").format('DD-MMMM-YYYY H:m')}`} */}
              {`Date Time -  ${moment(timestamp).format('DD-MMM-YYYY')} ${moment(timestamp).format('hh:mm A')}`}

            </Typography>
            {status === "CANCELLED" ?
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {`Cancelled Reason -  ${cancellationDetails?.cancellationReason}`}

              </Typography>
              : null}</Stack>
        </TimelineContent>
      </TimelineItem>
    }
  </>
  );
}

ShiprocketTracking.propTypes = {
  isLast: PropTypes.bool,
  status: PropTypes.string,
  timestamp: PropTypes.string,
};

function ShiprocketTracking({ isLast, status, timestamp }) {
  return (<>
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          color={
            (status === 'PLACED' && 'primary') ||
            (status === 'PROCESSING' && 'info') ||
            (status === 'PACKED' && 'info') ||
            (status === 'ASSIGN_TO_SHIPROCKET' && 'success') ||
            (status === 'SHIPROCKET_DELIVERED' && 'success') ||
            (status === 'EXCHANGE_INITIATED' && 'info') ||
            (status === 'EXCHANGE_ACCEPTED' && 'info') ||
            (status === 'RETURN_PRODUCT_PICKED_UP' && 'info') ||
            (status === 'RETURN_INITIATED' && 'info') ||
            (status === 'RETURN_ACCEPTED' && 'info') ||
            (status === 'RETURN_PRODUCT_PICKED_UP' && 'info') ||
            (status === 'EXCHANGED' && 'success') ||
            (status === 'RETURNED' && 'warning') ||
            (status === 'CANCELLED' && 'error') ||
            'primary'
          }
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent>
        <Stack direction="column" alignItems="left" spacing={1}>
          <Typography variant="subtitle2">
            {status}
          </Typography>
          {/* <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {adminusers.length > 0 ? `Changed by -  ${adminusers[0]?.name}` : ''}
        </Typography> */}
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {/* {`Date Time -  ${moment(timestamp).utcOffset("+05:30").format('DD-MMMM-YYYY H:m')}`} */}
            {`Date Time -  ${moment(timestamp).format('DD-MMM-YYYY')} ${moment(timestamp).format('hh:mm A')}`}

          </Typography>
          {status === "CANCELLED" ?
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {`Cancelled Reason -  ${cancellationDetails?.cancellationReason}`}

            </Typography>
            : null}</Stack>
      </TimelineContent>
    </TimelineItem>
  </>
  );
}
