import { Card, CardHeader, Link, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import Iconify from '../../../components/iconify';

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

CustomerAbout.propTypes = {
  customerData: PropTypes.func,
};

export default function CustomerAbout({ customerData }) {
  const { emailId, mobileNumber } = customerData;
  const { id } = useParams();
  return (
    <>
      <Card>
        <CardHeader title="Contact Information" />

        <Stack spacing={2} sx={{ p: 3 }}>
          <Stack direction="row">
            <IconStyle icon="ci:phone" />
            <Typography variant="body2">
              <Link component="span" variant="subtitle2" color="text.primary">
                {mobileNumber}
              </Link>
            </Typography>
          </Stack>

          <Stack direction="row">
            <IconStyle icon="eva:email-fill" />
            <Typography variant="body2">{emailId}</Typography>
          </Stack>
        </Stack>
      </Card>
    </>
  );
}
