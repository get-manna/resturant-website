import { Link } from "react-router-dom"
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiMapPin, FiPhone, FiMail } from "react-icons/fi"

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-dark-surface text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 font-display font-bold text-2xl text-white mb-4">
              <span>🍔</span> FoodHub
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Delicious food delivered to your door. Fresh ingredients, bold flavors, and lightning-fast service.
            </p>
            <div className="flex gap-3">
              {[FiInstagram, FiTwitter, FiFacebook, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="h-9 w-9 rounded-xl bg-white/5 hover:bg-primary-500 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[["Home", "/"], ["Menu", "/products"], ["About", "/about"], ["Services", "/services"]].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-primary-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Account</h4>
            <ul className="space-y-2.5 text-sm">
              {[["Login", "/login"], ["Register", "/register"], ["My Orders", "/dashboard/orders"], ["Dashboard", "/dashboard"]].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-primary-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FiMapPin size={15} className="mt-0.5 text-primary-400 flex-shrink-0" />
                <span>123 Food Street, NYC, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone size={15} className="text-primary-400 flex-shrink-0" />
                <span>+1 (800) FOODHUB</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail size={15} className="text-primary-400 flex-shrink-0" />
                <span>hello@foodhub.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>© {new Date().getFullYear()} FoodHub. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
