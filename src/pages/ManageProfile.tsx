import { Button } from "antd";
import { observer } from "mobx-react";

const ManageProfile = observer(() => {

  return (
    <>
    <Button>
        Change my email
    </Button>
    <Button>
        Change my password
    </Button>
    <Button>
        Delete my profile
    </Button>
    </>
  );
});

export default ManageProfile;
