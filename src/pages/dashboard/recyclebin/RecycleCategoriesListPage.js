import { Box, Container, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PATH_DASHBOARD } from 'routes/paths';
// components
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen/LoadingScreen';
import { useSettingsContext } from 'components/settings';
import {
  CategoryList,
  SubCategoryList,
  SuperSubCategoryList,
} from 'sections/@dashboard/recyclebin';
import { useGetAllDeleteCategoriesRecyclebin } from 'services/categoryServices';
import { useGetAllDeleteSubCategoriesRecyclebin } from 'services/subCategoryServices';
import { useGetAllDeleteSuperSubCategoriesRecyclebin } from 'services/superSubCategoryServices';
import BlankPage from '../BlankPage';

export default function UserProfilePage() {
  const { themeStretch } = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('category');

  const {
    data: Categories,
    isLoading: categoryIsLoading,
    isError: categoryIsError,
  } = useGetAllDeleteCategoriesRecyclebin();
  const {
    data: SubCategoryData,
    isLoading: subCategoryIsLoading,
    isError: subCategoryIsError,
  } = useGetAllDeleteSubCategoriesRecyclebin();
  const {
    data: superSubCategoryData,
    isLoading: superSubCategoryIsLoading,
    isError: superSubCategoryIsError,
  } = useGetAllDeleteSuperSubCategoriesRecyclebin();

  const TABS = [
    {
      // value: `category ${Categories.length}`,
      value: 'category',
      label: `(${Categories?.length}) Category`,
      // icon: <Iconify icon="mdi:category" />,
      component: <CategoryList />,
    },
    {
      value: 'sub category ',
      label: `(${SubCategoryData?.length}) Sub Category`,
      // icon: <Iconify icon="carbon:category-new" />,
      component: <SubCategoryList />,
    },
    {
      value: 'super sub category',
      label: `(${superSubCategoryData?.length}) Super Sub Category`,
      // icon: <Iconify icon="carbon:category" />,
      component: <SuperSubCategoryList />,
    },
  ];

  if (categoryIsLoading || subCategoryIsLoading || superSubCategoryIsLoading)
    return <LoadingScreen />;

  if (categoryIsError || subCategoryIsError || superSubCategoryIsError) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title> Categories List Recycle Bin </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Categories List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'All Categories', href: PATH_DASHBOARD.recyclebin.categorieslist },
          ]}
        />

        <Box
          sx={{
            mb: 3,
            height: 50,
            position: 'relative',
          }}
        >
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            sx={{
              width: 1,
              bottom: 0,
              zIndex: 9,
              position: 'absolute',
              '& .MuiTabs-flexContainer': {
                pr: { md: 3 },
                justifyContent: {
                  sm: 'center',
                  md: 'flex-start',
                },
              },
            }}
          >
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
            ))}
          </Tabs>
        </Box>

        {TABS.map(
          (tab) => tab.value === currentTab && <Box key={tab.value}> {tab.component} </Box>
        )}
      </Container>
    </>
  );
}
