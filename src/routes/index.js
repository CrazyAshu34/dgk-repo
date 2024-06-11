import OrderInvoiceDetails from 'pages/dashboard/order/invoice/OrderInvoiceDetails';
import ProductEditPage from 'pages/dashboard/product/ProductEditPage';
import { Navigate, useRoutes } from 'react-router-dom';
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
import { PATH_AFTER_LOGIN } from '../config-global';
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
import MainLayout from '../layouts/main';
import {
  AmcCreatePage,
  AmcEditForm,
  AmcListPage,
  AmcViewForm,
  BannerCreatePage,
  BannerEditForm,
  BannerListPage,
  BlankPage,
  BlogCreatePage,
  BlogDetailsPage,
  BlogEditForm,
  BlogListPage,
  BrandCreatePage,
  BrandEditForm,
  BrandListPage,
  CategoryCreatePage,
  CategoryEditForm,
  CategoryListPage,
  ClientCreatePage,
  ClientEditForm,
  ClientListPage,
  CollectionCreatePage,
  CollectionEditForm,
  CollectionListPage,
  ColorfamiliesCreatePage,
  ColorfamiliesEditForm,
  ColorfamiliesListPage,
  ContactListPage,
  CustomerAddProductAmcForm,
  CustomerCreatePage,
  CustomerDetailsPage,
  CustomerEditForm,
  CustomerListPage,
  DealerChangePassword,
  DealerCreatePage,
  DealerDetailsPage,
  DealerEditForm,
  DealerListPage,
  DesignationCreatePage,
  DesignationEditForm,
  DesignationListPage,
  DiscountCreatePage,
  DiscountEditForm,
  DiscountListPage,
  DynamicMenuCreatePage,
  DynamicMenuEditForm,
  DynamicMenuListPage,
  FormAlien,
  GeneralAppPage,
  GeneralConfigEditForm,
  GstCreatePage,
  GstEditForm,
  GstListPage,
  HsnCreatePage,
  HsnEditForm,
  HsnListPage,
  LoginPage,
  NewPasswordPage,
  NotificationCreatePage,
  NotificationEditForm,
  NotificationListPage,
  OfferCreatePage,
  OfferEditForm,
  OfferListPage,
  OrderListPage,
  OrderView,
  ProductCreatePage,
  ProductEnquiryListPage,
  ProductListPage,
  ProductReviewListPage,
  ProjectCreatePage,
  ProjectDetailsPage,
  ProjectEditForm,
  ProjectListPage,
  RecycleCategoriesListPage,
  RecycleCustomerListPage,
  RecycleListPage,
  RecycleProductListPage,
  RecycleStaffListPage,
  RegisterPage,
  ResetPasswordPage,
  ServiceCategoryCreatePage,
  ServiceCategoryEditForm,
  ServiceCategoryListPage,

  ServiceCreatePage,
  // ServiceDetailsPage,
  ServiceEditForm,
  ServiceListPage,
  StaffChangePassword,
  StaffCreatePage,
  StaffDetailsPage,
  StaffEditForm,
  StaffListPage,
  SubCategoryCreatePage,
  SubCategoryEditForm,
  SubCategoryListPage,
  SuperAdminConfigEditForm,
  SuperSubCategoryCreatePage,
  SuperSubCategoryEditForm,
  SuperSubCategoryListPage,
  TestimonialsCreatePage,
  TestimonialsEditForm,
  TestimonialsListPage,
  UserAccountPage,
  UserCardsPage,
  UserCreatePage,
  UserEditPage,
  UserListPage,
  UserProfilePage,
  VerifyCodePage,
  Mytable
} from './elements';

// ----------------------------------------------------------------------

export default function Router(props) {
  return useRoutes([
    // Main Page "/" Route
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [{ element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true }],
    },



    // ashu path
    // pages/auth/FormAlien
    {
      path: '/auth/register',
      element: (
        <FormAlien />
      ),
      children: [{ element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true }],
    },
    //ashu 2-----------------------------------------------
    {
      path: '/auth/table',
      element: (
        <Mytable />
      ),
      children: [{ element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true }],
    },
    //---------end---------





    // Auth
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <RegisterPage />
            </GuestGuard>
          ),
        },
        { path: 'login-unprotected', element: <LoginPage /> },
        { path: 'register-unprotected', element: <RegisterPage /> },
        {
          element: <CompactLayout />,
          children: [
            { path: 'reset-password', element: <ResetPasswordPage /> },
            { path: 'new-password', element: <NewPasswordPage /> },
            { path: 'verify', element: <VerifyCodePage /> },
          ],
        },
      ],
    },

    // Dashboard App
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <GeneralAppPage /> },

        // DASHBOARD: Staff Management
        {
          path: 'staff',
          children: [
            { element: <Navigate to="/dashboard/staff/list" replace />, index: true },
            { path: 'list', element: <StaffListPage /> },
            { path: 'new', element: <StaffCreatePage /> },
            { path: 'passwordchange/:id', element: <StaffChangePassword /> },
            { path: 'edit/:id', element: <StaffEditForm /> },
            { path: ':id', element: <StaffDetailsPage /> },
          ],
        },




        // DASHBOARD: Customer Management
        {
          path: 'customer',
          children: [
            { element: <Navigate to="/dashboard/customer/list" replace />, index: true },
            { path: 'list', element: <CustomerListPage /> },
            { path: 'new', element: <CustomerCreatePage /> },
            { path: ':id', element: <CustomerDetailsPage /> },
            { path: 'edit/:id', element: <CustomerEditForm /> },
            { path: 'addproductamc/:id', element: <CustomerAddProductAmcForm /> },
          ],
        },
        // DASHBOARD: Amc Management
        {
          path: 'amc',
          children: [
            { element: <Navigate to="/dashboard/amc/list" replace />, index: true },
            { path: 'list', element: <AmcListPage /> },
            { path: 'new', element: <AmcCreatePage /> },
            { path: 'view/:id', element: <AmcViewForm /> },

            { path: 'edit/:id', element: <AmcEditForm /> },
          ],
        },
        // DASHBOARD: Service Management
        {
          path: 'service',
          children: [
            { element: <Navigate to="/dashboard/service/list" replace />, index: true },
            { path: 'list', element: <ServiceListPage /> },
            { path: 'new', element: <ServiceCreatePage /> },
            { path: 'edit/:id', element: <ServiceEditForm /> },
            // { path: ':id', element: <ServiceDetailsPage /> },
          ],
        },
        // DASHBOARD: client
        {
          path: 'client',
          children: [
            { element: <Navigate to="/dashboard/client/list" replace />, index: true },
            { path: 'list', element: <ClientListPage /> },
            { path: 'new', element: <ClientCreatePage /> },
            { path: 'edit/:id', element: <ClientEditForm /> },
          ],
        },

        // DASHBOARD: Dealer Management
        {
          path: 'dealer',
          children: [
            { element: <Navigate to="/dashboard/dealer/list" replace />, index: true },
            { path: 'list', element: <DealerListPage /> },
            { path: 'new', element: <DealerCreatePage /> },
            { path: ':id', element: <DealerDetailsPage /> },
            { path: 'passwordchange/:id', element: <DealerChangePassword /> },
            { path: 'edit/:id', element: <DealerEditForm /> },
          ],
        },

        // DASHBOARD: Order Management
        {
          path: 'order',
          children: [
            { element: <Navigate to="/dashboard/order/list" replace />, index: true },
            { path: 'list/:type', element: <OrderListPage /> },
            { path: 'view/:id', element: <OrderView /> },
            { path: 'invoice/:id', element: <OrderInvoiceDetails /> },
            // { path: 'invoice/b2b/:id', element: <OrderInvoiceb2bDetails /> },
          ],
        },

        // DASHBOARD: Product Management
        {
          path: 'product',
          children: [
            { element: <Navigate to="/dashboard/product/list" replace />, index: true },
            { path: 'list', element: <ProductListPage /> },
            { path: 'new', element: <ProductCreatePage /> },
            { path: 'edit/:id', element: <ProductEditPage /> },
            // { path: ':id', element: <ProductDetailsPage /> },
          ],
        },

        // DASHBOARD: Testimonials
        {
          path: 'testimonials',
          children: [
            { element: <Navigate to="/dashboard/testimonials/list" replace />, index: true },
            { path: 'list', element: <TestimonialsListPage /> },
            { path: 'new', element: <TestimonialsCreatePage /> },
            { path: 'edit/:id', element: <TestimonialsEditForm /> },
          ],
        },

        // DASHBOARD: Blog Management
        {
          path: 'blog',
          children: [
            { element: <Navigate to="/dashboard/blog/list" replace />, index: true },
            { path: 'list', element: <BlogListPage /> },
            { path: 'new', element: <BlogCreatePage /> },
            { path: 'edit/:id', element: <BlogEditForm /> },
            { path: ':id', element: <BlogDetailsPage /> },
          ],
        },
        // DASHBOARD: Project Management
        {
          path: 'project',
          children: [
            { element: <Navigate to="/dashboard/project/list" replace />, index: true },
            { path: 'list', element: <ProjectListPage /> },
            { path: 'new', element: <ProjectCreatePage /> },
            { path: 'edit/:id', element: <ProjectEditForm /> },
            { path: ':id', element: <ProjectDetailsPage /> },
          ],
        },
        // DASHBOARD: banner Management
        {
          path: 'banner',
          children: [
            { element: <Navigate to="/dashboard/banner/list" replace />, index: true },
            { path: 'list', element: <BannerListPage /> },
            { path: 'new', element: <BannerCreatePage /> },
            { path: 'edit/:id', element: <BannerEditForm /> },
          ],
        },
        // DASHBOARD: Category
        {
          path: 'category',
          children: [
            { element: <Navigate to="/dashboard/category/list" replace />, index: true },
            { path: 'list', element: <CategoryListPage /> },
            { path: 'new', element: <CategoryCreatePage /> },
            { path: 'edit/:id', element: <CategoryEditForm /> },
          ],
        },

        // DASHBOARD: Collection
        {
          path: 'collection',
          children: [
            { element: <Navigate to="/dashboard/collection/list" replace />, index: true },
            { path: 'list', element: <CollectionListPage /> },
            { path: 'new', element: <CollectionCreatePage /> },
            { path: 'edit/:id', element: <CollectionEditForm /> },
          ],
        },

        // DASHBOARD: Service Category
        {
          path: 'servicecategory',
          children: [
            { element: <Navigate to="/dashboard/servicecategory/list" replace />, index: true },
            { path: 'list', element: <ServiceCategoryListPage /> },
            { path: 'new', element: <ServiceCategoryCreatePage /> },
            { path: 'edit/:id', element: <ServiceCategoryEditForm /> },
          ],
        },

        // DASHBOARD: Sub Category
        {
          path: 'subcategory',
          children: [
            { element: <Navigate to="/dashboard/subcategory/list" replace />, index: true },
            { path: 'list', element: <SubCategoryListPage /> },
            { path: 'new', element: <SubCategoryCreatePage /> },
            { path: 'edit/:id', element: <SubCategoryEditForm /> },
          ],
        },

        // DASHBOARD: Sub Category
        {
          path: 'dynamicmenu',
          children: [
            { element: <Navigate to="/dashboard/dynamicmenu/list" replace />, index: true },
            { path: 'list', element: <DynamicMenuListPage /> },
            { path: 'new', element: <DynamicMenuCreatePage /> },
            { path: 'edit/:id', element: <DynamicMenuEditForm /> },
          ],
        },

        // DASHBOARD: Super Sub Category
        {
          path: 'supersubcategory',
          children: [
            { element: <Navigate to="/dashboard/supersubcategory/list" replace />, index: true },
            { path: 'list', element: <SuperSubCategoryListPage /> },
            { path: 'new', element: <SuperSubCategoryCreatePage /> },
            { path: 'edit/:id', element: <SuperSubCategoryEditForm /> },
          ],
        },

        //  DASHBOARD: Brand Management
        {
          path: 'brand',
          children: [
            { element: <Navigate to="/dashboard/brand/list" replace />, index: true },
            { path: 'list', element: <BrandListPage /> },
            { path: 'new', element: <BrandCreatePage /> },
            { path: 'edit/:id', element: <BrandEditForm /> },
          ],
        },

        //  DASHBOARD: Designation Management
        {
          path: 'designation',
          children: [
            { element: <Navigate to="/dashboard/designation/list" replace />, index: true },
            { path: 'list', element: <DesignationListPage /> },
            { path: 'new', element: <DesignationCreatePage /> },
            { path: 'edit/:id', element: <DesignationEditForm /> },
          ],
        },

        // DASHBOARD: Contact Enquries
        {
          path: 'contact',
          children: [
            { element: <Navigate to="/dashboard/contact/list" replace />, index: true },
            { path: 'list', element: <ContactListPage /> },
          ],
        },
        // DASHBOARD: Product Enquries
        {
          path: 'productreview',
          children: [
            { element: <Navigate to="/dashboard/productreview/list" replace />, index: true },
            { path: 'list', element: <ProductReviewListPage /> },
          ],
        },

        // DASHBOARD: Product Enquries
        {
          path: 'productenquries',
          children: [
            { element: <Navigate to="/dashboard/productenquries/list" replace />, index: true },
            { path: 'list', element: <ProductEnquiryListPage /> },
          ],
        },

        //  DASHBOARD: Discount Management
        {
          path: 'discount',
          children: [
            { element: <Navigate to="/dashboard/discount/list" replace />, index: true },
            { path: 'list', element: <DiscountListPage /> },
            { path: 'new', element: <DiscountCreatePage /> },
            { path: 'edit/:id', element: <DiscountEditForm /> },
          ],
        },

        //  DASHBOARD: GST
        {
          path: 'gst',
          children: [
            { element: <Navigate to="/dashboard/gst/list" replace />, index: true },
            { path: 'list', element: <GstListPage /> },
            { path: 'new', element: <GstCreatePage /> },
            { path: 'edit/:id', element: <GstEditForm /> },
          ],
        },
        //  DASHBOARD: HSN
        {
          path: 'hsn',
          children: [
            { element: <Navigate to="/dashboard/hsn/list" replace />, index: true },
            { path: 'list', element: <HsnListPage /> },
            { path: 'new', element: <HsnCreatePage /> },
            { path: 'edit/:id', element: <HsnEditForm /> },
          ],
        },

        //  DASHBOARD: General Config
        {
          path: 'generalconfig',
          children: [
            { element: <Navigate to="/dashboard/generalconfig" replace />, index: true },
            { path: 'edit', element: <GeneralConfigEditForm /> },
          ],
        },
        //  DASHBOARD: Discount Management
        {
          path: 'colorfamilies',
          children: [
            { element: <Navigate to="/dashboard/colorfamilies/list" replace />, index: true },
            { path: 'list', element: <ColorfamiliesListPage /> },
            { path: 'new', element: <ColorfamiliesCreatePage /> },
            { path: 'edit/:id', element: <ColorfamiliesEditForm /> },
          ],
        },

        //  DASHBOARD: Super Admin Config
        {
          path: 'superadminconfig',
          children: [
            { element: <Navigate to="/dashboard/superadminconfig" replace />, index: true },
            { path: 'edit', element: <SuperAdminConfigEditForm /> },
          ],
        },

        // offer
        {
          path: 'offer',
          children: [
            { element: <Navigate to="/dashboard/offer/list" replace />, index: true },
            { path: 'list', element: <OfferListPage /> },
            { path: 'new', element: <OfferCreatePage /> },
            { path: 'edit/:id', element: <OfferEditForm /> },
          ],
        },

        //  DASHBOARD: User Management
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/profile" replace />, index: true },
            { path: 'profile', element: <UserProfilePage /> },
            { path: 'cards', element: <UserCardsPage /> },
            { path: 'list', element: <UserListPage /> },
            { path: 'new', element: <UserCreatePage /> },
            { path: ':name/edit', element: <UserEditPage /> },
            { path: 'account', element: <UserAccountPage /> },
          ],
        },
        //  DASHBOARD: Notification
        {
          path: 'notification',
          children: [
            { element: <Navigate to="/dashboard/notification/list" replace />, index: true },
            { path: 'list', element: <NotificationListPage /> },
            { path: 'new', element: <NotificationCreatePage /> },
            { path: 'edit/:id', element: <NotificationEditForm /> },
          ],
        },
        // DASHBOARD: RECYCLEBIN
        {
          path: 'recyclebin',
          children: [
            { element: <Navigate to="/dashboard/recyclebin/list" replace />, index: true },
            { path: 'list', element: <RecycleListPage /> },
            { path: 'categorieslist', element: <RecycleCategoriesListPage /> },
            { path: 'stafflist', element: <RecycleStaffListPage /> },
            { path: 'customerlist', element: <RecycleCustomerListPage /> },
            { path: 'productlist', element: <RecycleProductListPage /> },
          ],
        },

        { path: 'blank', element: <BlankPage /> },
      ],
    },

    // 404 PAGE NOT FOUND
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
