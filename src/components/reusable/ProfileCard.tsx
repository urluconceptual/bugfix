import { Avatar, Button, Card } from "antd";
import { observer } from "mobx-react";
import { UserOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { UserObj } from "../../stores/userStore";
import { projectStore } from "../../stores/projectsStore";
import { bugsStore } from "../../stores/bugStore";
import { Link } from "react-router-dom";
import { MANAGE_PROFILE_LINK } from "../../models/constants";

const ProfileCard = observer(
  ({
    user,
    proposedBugs,
    handlePrivacyChange,
    isCurrentUserProfile,
  }: {
    user?: UserObj | null;
    proposedBugs: number;
    handlePrivacyChange?: () => void;
    isCurrentUserProfile?: boolean;
  }) => {
    return (
      <Card style={{ padding: 10, margin: "10px 0px 10px 0px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            rowGap: 10,
          }}
        >
          <Avatar size={100} icon={<UserOutlined />} />
          <div>
            {isCurrentUserProfile && (
              <span
                title="Click icon to switch between private & public acount."
                onClick={handlePrivacyChange!}
                style={{ cursor: "pointer" }}
              >
                {user?.accountIsPrivate ? <LockOutlined /> : <UnlockOutlined />}
              </span>
            )}{" "}
            {user?.email}
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", columnGap: 30 }}
          >
            <span>Bugs caught by user: {proposedBugs}</span>
            <span>Projects: {projectStore.currentViewProjects.length}</span>
            <span>
              Bugs proposed to user: {bugsStore.currentViewBugs.length}
            </span>
          </div>
          {isCurrentUserProfile && (
            <Button>
              <Link to={MANAGE_PROFILE_LINK}>Manage my profile</Link>
            </Button>
          )}
        </div>
      </Card>
    );
  }
);

export default ProfileCard;
