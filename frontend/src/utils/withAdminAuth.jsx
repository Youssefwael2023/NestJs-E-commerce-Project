import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function withAdminAuth(Component) {
  return function WrappedComponent(props) {
    const navigate = useNavigate();

    useEffect(() => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.role !== "admin") {
          navigate("/unauth");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/unauth");
      }
    }, [navigate]);

    return <Component {...props} />;
  };
}

export default withAdminAuth;
