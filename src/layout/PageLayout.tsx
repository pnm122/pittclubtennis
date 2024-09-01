import Footer from "components/Footer/Footer";
import Header from "components/Header/Header";
import ClubTennisNotification from "components/ClubTennisNotification/ClubTennisNotification";
import { Link, Outlet } from "react-router-dom";
import { defaultLinks } from "utils/defaultLinks";

export default function PageLayout() {
  const homeLink = (
    <Link to='/' id='header-title'>Club Tennis at Pitt</Link>
  )

  return (
    <>
      <Header
        links={defaultLinks}
        leftSlot={homeLink}
      />
      <Outlet />
      <Footer />
      <ClubTennisNotification />
    </>
  )
}
