import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
// @mui
import { Box, Container } from '@mui/material';
// routes
import { useGetProductById } from 'services/productServices';
import LoadingScreen from 'components/loading-screen';
import BlankPage from '../BlankPage';
import { PATH_DASHBOARD } from '../../../routes/paths';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// _mock_
// components
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections
import { ProductAddEditForm } from '../../../sections/@dashboard/product';
import { InputFields } from '../../../sections/@dashboard/product/variants/tab';

// ----------------------------------------------------------------------

export default function UserProfilePage() {
  const { themeStretch } = useSettingsContext();

  const { user } = useAuthContext();
  const { id } = useParams();
  const [currentTab, setCurrentTab] = useState('product basic');
  const [productId, setProductId] = useState();
  const [productBasic, setProductBasic] = useState();
  const [allFields, setAllFields] = useState([]);
  const { data, isLoading, isError } = useGetProductById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;
  console.log(currentTab, "<===okk===>", productId);
  const TABS = [
    {
      value: 'product basic',
      component: (
        <ProductAddEditForm setProductBasic={setProductBasic} onChangeTab={setCurrentTab} setAddProductId={setProductId} isEdit currentProduct={data[0]} />
      ),
    },
    {
      value: 'input fields',
      component: (
        <InputFields
          productBasic={productBasic}
          onChangeTab={setCurrentTab}
          allFields={allFields}
          setAllFields={setAllFields} productId={id} isEdit currentProduct={data[0]}
        />
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Create a new Product</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        {' '}
        <CustomBreadcrumbs
          heading="Create a Edit Product"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Products',
              href: PATH_DASHBOARD.product.list,
            },
            { name: data[0]?.title },
          ]}
        />
        <div style={{ marginTop: 20 }}>
          {TABS.map((tab) => {
            const isMatched = tab.value === currentTab;
            return isMatched && <Box key={tab.value}>{tab.component}</Box>;
          })}
        </div>
      </Container>
    </>
  );
}



// import { Container } from '@mui/material';
// import CustomBreadcrumbs from 'components/custom-breadcrumbs';
// import LoadingScreen from 'components/loading-screen';
// import { useSettingsContext } from 'components/settings';
// import { Helmet } from 'react-helmet-async';
// import { useParams } from 'react-router-dom';
// import { PATH_DASHBOARD } from 'routes/paths';
// import { ProductAddEditForm } from 'sections/@dashboard/product';
// import { useGetProductById } from 'services/productServices';
// import BlankPage from '../BlankPage';

// export default function ProductEditPage() {
//   const { themeStretch } = useSettingsContext();
//   const { id } = useParams();
//   // console.log('id', id);

//   const { data, isLoading, isError } = useGetProductById(id);

//   if (isLoading) return <LoadingScreen />;

//   if (isError) return <BlankPage />;

//  // console.log('data111', data);

//   return (
//     <>
//       <Helmet>
//         <title>Product: Edit Product</title>
//       </Helmet>

//       <Container maxWidth={themeStretch ? false : 'lg'}>
//         <CustomBreadcrumbs
//           heading="Create a Edit Product"
//           links={[
//             {
//               name: 'Dashboard',
//               href: PATH_DASHBOARD.root,
//             },
//             {
//               name: 'Products',
//               href: PATH_DASHBOARD.product.list,
//             },
//             { name: data[0]?.title },
//           ]}
//         />
//         <ProductAddEditForm isEdit currentProduct={data[0]} />
//       </Container>
//     </>
//   );
// }
