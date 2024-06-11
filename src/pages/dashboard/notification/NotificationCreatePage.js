import { Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import  NotificationAddForm  from 'sections/@dashboard/notification/NotificationAddForm';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import { PATH_DASHBOARD } from '../../../routes/paths';

export default function AddPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Notification: New Notification</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="New Notification"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Notification',
              href: PATH_DASHBOARD.notification.list,
            },
            { name: 'New Notification' },
          ]}
        />
        <NotificationAddForm />
      </Container>
    </>
  );
}
