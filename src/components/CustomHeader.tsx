import { observer } from "mobx-react";
import { Button, Menu } from "antd";
import { Header } from "antd/es/layout/layout";
import { Link, useLocation } from "react-router-dom";
import { BugFilled } from "@ant-design/icons";
import {
  EXPLORE_LINK,
  LIGHT_GREY_COLOUR,
  MY_PROFILE_LINK,
  NEON_GREEN_COLOUR,
  WELCOME_LINK,
} from "../models/constants";
import { userStore } from "../stores/userStore";

const CustomHeader = observer(() => {
  const location = useLocation();
  return (
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
        <Link
          to={WELCOME_LINK}
          style={{
            display: "flex",
            alignItems: "center",
            flex: "1",
            color: LIGHT_GREY_COLOUR,
          }}
        >
          <h1>bugfix</h1>
          <BugFilled style={{ fontSize: "18px", color: NEON_GREEN_COLOUR }} />
        </Link>
        <Menu
          mode="horizontal"
          style={{ justifyContent: "flex-end", flex: 6 }}
          selectedKeys={[location.pathname]}
        >
          <Menu.Item key={EXPLORE_LINK}>
            <Link to={EXPLORE_LINK}>Explore</Link>
          </Menu.Item>
          {userStore.isSignedIn && (
            <Menu.Item key={MY_PROFILE_LINK}>
              <Link to={MY_PROFILE_LINK}>My Profile</Link>
            </Menu.Item>
          )}
        </Menu>
        {userStore.isSignedIn && <Button onClick={userStore.logOut}>Log Out</Button>}
      </div>
    </Header>
  );
});

export default CustomHeader;
