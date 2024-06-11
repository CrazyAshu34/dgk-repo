import { Card, CardHeader, Link, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import LoadingScreen from 'components/loading-screen';
import BlankPage from 'pages/dashboard/BlankPage';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import Iconify from '../../../components/iconify';
import { useGetAddressCustomerById } from '../../../services/customerServices';

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

DealerAbout.propTypes = {
  dealerData: PropTypes.object,
};

export default function DealerAbout({ dealerData }) {
  const { pincode, city, dist_email, dist_contact, dist_address } = dealerData;
console.log("dealerData==",dealerData)
  const { id } = useParams();

  const { data: address, isLoading, isError } = useGetAddressCustomerById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  return (
    <>
      <Card>
        <CardHeader title="About" />

        <Stack spacing={2} sx={{ p: 3 }}>
          <Stack direction="row">
            <IconStyle icon="ci:phone" />
            <Typography variant="body2">
              <Link component="span" variant="subtitle2" color="text.primary">
                {dist_contact}
              </Link>
            </Typography>
          </Stack>

          <Stack direction="row">
            <IconStyle icon="eva:email-fill" />
            <Typography variant="body2">{dist_email}</Typography>
          </Stack>

          <Stack direction="row">
            <IconStyle icon="mdi:city" />
            <Typography variant="body2">
            City - &nbsp;
              <Link component="span" variant="subtitle2" color="text.primary">
                 {city}
              </Link>
            </Typography>
          </Stack>

          <Stack direction="row">
            <IconStyle icon="entypo:address" />
            <Typography variant="body2">
              Pincode - &nbsp;
              <Link component="span" variant="subtitle2" color="text.primary">
                {pincode}
              </Link>
            </Typography>
          </Stack>
          <Stack direction="row">
            <IconStyle icon="mdi:city" />
            <Typography variant="body2">
            Complete Address - &nbsp;
              <Link component="span" variant="subtitle2" color="text.primary">
                 {dist_address}
              </Link>
            </Typography>
          </Stack>
        </Stack>
      </Card>

      {address?.length
        ? address?.map((row) => (
            <Card>
              <CardHeader title="Address" />
              <Stack spacing={2} sx={{ p: 3 }}>
                {row.delivery_address == null || row.delivery_address === '' ? null : (
                  <Stack direction="row">
                    <IconStyle icon="eva:pin-fill" />
                    <Typography variant="body2">
                      <Link component="span" variant="subtitle2" color="text.primary">
                        {row.delivery_address}
                      </Link>
                      <br />
                      <Link component="span" variant="subtitle2" color="text.primary">
                        {`City ${row.city} ${row.pincode}`}
                      </Link>
                    </Typography>
                  </Stack>
                )}

                {row.geo_location == null || row.geo_location === '' ? null : (
                  <Stack direction="row">
                    <IconStyle icon="entypo:location" />
                    <Typography variant="body2">
                      {/* <Link component="span" variant="subtitle2" color="text.primary">
                {row.geo_location} 
              </Link>
              <br /> */}
                      <Link component="span" variant="subtitle2" color="text.primary">
                        {`City ${row.city} ${row.pincode}`}
                      </Link>
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Card>
          ))
        : null}
    </>
  );
}
