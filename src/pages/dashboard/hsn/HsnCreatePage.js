import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { PATH_DASHBOARD } from 'routes/paths';
import { HsnAddForm } from 'sections/@dashboard/hsn';

export default function HsnCreatePage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title>Dashboard: New Dashboard</title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="New HSN"
                    links={[
                        {
                            name: 'Dashboard',
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: 'HSN',
                            href: PATH_DASHBOARD.hsn.list,
                        },
                        { name: 'New HSN' },
                    ]}
                />
                <HsnAddForm />
            </Container>
        </>
    );
}
