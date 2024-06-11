import { Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import { useSettingsContext } from 'components/settings';
import { PATH_DASHBOARD } from 'routes/paths';
import { CollectionAddForm } from 'sections/@dashboard/collection';

export default function CollectionCreatePage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title>Collection: New Collection</title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="New Collection"
                    links={[
                        {
                            name: 'Dashboard',
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: 'Collection',
                            href: PATH_DASHBOARD.collection.list,
                        },
                        { name: 'New Collection' },
                    ]}
                />
                <CollectionAddForm />
            </Container>
        </>
    );
}
