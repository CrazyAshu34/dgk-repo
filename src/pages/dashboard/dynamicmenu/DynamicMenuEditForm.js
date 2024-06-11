import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { DynamicMenuAddForm } from 'sections/@dashboard/dynamicmenu';
import { useGetOneDynamicMenuById } from 'services/dynamicMenuServices';
import BlankPage from '../BlankPage';

export default function DynamicMenuEditForm() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const { data: dynamicmenuData, isLoading, isError } = useGetOneDynamicMenuById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title>Dynamic Menu: Edit Dynamic Menu</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a Edit Dynamic Menu"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Dynamic Menu',
              href: PATH_DASHBOARD.dynamicmenu.list,
            },
            { name: dynamicmenuData.menu_name },
          ]}
        />
        <DynamicMenuAddForm isEdit dynamicmenuData={dynamicmenuData} id={id} />
      </Container>
    </>
  );
}
