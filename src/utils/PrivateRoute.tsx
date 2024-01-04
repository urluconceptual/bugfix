import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { PROFILE_LINK } from "../models/constants";
import { userStore } from "../stores/userStore";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Spin } from "antd";

const PrivateRoute = observer(() => {
  const params = useParams();
  const location = useLocation();
  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (location.pathname.includes(`${PROFILE_LINK}`)) {
        const res = await userStore.fetchById(params.userId!);
        if (res && res.accountIsPrivate) {
          if (res.id !== userStore.currentUser!.uid) setIsAllowed(false);
          else setIsAllowed(true);
        } else setIsAllowed(true);
      } else {
        setIsAllowed(true);
      }
      setLoading(false);
    };

    checkAccess();
  }, [userStore.currentUser, location]);

  return loading ? (
    <Spin />
  ) : isAllowed ? (
    <Outlet />
  ) : (
    <Navigate to="/private-profile" replace />
  );
});

export default PrivateRoute;
