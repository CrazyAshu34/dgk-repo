import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { DiscountAddForm } from 'sections/@dashboard/discount';
import { useGetOneDiscountById } from 'services/discountServices';
import BlankPage from '../BlankPage';

export default function DiscountEditForm() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const { data: discountData, isLoading, isError } = useGetOneDiscountById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title>Coupon : Edit Coupon</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Coupon"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Coupon',
              href: PATH_DASHBOARD.discount.list,
            },
            { name: discountData?.discount_name },
          ]}
        />
        <DiscountAddForm isEdit discountData={discountData} />
      </Container>
    </>
  );
}
