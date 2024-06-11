import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { SuperSubCategoryAddForm } from 'sections/@dashboard/supersubcategory';
import { useGetOneSuperSubCategoriesById } from 'services/superSubCategoryServices';
import BlankPage from '../BlankPage';

export default function SuperSubCategoryEditForm() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const { data: superSubCategoryData, isLoading, isError } = useGetOneSuperSubCategoriesById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title>Super Sub Category: Edit Super Sub Category</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a Edit Super Sub Category"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            // {
            //   name: 'Super Sub Category',
            //   href: PATH_DASHBOARD.supersubcategory.list,
            // },
            { name: superSubCategoryData?.name },
          ]}
        />
        <SuperSubCategoryAddForm isEdit superSubCategoryData={superSubCategoryData} />
      </Container>
    </>
  );
}
