import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoaderPage from "./Components/LoaderPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import RedirectIfLoggedIn from "./Components/RedirectIfLoggedIn";

const LayoutPage = lazy(() => import("./Pages/LayoutPage"));
const DashboardPage = lazy(() => import("./Pages/DashboradPage"));
const DestinationPage = lazy(() => import("./Pages/DestinationPage"));
const AddDestinationForm = lazy(() =>
  import("./Components/AddDestinationForm")
);
const PackageCategory = lazy(() => import("./Pages/PackageCategory"));
const PackagePage = lazy(() => import("./Pages/PackagePage"));
const AddPackageCategoryForm = lazy(() =>
  import("./Components/AddPackageCategoryForm")
);
const AddPackageForm = lazy(() => import("./Components/AddPackageForm"));
const AllTourPage = lazy(() => import("./Pages/AllTourPage"));
const UpcomingTour = lazy(() => import("./Pages/UpcomingTour"));
const CanceledTour = lazy(() => import("./Pages/CanceledTour"));
const CompletedTour = lazy(() => import("./Pages/CompletedTour"));
const BookingDetailsPage = lazy(() =>
  import("./Components/BookingDetailsPage")
);
const CouponPage = lazy(() => import("./Pages/CouponPage"));
const AddViewCoupon = lazy(() => import("./Components/AddViewCoupon"));
const ReviewPage = lazy(() => import("./Pages/ReviewPage"));
const AllTransactionPage = lazy(() => import("./Pages/AllTransactionPage"));
const SuccessfulTransactions = lazy(() =>
  import("./Pages/SuccessfulTransactions")
);
const AllTicketPage = lazy(() => import("./Pages/AllTicketsPage"));
const AnsweredTicketPage = lazy(() => import("./Pages/AsnweredTicketPage"));
const OpenTicketPage = lazy(() => import("./Pages/OpenTicketPage"));
const CloseTicketPage = lazy(() => import("./Pages/CloseTicketPage"));
const AllUserPage = lazy(() => import("./Pages/AllUserPage"));
const UserProfilePage = lazy(() => import("./Pages/UserProfilePage"));
const SettingsPage = lazy(() => import("./Pages/SettingsPage"));
const AdminProfile = lazy(() => import("./Components/AdminProfile"));
const SignInPage = lazy(() => import("./Pages/SigninPage"));
const EditPackageCategoryForm = lazy(() =>
  import("./Pages/EditPackageCategoryForm")
);
const AddTourMapForm = lazy(() => import("./Components/AddTourMapForm"));
const EditPackageForm = lazy(() => import("./Components/EditPackageForm"));
const SupportTicketChat = lazy(() => import("./Components/SupportTicketChat"));

const App = () => {
  return (
    <Suspense fallback={<LoaderPage />}>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="/admin"
          element={
           
              <LayoutPage />
            
          }
        >
          <Route index path="dashboard" element={<DashboardPage />} />
          <Route path="destinations" element={<DestinationPage />} />
          <Route path="add-destination" element={<AddDestinationForm />} />
          <Route path="package-category" element={<PackageCategory />} />
          <Route
            path="add-package-category"
            element={<AddPackageCategoryForm />}
          />
          <Route path="packages" element={<PackagePage />} />
          <Route path="add-package-form" element={<AddPackageForm />} />
          <Route path="all-tours" element={<AllTourPage />} />
          <Route path="upcoming-tours" element={<UpcomingTour />} />
          <Route path="cancelled-tours" element={<CanceledTour />} />
          <Route path="completed-tours" element={<CompletedTour />} />
          <Route path="booking-details/:bookingId" element={<BookingDetailsPage />} />
          <Route path="coupons" element={<CouponPage />} />
          <Route path="add-coupon" element={<AddViewCoupon />} />
          <Route path="edit/:id/coupon" element={<AddViewCoupon />} />
          <Route path="reviews" element={<ReviewPage />} />
          <Route path="all-transactions" element={<AllTransactionPage />} />
          <Route
            path="complete-payments"
            element={<SuccessfulTransactions />}
          />
          <Route path="all-tickets" element={<AllTicketPage />} />
          <Route path="Answered-tickets" element={<AnsweredTicketPage />} />
          <Route path="open-ticket" element={<OpenTicketPage />} />
          <Route path="close-ticket" element={<CloseTicketPage />} />
          <Route
            path="support-ticket/:ticketId"
            element={<SupportTicketChat />}
          />
          <Route path="all-users" element={<AllUserPage />} />
          <Route path="profile/:userId/user" element={<UserProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile/:userId" element={<AdminProfile />} />
          <Route path="add-tour-map" element={<AddTourMapForm />} />
          <Route
            path="edit-package-form/:packageId"
            element={<EditPackageForm />}
          />
          <Route
            path="edit-package-category/:categoryId"
            element={<EditPackageCategoryForm />}
          />
        </Route>
        <Route
          path="/signin"
          element={
            <RedirectIfLoggedIn>
              <SignInPage />
            </RedirectIfLoggedIn>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default App;
