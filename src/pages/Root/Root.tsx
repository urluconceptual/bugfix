import { Layout } from "antd";
import { Content, Footer} from "antd/es/layout/layout";
import {Outlet } from "react-router-dom";
import { observer } from "mobx-react";
import CustomHeader from "../../components/CustomHeader";
import { LIGHT_GREY_COLOUR } from "../../models/constants";

import "./Root.css";

const RootLayout = observer(() => {
  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <CustomHeader />
        <Content
          style={{
            display: "flex",
            justifyContent: "center",
            color: LIGHT_GREY_COLOUR,
          }}
        >
          <Outlet />
        </Content>
        <Footer style={{ textAlign: "center" }}>BugFix ©2023</Footer>
      </Layout>
    </>
  );
});

export default RootLayout;
