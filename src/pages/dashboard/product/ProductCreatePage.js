import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// _mock_
// components
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections
import { ProductAddEditForm } from '../../../sections/@dashboard/product'; 

// ----------------------------------------------------------------------

export default function UserProfilePage() {
  const { themeStretch } = useSettingsContext();

  const { user } = useAuthContext();

  const [currentTab, setCurrentTab] = useState('product basic');
  const [productId, setProductId] = useState();
  const [productBasic, setProductBasic] = useState();
  const [allFields, setAllFields] = useState([]);
 
  return (
    <>
      <Helmet>
        <title>Create a new Product</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        {' '}
        <CustomBreadcrumbs
          heading="Create a new Product"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Products',
              href: PATH_DASHBOARD.product.list,
            },
            {
              name: 'New Product',
            },
          ]}
        />
         <ProductAddEditForm setProductBasic={setProductBasic} onChangeTab={setCurrentTab} setAddProductId={setProductId} />
      </Container>
    </>
  );
}
