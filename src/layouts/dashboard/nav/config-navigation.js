// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: icon('ic_blog'),
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
  supercategory: icon('ic_super_category'),
};

const navConfig = [
  {
    subheader: 'DASHBOARD',
    items: [
      // Dashboard
      { title: 'Dashboard', path: PATH_DASHBOARD.root, icon: ICONS.dashboard },
    ],
  },

  {
    subheader: 'ECOM MANAGEMENT',
    items: [
      // Staff Management
      { title: 'Staff Management', path: PATH_DASHBOARD.staff.list, icon: ICONS.user },
      // Customer
      { title: 'Customer', path: PATH_DASHBOARD.customer.list, icon: ICONS.menuItem },
      // Dealer Management
      { title: 'Dealer Management', path: PATH_DASHBOARD.dealer.list, icon: ICONS.user },
      // order Management
      { title: 'order Management', path: PATH_DASHBOARD.order.list, icon: ICONS.cart },
      { title: 'Product Management', path: PATH_DASHBOARD.product.list, icon: ICONS.cart },
    ],
  },

  {
    subheader: 'ENQUIRY MANAGEMENT',
    items: [
      // Contact Enquries
      { title: 'Contact Enquries', path: PATH_DASHBOARD.contact.list, icon: ICONS.chat },
    ],
  },

  {
    subheader: 'CONFIGS',
    items: [
      // Testimonials
      { title: 'Testimonials', path: PATH_DASHBOARD.testimonials.list, icon: ICONS.dashboard },
      // Blog
      { title: 'Blog', path: PATH_DASHBOARD.blog.list, icon: ICONS.blog },
      // Banner Management
      { title: 'Banner Management', path: PATH_DASHBOARD.banner.list, icon: ICONS.kanban },
    ],
  },

  {
    subheader: 'POSTS',
    items: [
      // Category
      { title: 'Category', path: PATH_DASHBOARD.category.list, icon: ICONS.category },
      // Sub Category
      { title: 'Sub Category', path: PATH_DASHBOARD.subcategory.list, icon: ICONS.subcategory },
      // Super Sub Category
      {
        title: 'Super Sub Category',
        path: PATH_DASHBOARD.supersubcategory.list,
        icon: ICONS.supercategory,
      },

      // Brand Management
      {
        title: 'Brand Management',
        path: PATH_DASHBOARD.brand.list,
        icon: ICONS.blog,
      },
      // Designation
      { title: 'Designation', path: PATH_DASHBOARD.designation.list, icon: ICONS.user },
      // Discount
      { title: 'Discount', path: PATH_DASHBOARD.discount.list, icon: ICONS.ecommerce },

      // General Config
      {
        title: 'General Config',
        path: PATH_DASHBOARD.generalconfig.edit,
        icon: ICONS.menuItem,
      },
      // SUPER ADMIN CONFIRM
      {
        title: 'Super Admin Config',
        path: PATH_DASHBOARD.superadminconfig.edit,
        icon: ICONS.menuItem,
      },
      // offer
      { title: 'Offer', path: PATH_DASHBOARD.offer.list, icon: ICONS.ecommerce },
    ],
  },
];

export default navConfig;
