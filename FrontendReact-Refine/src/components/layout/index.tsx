import React from "react";

import { ThemedLayoutV2, ThemedTitleV2 } from "@refinedev/antd";
import { Header } from "./header";

export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <>

      <ThemedLayoutV2
        Header={Header}
        Title={(titleProps) => {
          return <div >
                  <img
                    src="/SATCOMM-550x129.jpg"
                    alt="Satcomm Logo"
                    style={{ maxWidth: "200px", height: "auto", marginLeft: "-15px" }}
                  />
                </div>;{/* <ThemedTitleV2 {...titleProps} text="Refine" /> */};
        }}
      >
        {children}
      </ThemedLayoutV2>
    </>
  );
};
