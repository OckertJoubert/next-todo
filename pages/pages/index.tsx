import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  Text,
  VStack,
  Spacer,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import NavBar from "../../components/NavBar";
import { Footer } from "../../components/Footer";
import { useAuthState } from "../../context/AuthContext";
import Todo from "../../components/toDo";
import Page from "../../components/Page";
const LocationPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthState();
  useEffect(() => {
    if (router.isReady && router.query?.path) {
      if (router.query.path.indexOf("?loop=true") == -1) router.push("/404");
    }
    if (router) {
      console.log("router: ", router);
    }
    if (!isAuthenticated && !isLoading) {
      router.push("/sign-in");
    }
  }, [router, isAuthenticated, isLoading]);

  return (
    <Page>
      <NavBar />
      <Todo />
    </Page>
  );
};

export default LocationPage;
