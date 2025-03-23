import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import RedirectIfLoggedIn from "./components/RedirectIfLoggedIn";
import LoaderPage from "./components/LoaderPage";

// Lazy Loading for Components and Pages
const HomePage = lazy(() => import("./pages/HomePage"));
const CategoriesPage = lazy(() => import("./components/CategoriesPage"));
const PackageDetails = lazy(() => import("./components/PackageDetails"));
const AboutusPage = lazy(() => import("./pages/AboutusPage"));
const DestinationPage = lazy(() => import("./pages/DestinationsPage"));
const Contactus = lazy(() => import("./pages/Contactus"));
const SearchResultPage = lazy(() => import("./pages/SearchResults"));
const SigninPage = lazy(() => import("./pages/SigninPage"));
const SignUpPage = lazy(() => import("./pages/SignupPage"));
const BlogDetails = lazy(() => import("./components/BlogDetails"));
const UserLayout = lazy(() => import("./pages/LayoutPage"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const UserProfilePage = lazy(() => import("./components/UserProfilePage"));
const SupportTicket = lazy(() => import("./pages/SupportTicket"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const TourHistory = lazy(() => import("./pages/TourHistory"));
const FavoritePage = lazy(() => import("./pages/FavouritePage"));
const ViewPackageDetails = lazy(() => import("./components/ViewPackageDetails"));
const VerifyAccountPage = lazy(() => import("./components/verifyAccountPage"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const VerifyOTP = lazy(() => import("./components/VerifyOTP"));
const ResetPassword = lazy(() => import("./components/ResetPassword"));
const SupportTicketChat = lazy(() => import("./components/SupportTicketChat"));

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div><LoaderPage /></div>}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/signin"
            element={
              <RedirectIfLoggedIn>
                <SigninPage />
              </RedirectIfLoggedIn>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectIfLoggedIn>
                <SignUpPage />
              </RedirectIfLoggedIn>
            }
          />
          <Route index path="/" element={<HomePage />} />
          <Route path="/destination/:destinationName" element={<CategoriesPage />} />
          <Route path="/packageDetail/:packageId" element={<PackageDetails />} />
          <Route path="/aboutUs" element={<AboutusPage />} />
          <Route path="/destinations" element={<DestinationPage />} />
          <Route path="/contact" element={<Contactus />} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route path="/Blog-Details/:blogId" element={<BlogDetails />} />
          <Route path="/verify-account/:email" element={<VerifyAccountPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp/:email" element={<VerifyOTP />} />
          <Route path="/reset-password/:email" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="profile/:userId" element={<UserProfilePage />} />
            <Route path="payment-log" element={<PaymentPage />} />
            <Route path="tour-history" element={<TourHistory />} />
            <Route path="support-ticket" element={<SupportTicket />} />
            <Route path="chat/:ticketId" element={<SupportTicketChat />} />
            <Route path="favourite-list" element={<FavoritePage />} />
            <Route path="packageDetails" element={<ViewPackageDetails />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
