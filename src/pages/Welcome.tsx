import { Button, Form, Input } from "antd";
import { useState } from "react";
import {
  UserOutlined,
  KeyOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { UserObj, userStore } from "../stores/userStore";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import { EXPLORE_LINK, LIGHT_GREY_COLOUR } from "../models/constants";

const enum FormState {
  anonymous,
  signUp,
  logIn,
}

const Welcome = observer(() => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<FormState>(FormState.anonymous);

  const handleFormClick = (newState: FormState) => {
    if (newState === FormState.anonymous) {
      navigate(EXPLORE_LINK);
    }
    setFormState(formState !== newState ? newState : FormState.anonymous);
  };

  const handleFinishForm = async (userObj: UserObj) => {
    switch (formState) {
      case FormState.signUp:
        await userStore.signUp(userObj);
        break;
      case FormState.logIn:
        await userStore.logIn(userObj);
    }

    if (userStore.isSignedIn) {
      navigate(EXPLORE_LINK);
    }
  };

  const renderForm = () => {
    return (
      <Form
        name="welcomePageForm"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={handleFinishForm}
        autoComplete="off"
      >
        <Form.Item<UserObj>
          name="email"
          rules={[
            { required: true, message: "Please input your email." },
            { type: "email", message: "Please provide a valid email address." },
          ]}
        >
          <Input
            style={{ width: 400 }}
            placeholder="email"
            prefix={<UserOutlined />}
          />
        </Form.Item>
        <Form.Item<UserObj>
          name="password"
          rules={[{ required: true, message: "Please input your password." }]}
        >
          <Input.Password
            style={{ width: 400 }}
            placeholder="password"
            prefix={<KeyOutlined />}
            iconRender={(visible) =>
              visible ? (
                <EyeOutlined style={{ color: LIGHT_GREY_COLOUR}} />
              ) : (
                <EyeInvisibleOutlined style={{ color: LIGHT_GREY_COLOUR }} />
              )
            }
          />
        </Form.Item>
        <Form.Item>
          <Button style={{ width: 200 }} htmlType="submit">
            Done
          </Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <div
      style={{
        width: "1200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ fontSize: 75 }}>
        Don't let bugs
        <br /> bug you.
      </div>
      {!userStore.isSignedIn && (
        <div
          style={{
            width: 400,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <Button
            size="large"
            style={{ width: 400 }}
            onClick={() => handleFormClick(FormState.signUp)}
          >
            Sign up
          </Button>
          {formState === FormState.signUp && renderForm()}
          <Button
            size="large"
            style={{ width: 400 }}
            onClick={() => handleFormClick(FormState.logIn)}
          >
            Log in
          </Button>
          {formState === FormState.logIn && renderForm()}
          <Button
            size="large"
            style={{ width: 400 }}
            onClick={() => handleFormClick(FormState.anonymous)}
          >
            Stay anonymous
          </Button>
        </div>
      )}
    </div>
  );
});

export default Welcome;
