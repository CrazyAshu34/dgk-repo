import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { ChangePassword } from 'sections/@dashboard/dealer';
import { useGetOneDealerById } from 'services/dealerServices';

import BlankPage from '../BlankPage';

export default function DealerChangePassword() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();

  const { data: oneDealerData, isLoading, isError } = useGetOneDealerById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError === true) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title>Dealer || ChangePassword</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Dealer Change Password"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Dealer',
              href: PATH_DASHBOARD.dealer.list,
            },
            { name: oneDealerData?.dist_com_name },
          ]}
        />
        <ChangePassword dealerData={oneDealerData} />
      </Container>
    </>
  );
}
