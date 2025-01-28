import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import {
  autoSignIn,
  confirmResetPassword,
  confirmSignUp,
  ConfirmSignUpOutput,
  getCurrentUser,
  resetPassword as authResetPassword,
  ResetPasswordOutput,
  signIn as authSignIn,
  SignInOutput,
  signOut as authSignOut,
  signUp as authSignUp,
  SignUpOutput,
} from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { Reducer, useImmerReducer } from "use-immer";
import { useLazyQuery } from "@apollo/client";
// import * as Sentry from '@sentry/nextjs';
import { defer, omit } from "lodash";
import { isAdmin, sanitizePhone } from "../libs/utils";
import { GET_USER_DETAILS } from "../graphql/queries";

export enum AuthStatus {
  // eslint-disable-next-line no-unused-vars
  LOADING,
  // eslint-disable-next-line no-unused-vars
  ANONYMOUS,
  // eslint-disable-next-line no-unused-vars
  AUTHENTICATED,
  // eslint-disable-next-line no-unused-vars
  PENDING_SIGN_IN,
  // eslint-disable-next-line no-unused-vars
  SIGN_IN_ERROR,
  // eslint-disable-next-line no-unused-vars
  SIGN_IN_TOTP,
  // eslint-disable-next-line no-unused-vars
  PENDING_SIGN_IN_TOTP,
  // eslint-disable-next-line no-unused-vars
  SIGN_IN_TOTP_ERROR,
  // eslint-disable-next-line no-unused-vars
  PENDING_SIGN_UP,
  // eslint-disable-next-line no-unused-vars
  SIGN_UP_ERROR,
  // eslint-disable-next-line no-unused-vars
  SIGN_UP_CONFIRM,
  // eslint-disable-next-line no-unused-vars
  PENDING_SIGN_UP_CONFIRM,
  // eslint-disable-next-line no-unused-vars
  SIGN_UP_CONFIRM_ERROR,
  // eslint-disable-next-line no-unused-vars
  PENDING_SIGN_OUT,
  // eslint-disable-next-line no-unused-vars
  RESET_PASSWORD,
  // eslint-disable-next-line no-unused-vars
  RESET_PASSWORD_ERROR,
  // eslint-disable-next-line no-unused-vars
  PENDING_RESET_PASSWORD,
  // eslint-disable-next-line no-unused-vars
  RESET_PASSWORD_CONFIRM,
  // eslint-disable-next-line no-unused-vars
  RESET_PASSWORD_CONFIRM_ERROR,
  // eslint-disable-next-line no-unused-vars
  PENDING_RESET_PASSWORD_CONFIRM,
}

export type AuthUserType = {
  id: string;
  email: string;
  phone?: string;
  fName?: string;
  lName?: string;
};

export type AuthStateContextType = {
  isAdmin: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  error?: Error;
  user: AuthUserType | undefined | null;
  idToken: string | undefined;
  status:
    | "ACTIVE"
    | "CONFIRMED"
    | "ARCHIVED"
    | "COMPROMISED"
    | "UNKNOWN"
    | "RESET_REQUIRED"
    | "FORCE_CHANGE_PASSWORD";
  sessionStatus: AuthStatus;
  tmpUser?: string;
  // organisations: UserOrganisation[];
};

type AuthSignUpParams = {
  password: string;
  email: string;
  fName: string;
  lName: string;
  phone: string;
};

export type AuthDispatchContextType = {
  // eslint-disable-next-line no-unused-vars
  dispatch: (action: any) => void;
  // eslint-disable-next-line no-unused-vars
  signIn: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<Partial<SignInOutput>>;
  // eslint-disable-next-line no-unused-vars
  signUp: (data: AuthSignUpParams) => Promise<Partial<SignUpOutput>>;
  // eslint-disable-next-line no-unused-vars
  signUpConfirm: ({
    email,
    code,
  }: {
    email?: string;
    code: string;
  }) => Promise<Partial<ConfirmSignUpOutput>>;
  // eslint-disable-next-line no-unused-vars
  resetPassword: ({
    email,
  }: {
    email: string;
  }) => Promise<Partial<ResetPasswordOutput>>;
  resetPasswordConfirm: ({
    // eslint-disable-next-line no-unused-vars
    code,
    // eslint-disable-next-line no-unused-vars
    newPassword,
    // eslint-disable-next-line no-unused-vars
    email,
  }: {
    code: string;
    newPassword: string;
    email?: string | undefined;
  }) => Promise<void>;
  signOut: () => Promise<void>;
};

type AuthContextProps = {
  children: React.ReactNode;
};

export const AuthStateContext = createContext({} as AuthStateContextType);
export const AuthDispatchContext = createContext({} as AuthDispatchContextType);

const authReducer: Reducer<
  AuthStateContextType & {
    tmpUser?: { email?: string; password?: string };
  }
> = (draft, action) => {
  switch (action.type) {
    case "signOut":
    case "anonymousSession":
    case "clearSession": {
      draft.user = undefined;
      draft.idToken = undefined;
      draft.isAuthenticated = false;
      draft.isLoading = false;
      draft.isAdmin = false;
      draft.error = undefined;
      draft.sessionStatus = AuthStatus.ANONYMOUS;
      draft.tmpUser = undefined;
      break;
    }
    case "clearErrors": {
      draft.error = undefined;
      break;
    }
    case "signingIn": {
      draft.sessionStatus = AuthStatus.PENDING_SIGN_IN;
      draft.error = undefined;
      break;
    }
    case "signInError": {
      draft.sessionStatus = AuthStatus.SIGN_IN_ERROR;
      draft.error = action.error;
      break;
    }
    case "signInTotp": {
      draft.sessionStatus = AuthStatus.PENDING_SIGN_IN_TOTP;
      draft.error = undefined;
      break;
    }
    case "signInWithTotp": {
      draft.sessionStatus = AuthStatus.PENDING_SIGN_IN_TOTP;
      draft.error = undefined;
      break;
    }
    case "signInTotpError": {
      draft.sessionStatus = AuthStatus.SIGN_IN_TOTP_ERROR;
      draft.error = action.error;
      break;
    }
    case "signUpError": {
      draft.sessionStatus = AuthStatus.SIGN_UP_ERROR;
      draft.error = action.error;
      break;
    }
    case "signedIn": {
      draft.user = omit(action.user as AuthUserType, [
        "addresses",
        "profiles",
        "subscriptions",
      ]) as AuthUserType;
      draft.idToken = action.user?.signInUserSession?.idToken?.jwtToken;
      draft.isAuthenticated = true;
      draft.error = undefined;
      draft.isLoading = false;
      draft.sessionStatus = AuthStatus.AUTHENTICATED;
      //   draft.isAdmin = isAdmin(draft.user?.email || "");
      draft.isAdmin = isAdmin();
      // draft.status = action.user.status;

      // Other details
      //   draft.organisations = action.user.organisations || [];
      draft.tmpUser = undefined;

      break;
    }
    case "resetPassword": {
      draft.sessionStatus = AuthStatus.RESET_PASSWORD;
      draft.error = undefined;
      break;
    }
    case "resettingPassword": {
      draft.sessionStatus = AuthStatus.PENDING_RESET_PASSWORD;
      draft.error = undefined;
      break;
    }
    case "resetPasswordError": {
      draft.sessionStatus = AuthStatus.RESET_PASSWORD_ERROR;
      draft.error = action.error;
      break;
    }
    case "resetPasswordConfirm": {
      draft.sessionStatus = AuthStatus.RESET_PASSWORD_CONFIRM;
      draft.error = undefined;
      draft.tmpUser = action.user;
      break;
    }
    case "confirmingResetPassword": {
      draft.sessionStatus = AuthStatus.PENDING_RESET_PASSWORD_CONFIRM;
      draft.error = undefined;
      break;
    }
    case "resetPasswordConfirmError": {
      draft.sessionStatus = AuthStatus.RESET_PASSWORD_CONFIRM_ERROR;
      draft.error = action.error;
      break;
    }
    case "signingUp": {
      draft.sessionStatus = AuthStatus.PENDING_SIGN_UP;
      draft.error = undefined;
      break;
    }
    case "signUpConfirm": {
      draft.sessionStatus = AuthStatus.SIGN_UP_CONFIRM;
      draft.error = undefined;
      draft.tmpUser = action.user;
      break;
    }
    case "confirmingSignUp": {
      draft.sessionStatus = AuthStatus.PENDING_SIGN_UP_CONFIRM;
      draft.error = undefined;
      break;
    }
    case "signUpConfirmError": {
      draft.sessionStatus = AuthStatus.SIGN_UP_CONFIRM_ERROR;
      draft.error = action.error;
      break;
    }
    case "signingOut": {
      draft.sessionStatus = AuthStatus.PENDING_SIGN_OUT;
      draft.isLoading = true;
      break;
    }
    default: {
      throw new Error(`Unhandled dispatch: ${action.type}`);
    }
  }
};

const initialState = {
  user: undefined,
  idToken: undefined,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  error: undefined,
  sessionStatus: AuthStatus.LOADING,
  organisations: undefined,
  tmpUser: undefined, // Used for sign-up confirmation
};

export function AuthProvider({ children }: AuthContextProps): any {
  const [state, dispatch] = useImmerReducer<any, any>(
    authReducer,
    initialState
  );
  const { tmpUser } = state;
  const [getUser] = useLazyQuery(GET_USER_DETAILS, {
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const resetPassword = useCallback(
    async ({
      email,
    }: {
      email: string;
    }): Promise<Partial<ResetPasswordOutput>> => {
      dispatch({ type: "resettingPassword" });
      try {
        const { isPasswordReset, nextStep } = await authResetPassword({
          username: email,
        });

        if (nextStep.resetPasswordStep === "CONFIRM_RESET_PASSWORD_WITH_CODE") {
          dispatch({
            type: "resetPasswordConfirm",
            user: { email: email.toLowerCase() },
          });
        }

        return { isPasswordReset, nextStep };
      } catch (err) {
        dispatch({ type: "resetPasswordError", error: err });
        console.error("AuthProvider:resetPassword:error", err);

        // throw err;

        return { isPasswordReset: false };
      }
    },
    [dispatch]
  );

  const resetPasswordConfirm = useCallback(
    async ({
      code,
      newPassword,
      email,
    }: {
      code: string;
      newPassword: string;
      email?: string;
    }): Promise<void> => {
      dispatch({ type: "confirmingResetPassword" });
      try {
        await confirmResetPassword({
          newPassword,
          username: tmpUser?.email || email,
          confirmationCode: code,
        });

        await authSignIn({
          username: tmpUser?.email || email,
          password: newPassword,
        });
      } catch (err) {
        dispatch({ type: "resetPasswordConfirmError", error: err });
        console.error("AuthProvider:resetPassword:error", err);

        // throw err;
      }
    },
    [dispatch, tmpUser]
  );

  const signIn = useCallback(
    async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }): Promise<Partial<SignInOutput>> => {
      dispatch({ type: "signingIn" });
      try {
        const { isSignedIn, nextStep } = await authSignIn({
          username: email.toLowerCase(),
          password,
        });

        if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
          dispatch({
            type: "signUpConfirm",
            user: { email: email.toLowerCase(), password },
          });
        }

        if (nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_TOTP_CODE") {
          dispatch({
            type: "signInTotp",
            user: { email: email.toLowerCase(), password },
          });
        }

        return { isSignedIn, nextStep };
      } catch (err) {
        dispatch({ type: "signInError", error: err });
        console.error("AuthProvider:signIn:error", err);

        // throw err;

        return { isSignedIn: false };
      }
    },
    [dispatch]
  );

  const signUp = useCallback(
    async ({
      email,
      fName,
      lName,
      password,
      phone,
    }: AuthSignUpParams): Promise<
      Partial<SignUpOutput> & {
        error?: Error;
      }
    > => {
      dispatch({ type: "signingUp" });

      try {
        const { isSignUpComplete, userId, nextStep } = await authSignUp({
          password,
          username: email.toLowerCase(),
          options: {
            autoSignIn: true,
            userAttributes: {
              email: email.toLowerCase(),
              name: fName,
              family_name: lName,
              phone_number: sanitizePhone(phone),
            },
          },
        });

        if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
          dispatch({
            type: "signUpConfirm",
            user: { email: email.toLowerCase(), password },
          });
        }

        if (nextStep.signUpStep === "COMPLETE_AUTO_SIGN_IN") {
          await autoSignIn();
        }

        return { isSignUpComplete, userId, nextStep };
      } catch (err: any) {
        dispatch({ type: "signUpError", error: err });
        console.error("AuthProvider:signUp:error", err);

        // throw err;

        return { isSignUpComplete: false };
      }
    },
    [dispatch]
  );

  const signUpConfirm = useCallback(
    async ({
      email,
      code,
    }: {
      email?: string;
      code: string;
    }): Promise<Partial<ConfirmSignUpOutput>> => {
      dispatch({ type: "confirmingSignUp" });
      try {
        const { isSignUpComplete, userId, nextStep } = await confirmSignUp({
          username: tmpUser?.email || email,
          confirmationCode: code,
        });

        if (nextStep.signUpStep === "COMPLETE_AUTO_SIGN_IN") {
          await autoSignIn();
          return { isSignUpComplete, userId, nextStep };
        }

        return { isSignUpComplete, userId, nextStep };
      } catch (err: any) {
        dispatch({ type: "signUpConfirmError", error: err });
        console.error("AuthProvider:signUpConfirm:error", err);

        // throw err;

        return { isSignUpComplete: false };
      }
    },
    [dispatch, tmpUser]
  );

  const signOut = useCallback(async (): Promise<void> => {
    dispatch({ type: "signingOut" });
    try {
      // Debounce to prevent cleanup racing condition
      defer(async () => {
        await authSignOut();

        dispatch({ type: "signOut" });

        // Clear Sentry user data
        // Sentry.getCurrentScope().setUser(null);
      });
    } catch (err) {
      console.error("AuthProvider:signOut:error", err);

      // throw err;
    }
  }, [dispatch]);

  // Check auth status
  const checkAuthStatus = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      console.log({ currentUser });
      // Fetch User details
      if (currentUser) {
        //  TODO: ADD ERROR when user is not found
        const { data, error } = await getUser();
        console.log("GETUSER", data, error);
        if (data?.user) {
          dispatch({ type: "signedIn", user: data?.user });
        }
        if (!data?.user && error && error.message) {
          console.log("no user");
          dispatch({ type: "anonymousSession" });
        }
      }
    } catch (e) {
      dispatch({ type: "anonymousSession" });
    }
  }, [dispatch]);

  const hubHandler = useCallback(
    async ({ payload }) => {
      // eslint-disable-next-line no-console
      console.info({ action: "AuthProvider:hub:event", data: payload });
      if (payload.event === "signIn" || payload.event === "signedIn") {
        // Fetch User details
        const { data } = await getUser();
        dispatch({ type: "signedIn", user: data?.user });

        // Set Sentry user
        // Sentry.setUser({ email: data?.user.id, id: data?.user.email });
      }
    },
    [dispatch, getUser]
  );

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Amplify Hub handling
  useEffect(() => {
    const hubListenerCancel = Hub.listen("auth", hubHandler);

    return () => {
      hubListenerCancel();
    };
  }, [dispatch, getUser]);

  const dispatchContextValue = useMemo(
    () => ({
      signIn,
      signUp,
      signUpConfirm,
      signOut,
      resetPassword,
      resetPasswordConfirm,
      dispatch,
    }),
    [signIn, signUp, signUpConfirm, signOut, dispatch]
  );

  return (
    <AuthDispatchContext.Provider value={dispatchContextValue}>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  );
}

export const useAuthState = () => {
  const c = useContext(AuthStateContext);
  if (!c)
    throw new Error("Cannot use useAuthState when not under the AuthProvider");
  return c;
};

export const useAuthDispatch = () => {
  const c = useContext(AuthDispatchContext);
  if (!c)
    throw new Error(
      "Cannot use useAuthDispatch when not under the AuthProvider"
    );
  return c;
};
