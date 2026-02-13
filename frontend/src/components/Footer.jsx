import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-primary text-secondary px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Logo & Tagline */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-secondary">
            Moss <span className="text-darkGreen">X</span>
          </h2>
          <p className="text-sm text-neutral">Making your life greener, one plant at a time.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-secondary mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm text-neutral">
            <li>
              <Link to="/" className="hover:text-darkGreen transition duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/search" className="hover:text-darkGreen transition duration-300">
                Explore
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-darkGreen transition duration-300">
                Cart
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-secondary mb-2">Resources</h3>
          <ul className="space-y-1 text-sm text-neutral">
            <li>
              <a href="#" className="hover:text-darkGreen transition duration-300">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-darkGreen transition duration-300">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-lg font-semibold text-secondary mb-2">Connect</h3>
          <div className="flex gap-4 text-neutral">
            <a href="#" className="hover:text-darkGreen transition duration-300">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-darkGreen transition duration-300">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-darkGreen transition duration-300">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-darkGreen transition duration-300">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral mt-12 pt-6 text-center text-sm text-neutral">
        © {new Date().getFullYear()} Moss X. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
