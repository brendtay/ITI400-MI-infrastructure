export default function Footer() {
  return (
    <footer className="bg-dark text-white py-0 position-relative">
      <div className="container">
        <div className="row">
          {/* Spacer Column */}
          <div className="col-lg-8 col-md-6 mb-1">
          </div>

          {/* Column 2 - Contact Info */}
          <div className="col-lg-4 col-md-6 mb-0 ms-lg-auto text-lg-end text-center">
            <p className="footer-heading mb-1">Contact Info</p>
            <ul className="list-unstyled footer-list mb-0">
              <li className="mb-0"><i className="bi bi-envelope"></i> infrastructuremi@gmail.com</li>
              <li className="mb-0"><i className="bi bi-phone"></i> (810) 867-5309</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
