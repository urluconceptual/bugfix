import { Button, Form, Input, Modal, Spin } from "antd";
import { observer } from "mobx-react";
import {
  ProjectData,
} from "../../../stores/projectsStore";
import { useState } from "react";
import { serverTimestamp } from "firebase/firestore";
import { NEON_GREEN_COLOUR } from "../../../models/constants";
import {
  BugOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { userStore } from "../../../stores/userStore";
import { BugObj, BugStatus, bugsStore } from "../../../stores/bugStore";

const AddBugForm = observer(({ project }: { project: ProjectData }) => {
  const [form] = Form.useForm();
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [formIsOpen, setFormIsOpen] = useState<boolean>(false);

  const handleFinishForm = async (newBug: BugObj) => {
    setFormLoading(true);
    newBug.projectId = project.id;
    newBug.proposedBy = userStore.currentUser? userStore.currentUser.uid : null;
    newBug.timeProposed = serverTimestamp();
    newBug.status = BugStatus.Proposed;
    bugsStore.addToDb(newBug);
    setFormLoading(false);
    setFormIsOpen(false);
    form.resetFields();
  };

  return (
    <>
      <span onClick={() => setFormIsOpen(true)}>
        <BugOutlined style={{ color: NEON_GREEN_COLOUR }} key="reportBug" />{" "}
        Report bug
      </span>
      <Modal
        width="650px"
        title="Report Bug"
        open={formIsOpen}
        onCancel={() => setFormIsOpen(false)}
        footer={null}
      >
        <Spin tip="Saving bug..." spinning={formLoading}>
          <Form
          form={form}
            name="addBugForm"
            layout="horizontal"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onFinish={handleFinishForm}
            autoComplete="off"
          >
            <Form.Item<BugObj>
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                  message: "Please fill in a short description of the bug.",
                },
              ]}
            >
              <Input
                style={{ width: 400 }}
                placeholder="Ex: Loading bug on profile page"
              />
            </Form.Item>
            <Form.List
              name="stepsToReproduce"
              rules={[
                {
                  validator: async (_, names) => {
                    if (!names || names.length < 1) {
                      return Promise.reject(
                        new Error("Please add at least one step.")
                      );
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field, index) => (
                    <Form.Item
                      label={`Step ${index + 1}`}
                      required={false}
                      key={field.key}
                    >
                      <Form.Item
                        {...field}
                        validateTrigger={["onChange", "onBlur"]}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message:
                              "Please input a step or delete this field.",
                          },
                        ]}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Input placeholder="Click ..." style={{width: fields.length > 1? '90%': '100%'}}/>
                          {fields.length > 1 ? (
                            <MinusCircleOutlined
                              onClick={() => remove(field.name)}
                            />
                          ) : null}
                        </div>
                      </Form.Item>
                    </Form.Item>
                  ))}
                  <Form.Item style={{ display: 'flex', justifyContent: 'flex-end'}}>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{ width: 400 }}
                      icon={<PlusOutlined />}
                    >
                      Add step to reproduce
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.Item>
              <Button style={{ width: 600 }} htmlType="submit">
                Done
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
});

export default AddBugForm;
