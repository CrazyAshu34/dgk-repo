import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { HsnAddForm } from 'sections/@dashboard/hsn';
import { useGetOneHsnById } from 'services/hsnServices';
import BlankPage from '../BlankPage';


export default function HsnEditForm() {
    const { themeStretch } = useSettingsContext();
    const { id } = useParams();
    const { data: hsnData, isLoading, isError } = useGetOneHsnById(id);

    if (isLoading) return <LoadingScreen />;

    if (isError) return <BlankPage />;

    return (
        <>
            <Helmet>
                <title>HSN : Edit HSN</title>
            </Helmet>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Edit HSN"
                    links={[
                        {
                            name: 'Dashboard',
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: 'HSN',
                            href: PATH_DASHBOARD.hsn.list,
                        },
                        { name: hsnData?.title },
                    ]}
                />
                <HsnAddForm isEdit hsnData={hsnData} />
            </Container>
        </>
    );
}
