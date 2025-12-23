import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FaHome,
  FaShoppingCart,
  FaStore,
  FaSignInAlt,
  FaUserPlus,
  FaUser,
  FaShoppingBag,
} from "react-icons/fa";
import { Dropdown } from "react-bootstrap";
import "./navCss.css";

function UserNav() {
  const [UserName, SetUserName] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      SetUserName(user.name);
    }
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const Links = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Shop", path: "/shop", icon: <FaStore /> },
    { name: "Cart", path: "/cart", icon: <FaShoppingCart /> },
    { name: "Orders", path: "/orders", icon: <FaShoppingBag /> },
  ];

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div
        className="sidebar"
        style={{
          position: "fixed",
          top: 0,
          left: isSmallScreen && !isSidebarOpen ? "-300px" : "0",
          height: "100%",
          width: "250px",
          backgroundColor: "#1f1f1f",
          overflowX: "hidden",
          transition: "0.3s",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {isSmallScreen && isSidebarOpen && (
          <button
            className="close-btn"
            onClick={() => setIsSidebarOpen(false)}
            style={{
              position: "absolute",
              top: "10px",
              right: "15px",
              fontSize: "20px",
              background: "none",
              border: "none",
              color: "#b0b0b0",
              cursor: "pointer",
            }}
          >
            &times;
          </button>
        )}
        {/* Sidebar Content */}
        <div
          className="sidebar-content"
          style={{
            padding: "10px",
            position: "relative",
            top: "50px",
          }}
        >
          {Links.map((link, i) => (
            <NavLink
              key={i}
              to={link.path}
              style={{
                display: "block",
                color: "#b0b0b0",
                textDecoration: "none",
                marginBottom: "45px",
                fontSize: "20px",
              }}
              onClick={() => isSmallScreen && setIsSidebarOpen(false)}
            >
              {link.icon}
              <span className="ms-2">{link.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Auth Links at Bottom */}
        <div
          className="auth-links"
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "10px 20px",
            borderTop: "1px solid #b0b0b0",
          }}
        >
          {UserName ? (
            <Dropdown>
              <Dropdown.Toggle
                variant="secondary"
                id="dropdown-basic"
                style={{
                  backgroundColor: "#1f1f1f",
                  border: "none",
                  color: "#b0b0b0",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "18px",
                }}
              >
                <FaUser style={{ marginRight: "8px" }} />
                {UserName}
              </Dropdown.Toggle>

              <Dropdown.Menu
                style={{
                  backgroundColor: "#1f1f1f",
                  border: "1px solid #b0b0b0",
                }}
              >
                <Dropdown.Item
                  as={NavLink}
                  to="/profile"
                  style={{
                    color: "#b0b0b0",
                    textDecoration: "none",
                  }}
                  onClick={() => isSmallScreen && setIsSidebarOpen(false)}
                >
                  Profile
                </Dropdown.Item>
                <Dropdown.Item
                  as={NavLink}
                  to="/logout"
                  style={{
                    color: "#b0b0b0",
                    textDecoration: "none",
                  }}
                  onClick={() => isSmallScreen && setIsSidebarOpen(false)}
                >
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <>
              <NavLink
                to="/login"
                style={{
                  color: "#b0b0b0",
                  textDecoration: "none",
                  fontSize: "18px",
                }}
                onClick={() => isSmallScreen && setIsSidebarOpen(false)}
              >
                <FaSignInAlt style={{ color: "black" }} />
                <span className="ms-2">Login</span>
              </NavLink>
              <NavLink
                to="/register"
                style={{
                  color: "#b0b0b0",
                  textDecoration: "none",
                  fontSize: "18px",
                }}
                onClick={() => isSmallScreen && setIsSidebarOpen(false)}
              >
                <FaUserPlus style={{ color: "black" }} />
                <span className="ms-2">Register</span>
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}

      {isSmallScreen && !isSidebarOpen && (
        <button
          className="open-btn"
          onClick={() => setIsSidebarOpen(true)}
          style={{
            position: "fixed",
            top: "10px",
            left: "10px",
            fontSize: "30px",
            background: "none",
            border: "none",
            color: "#b0b0b0",
            cursor: "pointer",
            zIndex: 1100,
          }}
        >
          ☰
        </button>
      )}
    </div>
  );
}

export default UserNav;
