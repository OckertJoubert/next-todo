import React, { useEffect } from "react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import PricingCards from "../components/PricingCards";

// import GreenifyLaunch from "../components/Auth/SignUpForm";
import { Box } from "@chakra-ui/react";
import Page from "../components/Page";

function Index() {
  const router = useRouter();
  useEffect(() => {
    if (router.isReady && router.query?.path) {
      if (router.query.path.indexOf("?loop=true") == -1) router.push("/404");
    }
  }, [router]);
  return (
    <Page>
      <NavBar />
      {/* <Footer /> */}
    </Page>
  );
}
export default Index;
