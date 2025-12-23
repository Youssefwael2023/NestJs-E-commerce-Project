import {
  BrowserRouter as Router,
  Routes,
  Route,
  useRoutes,
} from "react-router-dom";
import "./index.css";
import Register from "./Pages/form/Register";
import Login from "./Pages/form/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminLay from "./Layouts/AdminLay";
import Dashboard from "./Pages/Admin/Dashboard";
import AddProduct from "./Pages/Admin/AddProduct";
import AllProducts from "./Pages/Admin/AllProduct";
import Users from "./Pages/Admin/Users";
import Orders from "./Pages/Admin/Orders";
import LowStock from "./Pages/Admin/LowStock";
import Logout from "./Pages/Admin/Logout";
import UnAuth from "./Pages/UnAuth";
import OutOfStock from "./Pages/Admin/OutOfStock";
import Error404 from "./Pages/Error404";
import Category from "./Pages/Admin/Category";
import HomePage from "./Pages/HomePage";
import UserLay from "./Layouts/UserLay";
import Shop from "./Pages/User/Shop";
import Cart from "./Pages/User/Cart";
import Profile from "./Pages/Admin/Profile";
import UserOrders from "./Pages/User/UserOrders";
import Shipping from "./Pages/User/Shipping";
import Summary from "./Pages/User/Summary";
import OrderConfirmation from "./Pages/User/OrderConfirmation";
import ProductDetail from "./Pages/User/ProductDetail";
import UserProfile from "./Pages/User/Profile";

function App() {
  const Link = useRoutes([
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },
    {
      path: "/logout",
      element: <Logout />,
    },
    {
      path: "/*",
      element: <Error404 />,
    },
    {
      path: "/profile",
      element: <UserProfile />,
    },

    {
      element: <AdminLay />,
      children: [
        {
          path: "/admin",
          element: <Dashboard />,
        },
        {
          path: "/admin/add-product",
          element: <AddProduct />,
        },
        {
          path: "/admin/All-products",
          element: <AllProducts />,
        },
        {
          path: "/admin/users",
          element: <Users />,
        },
        {
          path: "/admin/orders",
          element: <Orders />,
        },
        {
          path: "/admin/lowstock",
          element: <LowStock />,
        },

        {
          path: "/admin/lowstock",
          element: <LowStock />,
        },
        {
          path: "/admin/outofstock",
          element: <OutOfStock />,
        },
        {
          path: "/admin/category",
          element: <Category />,
        },
        {
          path: "/admin/profile",
          element: <Profile />,
        },
      ],
    },

    {
      element: <UserLay />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/shop",
          element: <Shop />,
        },
        {
          path: "/cart",
          element: <Cart />,
        },

        {
          path: "/orders",
          element: <UserOrders />,
        },
        {
          path: "/shipping",
          element: <Shipping />,
        },
        {
          path: "/summary",
          element: <Summary />,
        },
        {
          path: "/order/:id",
          element: <OrderConfirmation />,
        },
        {
          path: "/product/:id",
          element: <ProductDetail />,
        },
      ],
    },
    { path: "/unauth", element: <UnAuth /> },
  ]);
  return <>{Link}</>;
}

export default App;
