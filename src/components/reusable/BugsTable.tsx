import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { BugData, BugStatus, bugsStore } from "../../stores/bugStore";
import { Select, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { serverTimestamp } from "firebase/firestore";
import { userStore } from "../../stores/userStore";
import { projectStore } from "../../stores/projectsStore";
import { useLocation } from "react-router-dom";
import { PROFILE_LINK } from "../../models/constants";

const BugsTable = observer(() => {
  const [dataSource, setDataSource] = useState<BugData[]>([]);
  const location = useLocation();

  useEffect(() => {
    setDataSource(bugsStore.currentViewBugs);
  }, [bugsStore.currentViewBugs]);

  const formatDate = (timeStamp: any) => {
    const date = new Date(timeStamp.seconds * 1000);
    return date.toUTCString();
  };

  const handleDropdownOptionSelected = (e: any, record: BugData) => {
    bugsStore.editInDb({ ...record, status: e, lastUpdated: serverTimestamp() });
  };

  const columns: ColumnsType<BugData> = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    location.pathname.includes(`${PROFILE_LINK}`)? {
      title: "Project Title",
      dataIndex: "projectTitle",
      key: "projectTitle",
    } : {
      title: "Proposed by",
      dataIndex: "proposedByEmail",
      key: "proposedByEmail",
    },
    {
      title: "Proposed Time",
      dataIndex: "timeProposed",
      key: "timeProposed",
      render: (timeStamp) => {
        return <div>{formatDate(timeStamp)}</div>;
      },
    },
    {
      title: "Last Update",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      render: (timeStamp) => {
        return <div>{timeStamp ? formatDate(timeStamp) : "-"}</div>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: BugStatus, record) => {
        return (
          <Select
            defaultValue={status}
            style={{ width: 120 }}
            onChange={(newValue) => handleDropdownOptionSelected(newValue, record)}
            disabled={userStore.currentUser? userStore.currentUser.uid !== projectStore.currentViewProjects[0].authorId : true}
            options={[
              { value: BugStatus.Proposed, label: "Proposed" },
              { value: BugStatus.Active, label: "Active" },
              { value: BugStatus.Resolved, label: "Resolved" },
              { value: BugStatus.Cancelled, label: "Cancelled" },
            ]}
          />
        );
      },
    },
    Table.EXPAND_COLUMN,
  ];

  return (
    <div style={{ display: "flex", flex: 1 }}>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={(record) => record.id!}
        style={{ flex: 1 }}
        expandable={{
          columnTitle: "Steps to reproduce",
          expandedRowRender: (record) => (
            <ol style={{ margin: 0 }}>
              {record.stepsToReproduce.map((step) => (
                <li>{step}</li>
              ))}
            </ol>
          ),
        }}
        scroll={{ x: 1200 }}
        pagination={{
          pageSize: 10,
        }}
      />
    </div>
  );
});

export default BugsTable;
