import { Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { PATH_DASHBOARD } from 'routes/paths';
import { ConfigEditForm } from 'sections/@dashboard/generalconfig';
import { useGetAllGeneralConfig } from 'services/generalconfigServices';
import BlankPage from '../BlankPage';

export default function GeneralConfigEditForm() {
  const { themeStretch } = useSettingsContext();

  const { data: generalConfigData, isLoading, isError } = useGetAllGeneralConfig();

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title>General Config: Edit General Config</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit General Config"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'General Config',
              href: PATH_DASHBOARD.generalconfig.root,
            },
            { name: generalConfigData[0]?.gst },
          ]}
        />

        <ConfigEditForm generalConfigData={generalConfigData[0]} />
      </Container>
    </>
  );
}
