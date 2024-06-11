// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
  //ashu path
  register: path(ROOTS_AUTH, '/register'),
  table: path(ROOTS_AUTH, '/table'),
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,

  blank: path(ROOTS_DASHBOARD, '/blank'),
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
  },

  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    edit: (name) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
  },

  // DASHBOARD: Staff Management
  staff: {
    root: path(ROOTS_DASHBOARD, '/staff'),
    list: path(ROOTS_DASHBOARD, '/staff/list'),
    new: path(ROOTS_DASHBOARD, '/staff/new'),
    passwordchange: (id) => path(ROOTS_DASHBOARD, `/staff/passwordchange/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/staff/edit/${id}/`),
    view: (id) => path(ROOTS_DASHBOARD, `/staff/${id}`),
  },





  // DASHBOARD: Inquiry form made by me
  // staff: {
  //   root: path(ROOTS_DASHBOARD, '/FormAlien'),
  //   list: path(ROOTS_DASHBOARD, '/FormAlien/list'),
  //   new: path(ROOTS_DASHBOARD, '/FormAlien/new'),
  //   passwordchange: (id) => path(ROOTS_DASHBOARD, `/FormAlien/passwordchange/${id}`),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/FormAlien/edit/${id}/`),
  //   view: (id) => path(ROOTS_DASHBOARD, `/FormAlien/${id}`),
  // },








  // DASHBOARD: Service Management
  service: {
    root: path(ROOTS_DASHBOARD, '/service'),
    list: path(ROOTS_DASHBOARD, '/service/list'),
    new: path(ROOTS_DASHBOARD, '/service/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/service/edit/${id}/`),
    // view: (id) => path(ROOTS_DASHBOARD, `/service/${id}`),
  },
  // DASHBOARD: Customer
  customer: {
    root: path(ROOTS_DASHBOARD, '/customer'),
    list: path(ROOTS_DASHBOARD, '/customer/list'),
    new: path(ROOTS_DASHBOARD, '/customer/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/customer/edit/${id}/`),
    addproductamc: (id) => path(ROOTS_DASHBOARD, `/customer/addproductamc/${id}/`),
    view: (id) => path(ROOTS_DASHBOARD, `/customer/${id}`),
  },
  // DASHBOARD: Amc Management
  amc: {
    root: path(ROOTS_DASHBOARD, '/amc'),
    list: path(ROOTS_DASHBOARD, '/amc/list'),
    new: path(ROOTS_DASHBOARD, '/amc/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/amc/view/${id}/`),
    edit: (id) => path(ROOTS_DASHBOARD, `/amc/edit/${id}/`),
  },
  // DASHBOARD: Dealer Management
  dealer: {
    root: path(ROOTS_DASHBOARD, '/dealer'),
    list: path(ROOTS_DASHBOARD, '/dealer/list'),
    new: path(ROOTS_DASHBOARD, '/dealer/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/dealer/${id}`),
    passwordchange: (id) => path(ROOTS_DASHBOARD, `/dealer/passwordchange/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/dealer/edit/${id}/`),
  },

  // DASHBOARD: client
  client: {
    root: path(ROOTS_DASHBOARD, '/client'),
    list: path(ROOTS_DASHBOARD, '/client/list'),
    new: path(ROOTS_DASHBOARD, '/client/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/client/edit/${id}/`),
  },

  // DASHBOARD: Testimonials
  testimonials: {
    root: path(ROOTS_DASHBOARD, '/testimonials'),
    list: path(ROOTS_DASHBOARD, '/testimonials/list'),
    new: path(ROOTS_DASHBOARD, '/testimonials/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/testimonials/edit/${id}/`),
  },

  // DASHBOARD: Contact Enquries
  contact: {
    root: path(ROOTS_DASHBOARD, '/contact'),
    list: path(ROOTS_DASHBOARD, '/contact/list'),
  },

  // DASHBOARD: Product Enquries
  productenquries: {
    root: path(ROOTS_DASHBOARD, '/productenquries'),
    list: path(ROOTS_DASHBOARD, '/productenquries/list'),
  },

  // DASHBOARD: Product Enquries
  productreview: {
    root: path(ROOTS_DASHBOARD, '/productreview'),
    list: path(ROOTS_DASHBOARD, '/productreview/list'),
  },

  // DASHBOARD: Blog Management
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    list: path(ROOTS_DASHBOARD, '/blog/list'),
    new: path(ROOTS_DASHBOARD, '/blog/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/blog/edit/${id}/`),
    view: (id) => path(ROOTS_DASHBOARD, `/blog/${id}`),
  },
  // DASHBOARD: Project Management
  project: {
    root: path(ROOTS_DASHBOARD, '/project'),
    list: path(ROOTS_DASHBOARD, '/project/list'),
    new: path(ROOTS_DASHBOARD, '/project/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/project/edit/${id}/`),
    view: (id) => path(ROOTS_DASHBOARD, `/project/${id}`),
  },
  // DASHBOARD: banner Management
  banner: {
    root: path(ROOTS_DASHBOARD, '/banner'),
    list: path(ROOTS_DASHBOARD, '/banner/list'),
    new: path(ROOTS_DASHBOARD, '/banner/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/banner/edit/${id}/`),
  },
  // Notification
  notification: {
    root: path(ROOTS_DASHBOARD, '/notification'),
    list: path(ROOTS_DASHBOARD, '/notification/list'),
    new: path(ROOTS_DASHBOARD, '/notification/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/notification/edit/${id}/`),
  },
  // DASHBOARD: Category
  category: {
    root: path(ROOTS_DASHBOARD, '/category'),
    list: path(ROOTS_DASHBOARD, '/category/list'),
    new: path(ROOTS_DASHBOARD, '/category/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/category/edit/${id}/`),
  },

  // DASHBOARD: Collection
  collection: {
    root: path(ROOTS_DASHBOARD, '/collection'),
    list: path(ROOTS_DASHBOARD, '/collection/list'),
    new: path(ROOTS_DASHBOARD, '/collection/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/collection/edit/${id}/`),
  },

  // DASHBOARD: Service Category
  servicecategory: {
    root: path(ROOTS_DASHBOARD, '/servicecategory'),
    list: path(ROOTS_DASHBOARD, '/servicecategory/list'),
    new: path(ROOTS_DASHBOARD, '/servicecategory/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/servicecategory/edit/${id}/`),
  },

  // DASHBOARD: Sub Category
  subcategory: {
    root: path(ROOTS_DASHBOARD, '/subcategory'),
    list: path(ROOTS_DASHBOARD, '/subcategory/list'),
    new: path(ROOTS_DASHBOARD, '/subcategory/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/subcategory/edit/${id}/`),
  },

  // DASHBOARD: Dynamic menu
  dynamicmenu: {
    root: path(ROOTS_DASHBOARD, '/dynamicmenu'),
    list: path(ROOTS_DASHBOARD, '/dynamicmenu/list'),
    new: path(ROOTS_DASHBOARD, '/dynamicmenu/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/dynamicmenu/edit/${id}/`),
  },

  // DASHBOARD: Super Sub Category
  supersubcategory: {
    root: path(ROOTS_DASHBOARD, '/supersubcategory'),
    list: path(ROOTS_DASHBOARD, '/supersubcategory/list'),
    new: path(ROOTS_DASHBOARD, '/supersubcategory/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/supersubcategory/edit/${id}/`),
  },

  //  DASHBOARD: Brand Management
  brand: {
    root: path(ROOTS_DASHBOARD, '/brand'),
    list: path(ROOTS_DASHBOARD, '/brand/list'),
    new: path(ROOTS_DASHBOARD, '/brand/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/brand/edit/${id}/`),
  },
  //  DASHBOARD: Designation
  designation: {
    root: path(ROOTS_DASHBOARD, '/designation'),
    list: path(ROOTS_DASHBOARD, '/designation/list'),
    new: path(ROOTS_DASHBOARD, '/designation/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/designation/edit/${id}/`),
  },

  //  DASHBOARD: Discount
  discount: {
    root: path(ROOTS_DASHBOARD, '/discount'),
    list: path(ROOTS_DASHBOARD, '/discount/list'),
    new: path(ROOTS_DASHBOARD, '/discount/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/discount/edit/${id}/`),
  },
  //  DASHBOARD: GST
  gst: {
    root: path(ROOTS_DASHBOARD, '/gst'),
    list: path(ROOTS_DASHBOARD, '/gst/list'),
    new: path(ROOTS_DASHBOARD, '/gst/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/gst/edit/${id}/`),
  },
  //  DASHBOARD: HSN
  hsn: {
    root: path(ROOTS_DASHBOARD, '/hsn'),
    list: path(ROOTS_DASHBOARD, '/hsn/list'),
    new: path(ROOTS_DASHBOARD, '/hsn/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/hsn/edit/${id}/`),
  },
  //  DASHBOARD: General Config
  generalconfig: {
    edit: path(ROOTS_DASHBOARD, '/generalconfig/edit'),
  },
  //  DASHBOARD: Color Families
  colorfamilies: {
    root: path(ROOTS_DASHBOARD, '/colorfamilies'),
    list: path(ROOTS_DASHBOARD, '/colorfamilies/list'),
    new: path(ROOTS_DASHBOARD, '/colorfamilies/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/colorfamilies/edit/${id}/`),
  },
  //  DASHBOARD: Super Admin Config
  superadminconfig: {
    edit: path(ROOTS_DASHBOARD, '/superadminconfig/edit'),
  },

  // order Management
  order: {
    root: path(ROOTS_DASHBOARD, `/order/list`),
    // list: path(ROOTS_DASHBOARD, '/order/list'),
    list: (type) => path(ROOTS_DASHBOARD, `/order/list/${type}/`),
    view: (id) => path(ROOTS_DASHBOARD, `/order/view/${id}/`),
    invoice: (id) => path(ROOTS_DASHBOARD, `/order/invoice/${id}/`),
    invoiceb2b: (id) => path(ROOTS_DASHBOARD, `/order/invoice/b2b/${id}/`),
  },

  // offer
  offer: {
    root: path(ROOTS_DASHBOARD, '/offer'),
    list: path(ROOTS_DASHBOARD, '/offer/list'),
    new: path(ROOTS_DASHBOARD, '/offer/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/offer/edit/${id}/`),
    // Product Management
  },

  product: {
    root: path(ROOTS_DASHBOARD, '/product'),
    list: path(ROOTS_DASHBOARD, '/product/list'),
    new: path(ROOTS_DASHBOARD, '/product/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/product/edit/${id}/`),
    view: (id) => path(ROOTS_DASHBOARD, `/product/${id}`),
  },
  // DASHBOARD: RECYCLEBIN
  recyclebin: {
    root: path(ROOTS_DASHBOARD, '/recyclebin'),
    list: path(ROOTS_DASHBOARD, '/recyclebin/list'),
    categorieslist: path(ROOTS_DASHBOARD, '/recyclebin/categorieslist'),
    stafflist: path(ROOTS_DASHBOARD, '/recyclebin/stafflist'),
    customerlist: path(ROOTS_DASHBOARD, '/recyclebin/customerlist'),
    productlist: path(ROOTS_DASHBOARD, '/recyclebin/productlist'),
  },
};


export const PATH_DOCS = {
  root: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
};

export const PATH_ZONE_ON_STORE = 'https://mui.com/store/items/zone-landing-page/';

export const PATH_MINIMAL_ON_STORE = 'https://mui.com/store/items/minimal-dashboard/';

export const PATH_FREE_VERSION = 'https://mui.com/store/items/minimal-dashboard-free/';

export const PATH_FIGMA_PREVIEW =
  'https://www.figma.com/file/rWMDOkMZYw2VpTdNuBBCvN/%5BPreview%5D-Minimal-Web.26.11.22?node-id=0%3A1&t=ya2mDFiuhTXXLLF1-1';
