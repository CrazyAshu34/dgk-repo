import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { PATH_DASHBOARD } from 'routes/paths';
import ColorFamiliesAddForm from 'sections/@dashboard/colorfamilies/ColorFamiliesAddForm';

export default function DiscountCreatePage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title>Dashboard: Color Family</title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="New Color Family"
                    links={[
                        {
                            name: 'Dashboard',
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: 'Color Family',
                            href: PATH_DASHBOARD.colorfamilies.list,
                        },
                        { name: 'New Color Family' },
                    ]}
                />
                <ColorFamiliesAddForm />

            </Container>
        </>
    );
}
