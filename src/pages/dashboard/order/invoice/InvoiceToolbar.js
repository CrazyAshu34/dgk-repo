// next
// import { useRouter } from 'next/router';
// @mui
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
// routes
// components
import Iconify from '../../../../components/iconify';
//
import InvoicePDF from './InvoicePDF';
// ----------------------------------------------------------------------

InvoiceToolbar.propTypes = {
  invoice: PropTypes.object,
  isIgst: PropTypes.bool,
  rajya: PropTypes.string,
};

export default function InvoiceToolbar({ invoice, isIgst, rajya }) {
  return (
    <>
      <PDFDownloadLink
        document={<InvoicePDF invoice={invoice} isIgst={isIgst} rajya={rajya} />}
        fileName={invoice?.orderId}
        style={{ textDecoration: 'none' }}
      >
        {({ loading }) => (
          <Tooltip title="Download Invoice">
            <IconButton>
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <Iconify icon="zondicons:download" />
              )}
            </IconButton>
          </Tooltip>
        )}
      </PDFDownloadLink>
      {/* <Box sx={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
          <InvoicePDF invoice={invoice} />
        </PDFViewer>
      </Box> */}
    </>
  );
}
