import React from 'react'

function Footer() {
  return (
    <footer className="bg-primary text-secondary px-6 py-12">
  <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    
    {/* Logo & Tagline */}
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-secondary">YourBrand</h2>
      <p className="text-sm text-neutral">Making life simpler, smarter, and more beautiful.</p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="text-lg font-semibold text-secondary mb-2">Quick Links</h3>
      <ul className="space-y-1 text-sm text-neutral">
        <li><a href="#" className="hover:text-darkGray">Home</a></li>
        <li><a href="#" className="hover:text-darkGray">About</a></li>
        <li><a href="#" className="hover:text-darkGray">Services</a></li>
        <li><a href="#" className="hover:text-darkGray">Contact</a></li>
      </ul>
    </div>

    {/* Resources */}
    <div>
      <h3 className="text-lg font-semibold text-secondary mb-2">Resources</h3>
      <ul className="space-y-1 text-sm text-neutral">
        <li><a href="#" className="hover:text-darkGray">Blog</a></li>
        <li><a href="#" className="hover:text-darkGray">Help Center</a></li>
        <li><a href="#" className="hover:text-darkGray">Privacy Policy</a></li>
        <li><a href="#" className="hover:text-darkGray">Terms & Conditions</a></li>
      </ul>
    </div>

    {/* Socials */}
    <div>
      <h3 className="text-lg font-semibold text-secondary mb-2">Connect</h3>
      <div className="flex gap-4 text-xl text-neutral">
        <a href="#" className="hover:text-darkGreen"><i className="fab fa-facebook-f"></i></a>
        <a href="#" className="hover:text-darkGreen"><i className="fab fa-twitter"></i></a>
        <a href="#" className="hover:text-darkGreen"><i className="fab fa-instagram"></i></a>
        <a href="#" className="hover:text-darkGreen"><i className="fab fa-linkedin-in"></i></a>
      </div>
    </div>
  </div>

  {/* Bottom Bar */}
  <div className="border-t border-neutral mt-12 pt-6 text-center text-sm text-neutral">
    © {new Date().getFullYear()} YourBrand. All rights reserved.
  </div>
</footer>

  )
}

export default Footer