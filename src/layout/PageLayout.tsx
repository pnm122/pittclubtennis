import Footer from "components/Footer/Footer";
import Header from "components/Header/Header";
import Notification from "components/Notification/Notification";
import { Outlet } from "react-router-dom";

export default function PageLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <Notification />
    </>
  )
}
