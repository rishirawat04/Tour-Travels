import React from "react";

import HeaderPage from "../components/HeaderPage";
import HeroPage from "../components/HeroPage";
import Whyus from "../components/Whyus";
import TopDestinations from "../components/TopDestinations";
import AboutUs from "../components/AboutUs";
import MostPopularTours from "../components/MostPopularTours";
import WhyChooseUs from "../components/WhyChooseUs";
import TestimonialPage from "../components/TestimonialPage";
import BlogPage from "../components/BlogPage";
import FooterPage from "../components/FooterPage";

const HomePage = () => {
  return (
    <>
      <HeaderPage />
      <HeroPage />
      <Whyus />
      <TopDestinations />
      <AboutUs />
      <MostPopularTours />
      <WhyChooseUs />
      <TestimonialPage />
      <BlogPage />
      <FooterPage />
    </>
  );
};

export default HomePage;
