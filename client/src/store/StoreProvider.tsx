"use client";

import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { GoogleOAuthProvider } from "@react-oauth/google";

const StoreProvider = ({ children }: { children: ReactNode }) => {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID!}>
      <Provider store={store()}>{children}</Provider>
    </GoogleOAuthProvider>
  );
};

export default StoreProvider;
