import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const Header = ({ cartCount = 0, onCartClick, onMobileMenuToggle }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Products", href: "/" },
    { name: "Design Gallery", href: "/gallery" },
    { name: "Custom Studio", href: "/studio" },
    { name: "Orders", href: "/orders" }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    onMobileMenuToggle && onMobileMenuToggle(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-200">
              <ApperIcon name="Shirt" className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">CustomTee</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/50",
                  location.pathname === item.href
                    ? "text-primary bg-white/30"
                    : "text-gray-700 hover:text-primary"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative p-2 rounded-lg hover:bg-white/50 transition-all duration-200 group"
            >
              <ApperIcon name="ShoppingCart" className="w-6 h-6 text-gray-700 group-hover:text-primary" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center text-xs animate-scale-up">
                  {cartCount > 99 ? "99+" : cartCount}
                </Badge>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-white/50 transition-all duration-200"
            >
              <ApperIcon 
                name={isMobileMenuOpen ? "X" : "Menu"} 
                className="w-6 h-6 text-gray-700" 
              />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden transition-all duration-300 overflow-hidden border-t border-white/20",
          isMobileMenuOpen ? "max-h-64 opacity-100 pb-4" : "max-h-0 opacity-0"
        )}>
          <nav className="pt-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  location.pathname === item.href
                    ? "text-primary bg-white/30"
                    : "text-gray-700 hover:text-primary hover:bg-white/20"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;