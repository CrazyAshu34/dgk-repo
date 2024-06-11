import { Container } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import LoadingScreen from 'components/loading-screen';
import { useSettingsContext } from 'components/settings';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import NotificationAddForm from 'sections/@dashboard/notification/NotificationAddForm';
import { useGetNotificationById } from 'services/notificationServices';
import BlankPage from '../BlankPage';

export default function NotificationEditForm() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const { data: notificationData, isLoading, isError } = useGetNotificationById(id);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  return (
    <>
      <Helmet>
        <title>Notification : Edit Notification</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Notification"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Notification',
              href: PATH_DASHBOARD.notification.list,
            },
            { name: notificationData?.noti_title },
          ]}
        />
        <NotificationAddForm isEdit notificationData={notificationData} />
      </Container>
    </>
  );
}
