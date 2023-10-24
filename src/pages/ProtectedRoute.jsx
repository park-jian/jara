import React from "react";
import { useAuthContext } from "../components/context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireAdmin }) {
  //로그인 사용자가 있는지 확인, 그 사용자가 어드민 권한이 있는지 확인, requireAdmin이 true인 경우에는 로그인도 되어 있어야 하고, 어드민 권한도 가지고 있어야 함
  //조건에 맞지 않으면 상위 경로로 이동, 조건에 맞는 경우에만 전달된 children을 보여줌
  const { user } = useAuthContext();

  //로그인 하지 않았거나, requireAdmin이 true인데도 불구하고 사용자 계정이 어드민이 아니면
  if (!user || (requireAdmin && !user.isAdmin)) {
    //replace : 해당경로는 잘못 들어온 경로이므로 history에 넣지 않는다.
    return <Navigate to="/" replace />;
  }
  return children;
}
