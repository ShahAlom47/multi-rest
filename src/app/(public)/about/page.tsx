import React, { Suspense } from "react";

import ContactInfo from "@/components/AboutUsComponents/ContactInfo";
import CustomerTrust from "@/components/AboutUsComponents/CustomerTrust";
import Story from "@/components/AboutUsComponents/Story";
import VisionMission from "@/components/AboutUsComponents/VisionMission";
import WhatWeOffer from "@/components/AboutUsComponents/WhatWeOffer";
import WhyChooseUs from "@/components/AboutUsComponents/WhyChooseUs";
import AboutUsSection from "@/components/HomeComponents/AboutUsSection";
import Newsletter from "@/components/HomeComponents/NewsLetter";
import Loading from "@/app/loading";
import { Metadata } from "next";
import { aboutMetadata } from "@/utils/seo/staticMetadata";

export const metadata: Metadata = aboutMetadata;
export const dynamic = "force-dynamic";

const About = () => {
  return (
    <Suspense fallback={<Loading></Loading>}>
      <AboutUsSection></AboutUsSection>
      <VisionMission />
      <Story />
      <WhatWeOffer />
      <WhyChooseUs />
      <CustomerTrust />
      <Newsletter></Newsletter>
      <ContactInfo />
    </Suspense>
  );
};

export default About;
