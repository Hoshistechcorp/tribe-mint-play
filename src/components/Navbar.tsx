import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Earn", href: "/#earn" },
    { label: "Tiers", href: "/#tiers" },
    { label: "For Businesses", href: "/#for-businesses" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="container flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-1.5 font-heading text-xl font-extrabold tracking-tight">
          <span className="text-foreground">Tribe</span>
          <span className="text-lime">Mint</span>
          <span className="text-lg">🌿</span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-foreground transition-colors">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate("/business-dashboard")}
            className="px-5 py-2.5 text-sm font-bold border-2 border-foreground/20 text-foreground rounded-full hover:border-foreground/40 transition-colors"
          >
            For Businesses
          </button>
          <button
            onClick={() => navigate("/onboarding")}
            className="px-5 py-2.5 text-sm font-bold bg-military text-lime rounded-full hover:opacity-90 transition-opacity"
          >
            Start Earning →
          </button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border bg-background overflow-hidden"
          >
            <div className="container py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => { navigate("/business-dashboard"); setIsOpen(false); }}
                className="text-left text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                For Businesses
              </button>
              <button
                onClick={() => { navigate("/onboarding"); setIsOpen(false); }}
                className="px-5 py-3 text-sm font-bold bg-military text-lime rounded-full w-full"
              >
                Start Earning →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
