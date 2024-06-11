import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { OfferAddForm } from 'sections/@dashboard/offer';
import { useGetOneOfferById } from 'services/offerServices';
import BlankPage from '../BlankPage';

export default function OfferEditForm() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const { data: OfferData, isLoading, isError } = useGetOneOfferById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title>Offer : Edit Offer</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Offer"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Offer',
              href: PATH_DASHBOARD.offer.list,
            },
            { name: OfferData?.title },
          ]}
        />
        <OfferAddForm isEdit OfferData={OfferData} />
      </Container>
    </>
  );
}
