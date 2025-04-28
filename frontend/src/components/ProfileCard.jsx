import React, { useContext } from "react";
import { UserContext } from "../context/userContext";

function ProfileCard() {
  const { user } = useContext(UserContext);
  return <div>{user?.username}</div>;
}

export default ProfileCard;
