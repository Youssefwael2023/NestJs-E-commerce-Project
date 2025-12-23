import MainFooter from "../Component/AdminFooter";
import MainNav from "../Component/AdminNav";
import { Outlet } from "react-router-dom";
import withAdminAuth from "../utils/withAdminAuth";

function MainLay() {
  return (
    // link : #bb86fc
    //h1 :#ffffff
    //btn :#03dac5
    <div
      style={{
        backgroundColor: "#121212",
        color: "#b0b0b0",
        minHeight: "100vh",
      }}
    >
      {/* <body style={{ backgroundColor: "#121212" }}></body> */}
      <MainNav />
      <Outlet />
      <MainFooter />
    </div>
  );
}

export default withAdminAuth(MainLay);
