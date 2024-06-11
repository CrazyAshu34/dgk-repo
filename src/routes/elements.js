import { lazy, Suspense } from 'react';
// components
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) =>
(
  <Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </Suspense>
);

// ----------------------------------------------------------------------






// AUTH
export const LoginPage = Loadable(lazy(() => import('../pages/auth/LoginPage')));
export const RegisterPage = Loadable(lazy(() => import('../pages/auth/RegisterPage')));
export const VerifyCodePage = Loadable(lazy(() => import('../pages/auth/VerifyCodePage')));
export const NewPasswordPage = Loadable(lazy(() => import('../pages/auth/NewPasswordPage')));
export const ResetPasswordPage = Loadable(lazy(() => import('../pages/auth/ResetPasswordPage')));
export const FormAlien = Loadable(lazy(() => import('../pages/auth/FormAlien')));
export const Mytable = Loadable(lazy(() => import('../pages/auth/Mytable')));
// ashu path







// DASHBOARD: GENERAL
export const GeneralAppPage = Loadable(
  lazy(() => import('../pages/dashboard/general/GeneralAppPage'))
);

// DASHBOARD: BANNER
export const BannerListPage = Loadable(
  lazy(() => import('../pages/dashboard/banner/BannerListPage'))
);
export const BannerCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/banner/BannerCreatePage'))
);
export const BannerEditForm = Loadable(
  lazy(() => import('../pages/dashboard/banner/BannerEditForm'))
);

// DASHBOARD: BLOG
export const BlogListPage = Loadable(lazy(() => import('../pages/dashboard/blog/BlogListPage')));
export const BlogCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/blog/BlogCreatePage'))
);
export const BlogEditForm = Loadable(lazy(() => import('../pages/dashboard/blog/BlogEditForm')));
export const BlogDetailsPage = Loadable(
  lazy(() => import('../pages/dashboard/blog/BlogDetailsPage'))
);

// DASHBOARD: PROJECT
export const ProjectListPage = Loadable(
  lazy(() => import('../pages/dashboard/projectmanagement/ProjectListPage'))
);
export const ProjectCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/projectmanagement/ProjectCreatePage'))
);
export const ProjectEditForm = Loadable(
  lazy(() => import('../pages/dashboard/projectmanagement/ProjectEditForm'))
);
export const ProjectDetailsPage = Loadable(
  lazy(() => import('../pages/dashboard/projectmanagement/ProjectDetailsPage'))
);

//  DASHBOARD: BRAND
export const BrandListPage = Loadable(lazy(() => import('../pages/dashboard/brand/BrandListPage')));
export const BrandCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/brand/BrandCreatePage'))
);
export const BrandEditForm = Loadable(lazy(() => import('../pages/dashboard/brand/BrandEditForm')));

// DASHBOARD: CATEGORY
export const CategoryListPage = Loadable(
  lazy(() => import('../pages/dashboard/category/CategoryListPage'))
);
export const CategoryCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/category/CategoryCreatePage'))
);
export const CategoryEditForm = Loadable(
  lazy(() => import('../pages/dashboard/category/CategoryEditForm'))
);


// DASHBOARD: COLLECTION
export const CollectionListPage = Loadable(
  lazy(() => import('../pages/dashboard/collection/CollectionListPage'))
);
export const CollectionCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/collection/CollectionCreatePage'))
);
export const CollectionEditForm = Loadable(
  lazy(() => import('../pages/dashboard/collection/CollectionEditForm'))
);


// DASHBOARD: SERVICE CATEGORY
export const ServiceCategoryListPage = Loadable(
  lazy(() => import('../pages/dashboard/servicecategory/ServiceCategoryListPage'))
);
export const ServiceCategoryCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/servicecategory/ServiceCategoryCreatePage'))
);
export const ServiceCategoryEditForm = Loadable(
  lazy(() => import('../pages/dashboard/servicecategory/ServiceCategoryEditForm'))
);




// DASHBOARD: SUB-CATEGORY
export const SubCategoryListPage = Loadable(
  lazy(() => import('../pages/dashboard/sub-category/SubCategoryListPage'))
);
export const SubCategoryCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/sub-category/SubCategoryCreatePage'))
);
export const SubCategoryEditForm = Loadable(
  lazy(() => import('../pages/dashboard/sub-category/SubCategoryEditForm'))
);


// DASHBOARD: SUB-CATEGORY
export const DynamicMenuListPage = Loadable(
  lazy(() => import('../pages/dashboard/dynamicmenu/DynamicMenuListPage'))
);
export const DynamicMenuCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/dynamicmenu/DynamicMenuCreatePage'))
);
export const DynamicMenuEditForm = Loadable(
  lazy(() => import('../pages/dashboard/dynamicmenu/DynamicMenuEditForm'))
);

// DASHBOARD: SUPER-SUB-CATEGORY
export const SuperSubCategoryListPage = Loadable(
  lazy(() => import('../pages/dashboard/sup-sub-category/SuperSubCategoryListPage'))
);
export const SuperSubCategoryCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/sup-sub-category/SuperSubCategoryCreatePage'))
);
export const SuperSubCategoryEditForm = Loadable(
  lazy(() => import('../pages/dashboard/sup-sub-category/SuperSubCategoryEditForm'))
);

// DASHBOARD: CONTACT-ENQUIRY
export const ContactListPage = Loadable(
  lazy(() => import('../pages/dashboard/contact/ContactListPage'))
);

// DASHBOARD: PRODUCT REVIEW
export const ProductReviewListPage = Loadable(
  lazy(() => import('../pages/dashboard/review/ProductReviewListPage'))
);

// DASHBOARD: PRODUCT-ENQUIRY
export const ProductEnquiryListPage = Loadable(
  lazy(() => import('../pages/dashboard/enquiry/ProductEnquiryListPage'))
);

// DASHBOARD: STAFF
export const StaffListPage = Loadable(lazy(() => import('../pages/dashboard/staff/StaffListPage')));
export const StaffCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/staff/StaffCreatePage'))
);
export const StaffChangePassword = Loadable(
  lazy(() => import('../pages/dashboard/staff/StaffChangePassword'))
);
export const StaffEditForm = Loadable(lazy(() => import('../pages/dashboard/staff/StaffEditForm')));
export const StaffDetailsPage = Loadable(
  lazy(() => import('../pages/dashboard/staff/StaffDetailsPage'))
);

// DASHBOARD: amc
export const AmcListPage = Loadable(lazy(() => import('../pages/dashboard/amc/AmcListPage')));
export const AmcCreatePage = Loadable(lazy(() => import('../pages/dashboard/amc/AmcCreatePage')));
export const AmcViewForm = Loadable(lazy(() => import('../pages/dashboard/amc/AmcViewForm')));
export const AmcEditForm = Loadable(lazy(() => import('../pages/dashboard/amc/AmcEditForm')));


// DASHBOARD: Service Management ServiceListPage
export const ServiceListPage = Loadable(
  lazy(() => import('../pages/dashboard/service/ServiceListPage'))
);
export const ServiceCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/service/ServiceCreatePage'))
);

export const ServiceEditForm = Loadable(
  lazy(() => import('../pages/dashboard/service/ServiceEditForm'))
);

// export const ServiceEditForm = Loadable(
//   lazy(() => import('../pages/dashboard/service/ServiceEditForm'))
// );
// export const ServiceDetailsPage = Loadable(
//   lazy(() => import('../pages/dashboard/service/ServiceDetailsPage'))
// );

// DASHBOARD: CUSTOMER
export const CustomerListPage = Loadable(
  lazy(() => import('../pages/dashboard/customer/CustomerListPage'))
);
export const CustomerEditForm = Loadable(
  lazy(() => import('../pages/dashboard/customer/CustomerEditForm'))
);
export const CustomerDetailsPage = Loadable(
  lazy(() => import('../pages/dashboard/customer/CustomerDetailsPage'))
);
export const CustomerCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/customer/CustomerCreatePage'))
);
export const CustomerAddProductAmcForm = Loadable(
  lazy(() => import('../pages/dashboard/customer/CustomerAddProductAmcForm'))
);
// DASHBOARD: DEALER
export const DealerListPage = Loadable(
  lazy(() => import('../pages/dashboard/dealer/DealerListPage'))
);
export const DealerDetailsPage = Loadable(
  lazy(() => import('../pages/dashboard/dealer/DealerDetailsPage'))
);
export const DealerEditForm = Loadable(
  lazy(() => import('../pages/dashboard/dealer/DealerEditForm'))
);
export const DealerChangePassword = Loadable(
  lazy(() => import('../pages/dashboard/dealer/DealerChangePassword'))
);
export const DealerCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/dealer/DealerCreatePage'))
);

// DASHBOARD: CLIENT
export const ClientListPage = Loadable(
  lazy(() => import('../pages/dashboard/client/ClientListPage'))
);
export const ClientCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/client/ClientCreatePage'))
);
export const ClientEditForm = Loadable(
  lazy(() => import('../pages/dashboard/client/ClientEditForm'))
);

//  DASHBOARD: Designation
export const DesignationListPage = Loadable(
  lazy(() => import('../pages/dashboard/desgination/DesignationListPage'))
);
export const DesignationCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/desgination/DesignationCreatePage'))
);
export const DesignationEditForm = Loadable(
  lazy(() => import('../pages/dashboard/desgination/DesignationEditForm'))
);
//  DASHBOARD: Notification
export const NotificationListPage = Loadable(
  lazy(() => import('../pages/dashboard/notification/NotificationListPage'))
);
export const NotificationCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/notification/NotificationCreatePage'))
);
export const NotificationEditForm = Loadable(
  lazy(() => import('../pages/dashboard/notification/NotificationEditForm'))
);

//  DASHBOARD: DISCOUNT
export const DiscountListPage = Loadable(
  lazy(() => import('../pages/dashboard/discount/DiscountListPage'))
);
export const DiscountCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/discount/DiscountCreatePage'))
);
export const DiscountEditForm = Loadable(
  lazy(() => import('../pages/dashboard/discount/DiscountEditForm'))
);

//  DASHBOARD: GST
export const GstListPage = Loadable(
  lazy(() => import('../pages/dashboard/gst/GstListPage'))
);
export const GstCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/gst/GstCreatePage'))
);
export const GstEditForm = Loadable(
  lazy(() => import('../pages/dashboard/gst/GstEditForm'))
);

//  DASHBOARD: HSN
export const HsnListPage = Loadable(
  lazy(() => import('../pages/dashboard/hsn/HsnListPage'))
);
export const HsnCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/hsn/HsnCreatePage'))
);
export const HsnEditForm = Loadable(
  lazy(() => import('../pages/dashboard/hsn/HsnEditForm'))
);

//  DASHBOARD: OFFER
export const OfferListPage = Loadable(lazy(() => import('../pages/dashboard/offer/OfferListPage')));
export const OfferCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/offer/OfferCreatePage'))
);
export const OfferEditForm = Loadable(lazy(() => import('../pages/dashboard/offer/OfferEditForm')));

// DASHBOARD: TESTIMONIALS
export const TestimonialsListPage = Loadable(
  lazy(() => import('../pages/dashboard/testimonial/TestimonialsListPage'))
);
export const TestimonialsCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/testimonial/TestimonialsCreatePage'))
);
export const TestimonialsEditForm = Loadable(
  lazy(() => import('../pages/dashboard/testimonial/TestimonialsEditForm'))
);

// DASHBOARD: ORDER
export const OrderListPage = Loadable(lazy(() => import('../pages/dashboard/order/OrderListPage')));
export const OrderView = Loadable(lazy(() => import('../pages/dashboard/order/OrderView')));

// DASHBOARD: PRODUCT
export const ProductListPage = Loadable(
  lazy(() => import('../pages/dashboard/product/ProductListPage'))
);
export const ProductCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/product/ProductCreatePage'))
);

// DASHBOARD: USER
export const UserProfilePage = Loadable(
  lazy(() => import('../pages/dashboard/user/UserProfilePage'))
);
export const UserCardsPage = Loadable(lazy(() => import('../pages/dashboard/user/UserCardsPage')));
export const UserListPage = Loadable(lazy(() => import('../pages/dashboard/user/UserListPage')));
export const UserAccountPage = Loadable(
  lazy(() => import('../pages/dashboard/user/UserAccountPage'))
);
export const UserCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/user/UserCreatePage'))
);
export const UserEditPage = Loadable(lazy(() => import('../pages/dashboard/user/UserEditPage')));

// DASHBOARD: ADMIN-CONFIG
// ADMIN-CONFIG: GENERAL
export const GeneralConfigEditForm = Loadable(
  lazy(() => import('../pages/dashboard/admin-config/GeneralConfigEditForm'))
);
// ADMIN-CONFIG: SUPER-ADMIN
export const SuperAdminConfigEditForm = Loadable(
  lazy(() => import('../pages/dashboard/admin-config/SuperAdminConfigEditForm'))
);

// DASHBOARD: RECYCLEBIN
export const RecycleListPage = Loadable(
  lazy(() => import('../pages/dashboard/recyclebin/RecycleListPage'))
);
export const RecycleStaffListPage = Loadable(
  lazy(() => import('../pages/dashboard/recyclebin/RecycleStaffListPage'))
);
export const RecycleCustomerListPage = Loadable(
  lazy(() => import('../pages/dashboard/recyclebin/RecycleCustomerListPagen'))
);
export const RecycleProductListPage = Loadable(
  lazy(() => import('../pages/dashboard/recyclebin/RecycleProductListPage'))
);
export const RecycleCategoriesListPage = Loadable(
  lazy(() => import('../pages/dashboard/recyclebin/RecycleCategoriesListPage'))
);
// BLANK PAGE
export const BlankPage = Loadable(lazy(() => import('../pages/dashboard/BlankPage')));

// MAIN
export const HomePage = Loadable(lazy(() => import('../pages/HomePage')));



//  DASHBOARD: DISCOUNT
export const ColorfamiliesListPage = Loadable(
  lazy(() => import('../pages/dashboard/colorfamilies/ColorfamiliesListPage'))
);
export const ColorfamiliesCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/colorfamilies/ColorFamiliesCreatePage'))
);
export const ColorfamiliesEditForm = Loadable(
  lazy(() => import('../pages/dashboard/colorfamilies/ColorFamiliesEditForm'))
);