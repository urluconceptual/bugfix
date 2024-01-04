import { Avatar, Card } from "antd";
import { observer } from "mobx-react";
import { UserOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { UserObj } from "../../stores/userStore";
import { projectStore } from "../../stores/projectsStore";
import { bugsStore } from "../../stores/bugStore";

const ProfileCard = observer(
  ({
    user,
    proposedBugs,
    handlePrivacyChange,
  }: {
    user?: UserObj | null;
    proposedBugs: number;
    handlePrivacyChange?: () => void;
  }) => {
    return (
      <Card style={{ padding: 10, margin: '10px 0px 10px 0px' }}>
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
            {handlePrivacyChange !== undefined && (
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
        </div>
      </Card>
    );
  }
);

export default ProfileCard;
