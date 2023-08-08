import NavLinks from "components/NavLinks/NavLinks";

export default function Footer() {
  return (
    <footer>
      <div className='container split'>
        <h3>Page Title</h3>
        <div>
          <h6>Links</h6>
          <NavLinks />
        </div>
      </div>
    </footer>
  )
}
