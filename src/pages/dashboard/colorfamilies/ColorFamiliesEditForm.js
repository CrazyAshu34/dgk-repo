import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import ColorFamiliesAddForm from 'sections/@dashboard/colorfamilies/ColorFamiliesAddForm';
import { useGetOneColorFamilyById } from 'services/colorfamiliesServices';
import BlankPage from '../BlankPage';

export default function DiscountEditForm() {
    const { themeStretch } = useSettingsContext();
    const { id } = useParams();

    const { data: colorData, isLoading, isError } = useGetOneColorFamilyById(id);

    if (isLoading) return <LoadingScreen />;

    if (isError) return <BlankPage />;

    return (
        <>
            <Helmet>
                <title>Color Families : Edit Color Families</title>
            </Helmet>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Edit Color Families"
                    links={[
                        {
                            name: 'Dashboard',
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: 'Color Families',
                            href: PATH_DASHBOARD.colorfamilies.list,
                        },
                        { name: colorData?.colorName },
                    ]}
                />
                <ColorFamiliesAddForm isEdit colorData={colorData} />
            </Container>
        </>
    );
}
