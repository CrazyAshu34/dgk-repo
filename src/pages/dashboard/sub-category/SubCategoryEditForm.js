import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { SubCategoryAddForm } from 'sections/@dashboard/subcategory';
import { useGetOneSubCategoriesById } from 'services/subCategoryServices';
import BlankPage from '../BlankPage';

export default function SubCategoryEditForm() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const { data: subCategoryData, isLoading, isError } = useGetOneSubCategoriesById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title>Sub Category: Edit Sub Category</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a Edit Sub Category"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Sub Category',
              href: PATH_DASHBOARD.subcategory.list,
            },
            { name: subCategoryData.name },
          ]}
        />
        <SubCategoryAddForm isEdit subCategoryData={subCategoryData} id={id} />
      </Container>
    </>
  );
}
