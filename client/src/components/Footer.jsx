export const Footer = () => {
  return (
    <footer className='bg-primary text-white py-8 mt-16'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid md:grid-cols-3 gap-8 mb-8'>
          <div>
            <h3 className='text-lg font-bold text-secondary mb-4'>
              Rent-A-Drive
            </h3>
            <p className='text-gray-300'>
              Your trusted partner for affordable and reliable car rentals.
            </p>
          </div>
          <div>
            <h4 className='text-lg font-semibold mb-4'>Quick Links</h4>
            <ul className='space-y-2 text-gray-300'>
              <li>
                <a
                  href='/cars'
                  className='hover:text-secondary transition'>
                  Browse Cars
                </a>
              </li>
              <li>
                <a
                  href='/about'
                  className='hover:text-secondary transition'>
                  About Us
                </a>
              </li>
              <li>
                <a
                  href='/contact'
                  className='hover:text-secondary transition'>
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='text-lg font-semibold mb-4'>Contact</h4>
            <p className='text-gray-300'>Email: info@rentadrive.com</p>
            <p className='text-gray-300'>Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        <div className='border-t border-gray-700 pt-8 text-center text-gray-400'>
          <p>&copy; 2026 Rent-A-Drive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
