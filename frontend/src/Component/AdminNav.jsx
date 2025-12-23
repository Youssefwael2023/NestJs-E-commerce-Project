import { Children, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink } from "react-router-dom";
import "./navCss.css";

function MainNav() {
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      setAdminName(user.name);
    }
  }, []);
  const Links = [
    {
      name: "Dashboard",
      path: "/admin",
    },
    {
      name: "Add Product",
      path: "/admin/add-product",
    },
    {
      name: "All Products",
      path: "/admin/all-products",
    },
    {
      name: "Orders",
      path: "/admin/orders",
    },
    {
      name: "Users",
      path: "/admin/users",
    },
    {
      name: "Stock",
      children: [
        {
          name: "Low Stock",
          path: "/admin/lowstock",
        },
        {
          name: "Out of Stock",
          path: "/admin/outofstock",
        },
      ],
    },
    {
      name: "Category",
      path: "/admin/category",
    },

    {},
  ];
  return (
    <Navbar
      expand="lg"
      className="bg-body-primary mb-3"
      style={{
        backgroundColor: "#1f1f1f",
        color: "#b0b0b0",
        padding: "",
      }}
    >
      <Container>
        <Navbar.Brand className=" fw-bold" style={{ color: "#b0b0b0" }}>
          <NavDropdown
            title={adminName}
            id="admin-dropdown"
            style={{ color: "#b0b0b0", fontWeight: "bold" }}
          >
            <NavDropdown.Item as={NavLink} to="/admin/profile">
              Profile
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to="/logout">
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Navbar.Brand>
        <Navbar.Toggle
          style={{
            backgroundColor: "#ffffff",
            color: "white !important",
            padding: "10px",
          }}
          className="text-light fw-bold "
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse id="basic-navbar-nav ">
          <Nav className="mx-auto">
            {Links.map((link, i) =>
              link.children ? (
                <NavDropdown
                  // className="w-50"
                  key={i}
                  title={
                    <span
                      style={{
                        color: "#b0b0b0",
                        fontSize: "20px",

                        fontWeight: "bold",
                      }}
                    >
                      {link.name}
                    </span>
                  }
                  id={`dropdown-${i}`}
                  className="me-5 text-center"
                  style={{
                    color: "#b0b0b0",
                    fontSize: "20px",

                    fontWeight: "bold",
                  }}
                >
                  {link.children.map((child, idx) => (
                    <NavDropdown.Item
                      as={NavLink}
                      to={child.path}
                      key={idx}
                      style={{
                        textDecoration: "none",
                        color: "#b0b0b0",
                        backgroundColor: "#1f1f1f",
                        fontWeight: "bold",
                        // width: "50%",
                        height: "100%",
                        margin: "auto",
                      }}
                    >
                      {child.name}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              ) : (
                <NavLink
                  key={i}
                  className="nav-link me-5 text-center"
                  style={{
                    textDecoration: "none",
                    color: "#b0b0b0",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                  to={link.path}
                >
                  {link.name}
                </NavLink>
              )
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNav;
