import { Box, List } from '@mui/material';
import LoadingScreen from 'components/loading-screen';
import BlankPage from 'pages/dashboard/BlankPage';
import PropTypes from 'prop-types';
import { useGetOneUserById } from 'services/userServices';
import { useAuthContext } from '../../../auth/useAuthContext';
import { PATH_DASHBOARD } from '../../../routes/paths';
import SvgColor from '../../svg-color';
import NavList from './NavList';
import { StyledSubheader } from './styles';

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: icon('ic_blog'),
  banner: icon('ic_banner'),
  cart: icon('ic_cart'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  category: icon('ic_category'),
  subcategory: icon('ic_sub_category'),
  project: icon('ic_project'),
  supercategory: icon('ic_super_category'),
  gst: icon('ic_gst'),
  notification: icon('ic_notification'),
  recycle: icon('ic_recycle_bin'),
  dynamicmenu: icon('ic_dynamicmenu'),
  colorIcon: icon('color-icon'),
  review: icon('ic_review'),
  hsn: icon('ic_category')
};

NavSectionVertical.propTypes = {
  isCollapse: PropTypes.bool,
  isNavMini: PropTypes.bool,
};

export default function NavSectionVertical({ isCollapse = false, isNavMini, ...other }) {
  const { userdata } = useAuthContext();

  const userId = localStorage.getItem('userId');
  // console.log('oneUserData', userId);

  const { data: user, isLoading, isError } = useGetOneUserById(userId);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  const styles = {
    padding: '16px 0px 16px 0px !important',
    fontSize: '9px !important',
  }
  console.log('oneUserData', user);

  return (
    <Box {...other}>
      <List disablePadding sx={{ px: 2 }}>
        <StyledSubheader sx={isNavMini ? styles : null} >DASHBOARD</StyledSubheader>
        <NavList
          data={{ title: 'Dashboard', path: PATH_DASHBOARD.root, icon: ICONS.dashboard }}
          depth={1}
        />
      </List>
      {user?.designations?.addstaff === true ||
        user?.designations?.order === true ||
        user?.designations?.customer === true ||
        user?.designations?.dealerManagement === true ||
        user?.designations?.productmanagement === true ? (
        <List disablePadding sx={{ px: 2 }}>
          <StyledSubheader sx={isNavMini ? styles : null} >ECOM MANAGEMENT</StyledSubheader>

          {user?.designations?.addstaff === true ? (
            <NavList
              data={{
                title: 'Staff Management',
                path: PATH_DASHBOARD.staff.list,
                icon: ICONS.user,
              }}
              depth={1}
            />
          ) : null}

          {/* my form */}
         
          {/* my form close*/}


          {user?.designations?.customer === true ? (
            <NavList
              data={{ title: 'Customer', path: PATH_DASHBOARD.customer.list, icon: ICONS.menuItem }}
              depth={1}
            />
          ) : null}
          {/* {user?.designations?.amcmanagement === true ? (
            <NavList
              data={{
                title: 'AMC Management',
                path: PATH_DASHBOARD.amc.list,
                icon: ICONS.user,
              }}
              depth={1}
            />
          ) : null}

          {user?.designations?.servicemanagement === true ? (
            <NavList
              data={{
                title: 'Service Management',
                path: PATH_DASHBOARD.service.list,
                icon: ICONS.user,
              }}
              depth={1}
            />
          ) : null} */}

          {/* {user?.designations?.dealerManagement === true ? (
            <NavList
              data={{
                title: 'Dealer Management',
                path: PATH_DASHBOARD.dealer.list,
                icon: ICONS.user,
              }}
              depth={1}
            />
          ) : null} */}

          {user?.designations?.productmanagement === true ? (
            <NavList
              data={{
                title: 'Product Management',
                path: PATH_DASHBOARD.product.list,
                icon: ICONS.cart,
              }}
              depth={1}
            />
          ) : null}

          {/* {user?.designations?.order === true ? (
            <NavList
              data={{
                title: 'Order Management',
                path: PATH_DASHBOARD.order.list,
                icon: ICONS.booking,
              }}
              depth={1}
            />
          ) : null} */}

          <NavList
            key="11"
            data={{
              title: 'Order Management', path: PATH_DASHBOARD.order.root, icon: ICONS.booking, children: [
                { title: 'New Order', path: PATH_DASHBOARD.order.list('PLACED') },
                { title: 'Exchange', path: PATH_DASHBOARD.order.list('EXCHANGE_INITIATED') },
                { title: 'Return', path: PATH_DASHBOARD.order.list('RETURN_INITIATED') },
                { title: 'Cancelled', path: PATH_DASHBOARD.order.list('CANCELLED') }
              ],
            }}
            depth={1}
            hasChild
          />


        </List>
      ) : null}

      {user?.designations?.productenquiry === true ||
        user?.designations?.contactenquiries === true ? (
        <List disablePadding sx={{ px: 2 }}>
          <StyledSubheader sx={isNavMini ? styles : null} >ENQUIRY MANAGEMENT</StyledSubheader>
          {user?.designations?.contactenquiries === true ? (
            <NavList
              data={{
                title: 'Contact Enquries',
                path: PATH_DASHBOARD.contact.list,
                icon: ICONS.chat,
              }}
              depth={1}
            />
          ) : null}
          {/* {user?.designations?.productenquiry === true ? (
            <NavList
              data={{
                title: 'Product Enquries',
                path: PATH_DASHBOARD.productenquries.list,
                icon: ICONS.chat,
              }}
              depth={1}
            />
          ) : null} */}
          {user?.designations?.productenquiry === true ? (
            <NavList
              data={{
                title: 'Product Reviews',
                path: PATH_DASHBOARD.productreview.list,
                icon: ICONS.review,
              }}
              depth={1}
            />
          ) : null}
        </List>
      ) : null}

      {user?.designations?.testimonials === true ||
        user?.designations?.blogmanagement === true ||
        user?.designations?.banner === true ||
        user?.designations?.client === true ? (
        <List disablePadding sx={{ px: 2 }}>
          <StyledSubheader sx={isNavMini ? styles : null} >CONFIGS</StyledSubheader>
          {/* {user?.designations?.projectmanagement === true ? (
            <NavList
              data={{
                title: 'Project Management',
                path: PATH_DASHBOARD.project.list,
                icon: ICONS.project,
              }}
              depth={1}
            />
          ) : null} */}
          {user?.designations?.testimonials === true ? (
            <NavList
              data={{
                title: 'Testimonials',
                path: PATH_DASHBOARD.testimonials.list,
                icon: ICONS.dashboard,
              }}
              depth={1}
            />
          ) : null}
          {user?.designations?.blogmanagement === true ? (
            <NavList
              data={{ title: 'Blog', path: PATH_DASHBOARD.blog.list, icon: ICONS.blog }}
              depth={1}
            />
          ) : null}
          {user?.designations?.banner === true ? (
            <NavList
              data={{
                title: 'Banner Management',
                path: PATH_DASHBOARD.banner.list,
                icon: ICONS.banner,
              }}
              depth={1}
            />
          ) : null}
          {user?.designations?.notification === true ? (
            <NavList
              data={{
                title: 'Notification',
                path: PATH_DASHBOARD.notification.list,
                icon: ICONS.notification,
              }}
              depth={1}
            />
          ) : null}
          {/* {user?.designations?.client === true ? (
            <NavList
              data={{
                title: 'Client',
                path: PATH_DASHBOARD.client.list,
                icon: ICONS.user,
              }}
              depth={1}
            />
          ) : null} */}
        </List>
      ) : null}

      {user?.designations?.category === true ||
        user?.designations?.subcategory === true ||
        user?.designations?.supersubcategory === true ||
        user?.designations?.brandmanagement === true ||
        user?.designations?.designation === true ||
        user?.designations?.discount === true ||
        user?.designations?.generalconfig === true ||
        user?.designations?.offer === true ? (
        <List disablePadding sx={{ px: 2 }}>
          <StyledSubheader sx={isNavMini ? styles : null} >POSTS</StyledSubheader>

          {user?.designations?.category === true ? (
            <NavList
              data={{
                title: 'Category',
                path: PATH_DASHBOARD.category.list,
                icon: ICONS.category,
              }}
              depth={1}
            />
          ) : null}

          {user?.designations?.subcategory === true ? (
            <NavList
              data={{
                title: 'Sub Category',
                path: PATH_DASHBOARD.subcategory.list,
                icon: ICONS.subcategory,
              }}
              depth={1}
            />
          ) : null}

          {user?.designations?.supersubcategory === true ? (
            <NavList
              data={{
                title: 'Super Sub Category',
                path: PATH_DASHBOARD.supersubcategory.list,
                icon: ICONS.supercategory,
              }}
              depth={1}
            />
          ) : null}
          {/* {user?.designations?.servicecatemanagement === true ? (
            <NavList
              data={{
                title: 'Service Category',
                path: PATH_DASHBOARD.servicecategory.list,
                icon: ICONS.category,
              }}
              depth={1}
            />
          ) : null} */}

          {/* {user?.designations?.servicecatemanagement === true ? (
            <NavList
              data={{
                title: 'Dynamic Menu',
                path: PATH_DASHBOARD.dynamicmenu.list,
                icon: ICONS.dynamicmenu,
              }}
              depth={1}
            />
          ) : null} */}


          {user?.designations?.brandmanagement === true ? (
            <NavList
              data={{
                title: 'Brand Management',
                path: PATH_DASHBOARD.brand.list,
                icon: ICONS.blog,
              }}
              depth={1}
            />
          ) : null}

          {user?.designations?.brandmanagement === true ? (
            <NavList
              data={{
                title: 'Collection',
                path: PATH_DASHBOARD.collection.list,
                icon: ICONS.category,
              }}
              depth={1}
            />
          ) : null}

          {user?.designations?.designation === true ? (
            <NavList
              data={{
                title: 'Designation',
                path: PATH_DASHBOARD.designation.list,
                icon: ICONS.user,
              }}
              depth={1}
            />
          ) : null}

          {user?.designations?.discount === true ? (
            <NavList
              data={{
                title: 'Coupon',
                path: PATH_DASHBOARD.discount.list,
                icon: ICONS.ecommerce,
              }}
              depth={1}
            />
          ) : null}
          {user?.designations?.gst === true ? (
            <NavList
              data={{
                title: 'GST',
                path: PATH_DASHBOARD.gst.list,
                icon: ICONS.gst,
              }}
              depth={1}
            />
          ) : null}
          {user?.designations?.gst === true ? (
            <NavList
              data={{
                title: 'HSN',
                path: PATH_DASHBOARD.hsn.list,
                icon: ICONS.hsn,
              }}
              depth={1}
            />
          ) : null}
          {/* {user?.designations?.generalconfig === true ? (
            <NavList
              data={{
                title: 'General Config',
                path: PATH_DASHBOARD.generalconfig.edit,
                icon: ICONS.menuItem,
              }}
              depth={1}
            />
          ) : null} */}
          {user?.designations?.generalconfig === true ? (
            <NavList
              data={{
                title: 'Color Families',
                path: PATH_DASHBOARD.colorfamilies.list,
                icon: ICONS.colorIcon,
              }}
              depth={1}
            />
          ) : null}

          {/* {user?.designations?.offer === true ? (
            <NavList
              data={{
                title: 'Offer',
                path: PATH_DASHBOARD.offer.list,
                icon: ICONS.ecommerce,
              }}
              depth={1}
            />
          ) : null} */}
          {/* {user?.designations?.recyclebin === true ? (
            <NavList
              data={{
                title: 'Recycle Bin',
                path: PATH_DASHBOARD.recyclebin.list,
                icon: ICONS.recycle,
              }}
              depth={1}
            />
          ) : null} */}
        </List>
      ) : null}
    </Box>
  );
}
