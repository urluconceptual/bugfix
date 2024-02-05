import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { MANAGE_PROFILE_LINK, PROFILE_LINK } from "../models/constants";
import { userStore } from "../stores/userStore";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Spin } from "antd";

const PrivateRoute = observer(() => {
  const params = useParams();
  const location = useLocation();
  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [navigateToRoute, setNavigateToRoute] = useState<string>("");

  useEffect(() => {
    const checkAccess = async () => {
      if (location.pathname.includes(`${PROFILE_LINK}`)) {
        const res = await userStore.fetchById(params.userId!);
        if (res && res.accountIsPrivate) {
          setIsAllowed(userStore.currentUser !== null && res.id === userStore.currentUser!.uid);
          setNavigateToRoute("/private-profile");
        } else setIsAllowed(true);
      }
      if (location.pathname.includes(`${MANAGE_PROFILE_LINK}`)) {
        setIsAllowed(userStore.currentUser !== null);
        setNavigateToRoute("/route-not-available");
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
    <Navigate to={navigateToRoute} replace />
  );
});

export default PrivateRoute;
