// import React, {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
// } from "react";
// // eslint-disable-next-line import/no-extraneous-dependencies
// import Auth from "@aws-amplify/auth";
// // eslint-disable-next-line import/no-extraneous-dependencies
// import { Hub } from "@aws-amplify/core";
// import { Reducer, useImmerReducer } from "use-immer";
// import { useRouter } from "next/router";

// export enum AuthStatus {
//   /* eslint-disable no-unused-vars */
//   LOADING,
//   ANONYMOUS,
//   AUTHENTICATED,
//   PENDING_SIGN_IN,
//   PENDING_SIGN_UP,
//   PENDING_SIGN_OUT,
// }

// export type AuthUserType = {
//   id: string;
//   email: string;
//   phone?: string;
//   fName?: string;
//   lName?: string;
// };

// export type AuthStateContextType = {
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   user: AuthUserType | undefined | null;
//   idToken: string | undefined;
//   sessionStatus: AuthStatus;
// };

// export type AuthDispatchContextType = {
//   dispatch: (action: any) => void;
//   signOut: () => Promise<void>;
// };

// type AuthContextProps = {
//   children: React.ReactNode;
// };
// const sanitizeUser = (data: any): AuthUserType | null => {
//   if (!data) {
//     return null;
//   }

//   // cognito attributes
//   return {
//     id: data.attributes && (data.attributes.sub as string),
//     email: data.attributes && data.attributes.email,
//     fName: data.attributes && data.attributes.name,
//     lName: data.attributes && data.attributes.family_name,
//     phone: data.attributes && data.attributes.phone_number,
//   };
// };
// export const AuthStateContext = createContext({} as AuthStateContextType);
// export const AuthDispatchContext = createContext({} as AuthDispatchContextType);

// const authReducer: Reducer<AuthStateContextType> = (draft, action) => {
//   switch (action.type) {
//     case "clearSession": {
//       draft.user = undefined;
//       draft.idToken = undefined;
//       draft.isAuthenticated = false;
//       draft.isLoading = true;
//       draft.sessionStatus = AuthStatus.ANONYMOUS;
//       break;
//     }
//     case "anonymousSession": {
//       draft.user = undefined;
//       draft.idToken = undefined;
//       draft.isAuthenticated = false;
//       draft.isLoading = false;
//       draft.sessionStatus = AuthStatus.ANONYMOUS;
//       break;
//     }
//     case "signingIn": {
//       draft.sessionStatus = AuthStatus.PENDING_SIGN_IN;
//       break;
//     }
//     case "signedIn": {
//       draft.user = sanitizeUser(action.user);
//       draft.idToken = action.user?.signInUserSession?.idToken?.jwtToken;
//       draft.isAuthenticated = true;
//       draft.isLoading = false;
//       draft.sessionStatus = AuthStatus.AUTHENTICATED;
//       break;
//     }
//     case "signingUp": {
//       draft.sessionStatus = AuthStatus.PENDING_SIGN_UP;
//       break;
//     }
//     case "signingOut": {
//       draft.sessionStatus = AuthStatus.PENDING_SIGN_OUT;
//       break;
//     }
//     case "signedOut": {
//       draft.user = undefined;
//       draft.idToken = undefined;
//       draft.isAuthenticated = false;
//       draft.isLoading = false;
//       draft.sessionStatus = AuthStatus.ANONYMOUS;
//       break;
//     }

//     default: {
//       throw new Error(`Unhandled dispatch: ${action.type}`);
//     }
//   }
// };

// const initialState = {
//   user: undefined,
//   idToken: undefined,
//   isAuthenticated: false,
//   isLoading: true,
//   sessionStatus: AuthStatus.LOADING,
// };

// export function AuthProvider({ children }: AuthContextProps): any {
//   const [state, dispatch] = useImmerReducer<any, any>(
//     authReducer,
//     initialState
//   );
//   const { user, isAuthenticated } = state;
//   const router = useRouter();

//   const signOut = useCallback(async (): Promise<void> => {
//     dispatch({ type: "signingOut" });
//     try {
//       await Auth.signOut();
//       // Remove local profiles
//       localStorage.removeItem("profiles");

//       // Clear Sentry user data

//       dispatch({ type: "signedOut" });
//     } catch (err) {
//       console.error("AuthProvider:signOut:error", err);
//     }
//   }, [dispatch]);

//   // Check auth status
//   const checkAuthStatus = useCallback(async () => {
//     Auth.currentAuthenticatedUser()
//       .then((currentUser) => {
//         dispatch({ type: "signedIn", user: currentUser });
//       })
//       .catch(() => dispatch({ type: "anonymousSession" }));
//   }, [dispatch]);

//   useEffect(() => {
//     checkAuthStatus();
//   }, [checkAuthStatus]);

//   // Amplify Hub handling
//   useEffect(() => {
//     // TODO: as ANY

//     const hubHandler = async ({ payload }: any) => {
//       // console.info({ action: 'AuthProvider:hub:event', data: payload });
//       if (payload.event === "signIn") {
//         // Add missing attributes for forced password resets.
//         const tempUser = payload.data || (await Auth.currentUserInfo());

//         // Fetch User details
//         dispatch({ type: "signedIn", user: tempUser });
//       }

//       if (payload.event === "signOut") {
//         dispatch({ type: "clearSession" });
//       }
//     };

//     Hub.listen("auth", hubHandler);

//     return () => {
//       Hub.remove("auth", hubHandler);
//     };
//   }, [dispatch]);

//   const dispatchContextValue = useMemo(
//     () => ({
//       signOut,
//       dispatch,
//     }),
//     [signOut, dispatch]
//   );

//   return (
//     <AuthDispatchContext.Provider value={dispatchContextValue}>
//       <AuthStateContext.Provider value={state}>
//         {children}
//       </AuthStateContext.Provider>
//     </AuthDispatchContext.Provider>
//   );
// }

// export const useAuthState = () => {
//   const c = useContext(AuthStateContext);
//   if (!c)
//     throw new Error("Cannot use useAuthState when not under the AuthProvider");
//   return c;
// };

// export const useAuthDispatch = () => {
//   const c = useContext(AuthDispatchContext);
//   if (!c)
//     throw new Error(
//       "Cannot use useAuthDispatch when not under the AuthProvider"
//     );
//   return c;
// };
