import React, { FC, useContext, useEffect } from "react";
import Router from "next/router";
// import { useApolloClient } from '@apollo/client';
import { Loading } from "../components/Loading";
import { AuthStateContext, useAuthDispatch } from "../context/AuthContext";
import { useApolloClient } from "@apollo/client";
// import { useOrganisationDispatch } from "../contexts/OrganisationContext";

const SignOut: FC = () => {
  const client = useApolloClient();
  const { isAuthenticated, isLoading } = useContext(AuthStateContext);
  // const { dispatch } = useOrganisationDispatch();
  const { signOut } = useAuthDispatch();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      signOut()
        .then(() => {
          client.clearStore();
          // dispatch({ type: "clearSession" });
        })
        .catch((err) => console.error(err));

      return;
    }

    if (!isLoading && !isAuthenticated) {
      Router.push("/");
    }
  }, [isAuthenticated, isLoading, signOut]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{isLoading && <Loading text="Signing out" />}</>;
};

export default SignOut;
