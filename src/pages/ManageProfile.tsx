import { Button, Form, Input } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import {
  UserOutlined,
  KeyOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { LIGHT_GREY_COLOUR } from "../models/constants";

const enum Action {
  changeEmail,
  changePassword,
}

const ManageProfile = observer(() => {
  const [activeAction, setActiveAction] = useState<Action | null>(null);

  const handleActionClick = (selectedAction: Action) => {
    setActiveAction(activeAction !== selectedAction ? selectedAction : null);
  };

  const renderForm = () => {
    switch (activeAction) {
      case Action.changeEmail:
        return (
          <Form
            name="manageProfileForm"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{
              maxWidth: 600,
            }}
            autoComplete="off"
          >
            <Form.Item<string>
              name="email"
              rules={[
                { required: true, message: "Please input your email." },
                {
                  type: "email",
                  message: "Please provide a valid email address.",
                },
              ]}
            >
              <Input
                style={{ width: 400 }}
                placeholder="email"
                prefix={<UserOutlined />}
              />
            </Form.Item>
            <Form.Item>
              <Button type="dashed" style={{ width: 400 }} htmlType="submit">
                Done
              </Button>
            </Form.Item>
          </Form>
        );
      case Action.changePassword:
        return (
          <Form
            name="manageProfileForm"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{
              maxWidth: 600,
            }}
            autoComplete="off"
          >
            <Form.Item<string>
              name="password"
              rules={[
                { required: true, message: "Please input your password." },
              ]}
            >
              <Input.Password
                style={{ width: 400 }}
                placeholder="password"
                prefix={<KeyOutlined />}
                iconRender={(visible) =>
                  visible ? (
                    <EyeOutlined style={{ color: LIGHT_GREY_COLOUR }} />
                  ) : (
                    <EyeInvisibleOutlined
                      style={{ color: LIGHT_GREY_COLOUR }}
                    />
                  )
                }
              />
            </Form.Item>
            <Form.Item>
              <Button type="dashed" style={{ width: 400 }} htmlType="submit">
                Done
              </Button>
            </Form.Item>
          </Form>
        );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        rowGap: activeAction === null ? 50 : 20,
      }}
    >
      {(activeAction === Action.changeEmail || activeAction === null) && (
        <Button
          style={{ width: 400 }}
          onClick={() => handleActionClick(Action.changeEmail)}
        >
          Change my email
        </Button>
      )}
      {activeAction === Action.changeEmail && renderForm()}
      {(activeAction === Action.changePassword || activeAction === null) && (
        <Button
          style={{ width: 400 }}
          onClick={() => handleActionClick(Action.changePassword)}
        >
          Change my password
        </Button>
      )}
      {activeAction === Action.changePassword && renderForm()}
    </div>
  );
});

export default ManageProfile;
