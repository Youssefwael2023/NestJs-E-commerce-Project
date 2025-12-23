import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("authToken");
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  }, [navigate]);

  return <div>Logging out...</div>;
}

export default Logout;
