import { Avatar } from "antd";
import { observer } from "mobx-react";
import { UserOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { UserObj } from "../../stores/userStore";
import { projectStore } from "../../stores/projectsStore";
import { bugsStore } from "../../stores/bugStore";

const ProfileBanner = observer(
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
      <div style={{ paddingTop: 20 }}>
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
      </div>
    );
  }
);

export default ProfileBanner;
