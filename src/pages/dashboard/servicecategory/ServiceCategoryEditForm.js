import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { ServiceCategoryAddForm } from 'sections/@dashboard/servicecategory';
import { useGetOneServiceCategoryById } from 'services/servicecategoryServices';
import BlankPage from '../BlankPage';

export default function ServiceCategoryEditForm() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const { data: servicecategoryData, isLoading, isError } = useGetOneServiceCategoryById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title>Category: Edit Category</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a Edit Category"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Category',
              href: PATH_DASHBOARD.servicecategory.list,
            },
            { name: servicecategoryData?.name },
          ]}
        />
        <ServiceCategoryAddForm isEdit servicecategoryData={servicecategoryData} />
      </Container>
    </>
  );
}
