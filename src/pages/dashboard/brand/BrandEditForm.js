import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { BrandAddForm } from 'sections/@dashboard/brand';
import { useGetOneBrandById } from 'services/brandServices';
import BlankPage from '../BlankPage';

export default function BrandEditForm() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const { data: brandData, isLoading, isError } = useGetOneBrandById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title>Brand: Edit Brand</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a Edit Brand"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Brand',
              href: PATH_DASHBOARD.brand.list,
            },
            { name: brandData?.name },
          ]}
        />
        <BrandAddForm isEdit brandData={brandData} />
      </Container>
    </>
  );
}
