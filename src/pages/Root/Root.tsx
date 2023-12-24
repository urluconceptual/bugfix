import { Layout, Menu } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { Link, Outlet } from "react-router-dom";
import { BugFilled } from "@ant-design/icons";

import "./Root.css";
import { userStore } from "../../stores/userStore";
import { observer } from "mobx-react";

const RootLayout = observer(() => {
  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          className="header"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div
            style={{
              width: "1200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", flex: "1" }}>
              <h1>bugfix</h1>
              <BugFilled style={{ fontSize: "18px", color: "#d8fe51" }} />
            </div>
            <Menu
              mode="horizontal"
              style={{ justifyContent: "flex-end", flex: 6 }}
            >
              <Menu.Item key="1">
                <Link to="/projects">Explore</Link>
              </Menu.Item>
              {userStore.isSignedIn && (
                <Menu.Item key="2">
                  <Link to="/profiles">My Profile</Link>
                </Menu.Item>
              )}
            </Menu>
          </div>
        </Header>
        <Content
          style={{
            display: "flex",
            justifyContent: "center",
            color: "#e3e7e0",
          }}
        >
          <div
            style={{
              width: "1200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>BugFix ©2023</Footer>
      </Layout>
    </>
  );
});

export default RootLayout;
