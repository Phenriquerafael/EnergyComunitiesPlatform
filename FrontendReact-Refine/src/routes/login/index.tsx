import React from "react";
import { AuthPage, ThemedTitleV2 } from "@refinedev/antd";

import { authCredentials } from "@/providers";

export const LoginPage = () => {
  return (
    <AuthPage
      type="login"
      registerLink={true}
      forgotPasswordLink={true}
      title={
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: "8px", height: "100%" }}>
          <img
            src="/SATCOMM-650x500.png"
            alt="Satcomm Logo"
            style={{ maxWidth: "300px", height: "auto" , marginBottom: "-90px" }}
          />
          
        </div>
      }
      formProps={{
        initialValues: authCredentials,
      }}
    />
  );
};
