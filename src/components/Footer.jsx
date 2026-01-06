import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Shield, 
  Truck, 
  Headphones,
  Heart
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: 'New Arrivals', href: '' },
      { name: 'Best Sellers', href: '/best-sellers' },
      { name: 'Sale', href: '/sale' },
      { name: 'Collections', href: '/collections' },
      { name: 'Gift Cards', href: '/gift-cards' }
    ],
    customer: [
      { name: 'My Account', href: '/account' },
      { name: 'Order Tracking', href: '/tracking' },
      { name: 'Wishlist', href: '/wishlist' },
      { name: 'Help Center', href: '/help' },
      { name: 'Returns', href: '/returns' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Blog', href: '/blog' },
      { name: 'Press', href: '/press' },
      { name: 'Contact', href: '/contact' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Shipping Policy', href: '/shipping' }
    ]
  };

  const features = [
    { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50', color: 'hover:bg-green-500' },
    { icon: Shield, title: 'Secure Payment', desc: '100% protected', color: 'hover:bg-blue-500' },
    { icon: Headphones, title: '24/7 Support', desc: 'Dedicated support', color: 'hover:bg-purple-500' },
    { icon: CreditCard, title: 'Easy Returns', desc: '30-day guarantee', color: 'hover:bg-orange-500' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', hoverColor: 'hover:bg-[#1877F2]' },
    { icon: Twitter, href: '#', label: 'Twitter', hoverColor: 'hover:bg-[#1DA1F2]' },
    { icon: Instagram, href: '#', label: 'Instagram', hoverColor: 'hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#515BD4]' },
    { icon: Youtube, href: '#', label: 'Youtube', hoverColor: 'hover:bg-[#FF0000]' }
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 mt-72 md:mt-[10vh] transition-colors duration-300">
      {/* Features Section */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-all duration-300 group border border-gray-200 dark:border-gray-700"
              >
                <div className={`p-3 bg-gray-200 dark:bg-gray-700 rounded-xl group-hover:scale-110 transition-all duration-300 ${feature.color}`}>
                  <feature.icon className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{feature.title}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                FitVibe
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-3 leading-relaxed">
                Your trusted destination for quality products and exceptional service. Shop with confidence.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-red-500 transition-colors">
                  <Mail className="w-4 h-4 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm">support@store.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors group">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-green-500 transition-colors">
                  <Phone className="w-4 h-4 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-purple-500 transition-colors">
                  <MapPin className="w-4 h-4 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm">123 Commerce St, ALG 1100</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Customer Service</h4>
            <ul className="space-y-2">
              {footerLinks.customer.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Copyright */}
            <div className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2">
              <span>© {currentYear} YourStore. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span>All rights reserved.</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className={`p-2.5 bg-gray-200 dark:bg-gray-700 rounded-xl ${social.hoverColor} transition-all duration-300 hover:scale-110 group`}
                >
                  <social.icon className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400 text-xs mr-2">We accept:</span>
              <div className="flex gap-2">
                <div className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-white hover:bg-[#003087] transition-all">
                  PayPal
                </div>
                <div className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 transition-all">
                  Dahabiya
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;