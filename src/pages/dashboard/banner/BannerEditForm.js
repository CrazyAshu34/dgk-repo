import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { BannerAddForm } from 'sections/@dashboard/banner';
import { useGetBannerById } from 'services/bannerServices';
import BlankPage from '../BlankPage';

export default function BannerEditForm() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const { data: bannerData, isLoading, isError } = useGetBannerById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title>Banner: Edit Banner</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a Edit Banner"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Banner',
              href: PATH_DASHBOARD.banner.list,
            },
            { name: bannerData.ban_title },
          ]}
        />
        <BannerAddForm isEdit bannerData={bannerData} />
      </Container>
    </>
  );
}
