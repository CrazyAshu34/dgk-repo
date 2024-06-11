import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { CollectionAddForm } from 'sections/@dashboard/collection';
import { useGetOneCollectionById } from "services/collectionServices";
import BlankPage from '../BlankPage';

export default function CollectionEditForm() {
    const { themeStretch } = useSettingsContext();
    const { id } = useParams();

    const { data: collectionData, isLoading, isError } = useGetOneCollectionById(id);

    if (isLoading) return <LoadingScreen />;

    if (isError) return <BlankPage />;

    return (
        <>
            <Helmet>
                <title>Collection: Edit Collection</title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Create a Edit Collection"
                    links={[
                        {
                            name: 'Dashboard',
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: 'Collection',
                            href: PATH_DASHBOARD.collection.list,
                        },
                        { name: collectionData?.name },
                    ]}
                />
                <CollectionAddForm isEdit collectionData={collectionData} />
            </Container>
        </>
    );
}
