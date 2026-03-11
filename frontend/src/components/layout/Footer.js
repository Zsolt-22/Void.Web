'use client';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 text-center text-sm">
          <p>&copy; {currentYear} Void Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
