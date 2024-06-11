import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { GstAddForm } from 'sections/@dashboard/gst';
import { useGetOneDiscountById } from 'services/discountServices';
import { useGetOneGstById } from 'services/gstServices';
import BlankPage from '../BlankPage';


export default function GstEditForm() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const { data: gstData, isLoading, isError } = useGetOneGstById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title>GST : Edit GST</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit GST"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'GST',
              href: PATH_DASHBOARD.gst.list,
            },
            { name: gstData?.gst_name },
          ]}
        />
        <GstAddForm isEdit gstData={gstData} />
      </Container>
    </>
  );
}
