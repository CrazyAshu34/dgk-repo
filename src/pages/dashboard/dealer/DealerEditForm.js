import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { DealerEditForm } from 'sections/@dashboard/dealer';
import { useGetOneDealerById } from 'services/dealerServices';
import BlankPage from '../BlankPage';

export default function Edit() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const { data: DealerData, isLoading, isError } = useGetOneDealerById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  console.log('DealerData', DealerData);

  return (
    <>
      <Helmet>
        <title>Dealer : Edit Dealer Management</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Dealer Management"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Dealer Management',
              href: PATH_DASHBOARD.dealer.list,
            },
            { name: DealerData?.dist_com_name },
          ]}
        />

        <DealerEditForm DealerData={DealerData} />
      </Container>
    </>
  );
}
