import { Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { PATH_DASHBOARD } from 'routes/paths';
import { ProductAMCViewForm } from 'sections/@dashboard/amc';
import { useGetDetailOneAmcById } from 'services/amcServices';
import BlankPage from '../BlankPage';

export default function AmcEditForm() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const { data: productAMCAdata, isLoading, isError } = useGetDetailOneAmcById(id);
console.log("productAMCAdata=",productAMCAdata);
  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title>Product AMC Management: View Product AMC Management</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="View Product AMC Management"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Product AMC Management',
              href: PATH_DASHBOARD.amc.list,
            },
            { name: productAMCAdata?.customer_name },
          ]}
        />
        <ProductAMCViewForm isEdit productAMCAdata={productAMCAdata} />
      </Container>
    </>
  );
}
