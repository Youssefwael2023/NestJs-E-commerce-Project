import UserFooter from "../Component/UserFooter";
import UserNav from "../Component/UserNav";
import { Outlet } from "react-router-dom";
import ChatBot from "../Component/ChatBot";

function UserLay() {
  return (
    <div
      style={{
        backgroundColor: "#121212",
        color: "#b0b0b0",
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <UserNav />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          minHeight: "100vh",
          padding: "32px 0 80px 0", // top and bottom padding
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto",
            background: "none",
          }}
        >
          <Outlet />
        </div>
        <UserFooter />
      </div>
      <ChatBot />
    </div>
  );
}

export default UserLay;
