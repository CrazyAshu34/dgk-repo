import { Card, Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen/LoadingScreen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { Dealer, DealerCover } from 'sections/@dashboard/dealer';
import { useGetOneDealerById } from 'services/dealerServices';
import { _userAbout } from '_mock/arrays';
import BlankPage from '../BlankPage';

export default function Detail() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const { data: dealerData, isLoading, isError } = useGetOneDealerById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title>Dealer Management: Dealer Management Details</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Dealer Management Details"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Dealer ',
              href: PATH_DASHBOARD.dealer.list,
            },
            { name: dealerData?.dist_name || '' },
          ]}
        />

        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative',
          }}
        >
          <DealerCover dealerData={dealerData} myProfile={_userAbout} />
        </Card>

        <Dealer myProfile={_userAbout} dealerData={dealerData} />
      </Container>
    </>
  );
}
