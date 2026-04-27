import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ibloovLogo from "@/assets/ibloov-logo.jpeg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Campaigns", href: "/#campaigns" },
    { label: "For Businesses", href: "/#for-businesses" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="container flex items-center justify-between h-14 sm:h-16">
        <a href="/" className="flex items-center gap-2 font-heading text-lg sm:text-xl font-extrabold tracking-tight">
          <span className="flex items-baseline gap-1">
            <span className="text-foreground">Tribe</span>
            <span className="text-lime">Mint</span>
            <span className="text-base sm:text-lg">🌿</span>
          </span>
          <span className="hidden sm:flex items-center gap-1.5 pl-2 ml-1 border-l border-border">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">by</span>
            <img src={ibloovLogo} alt="iBloov" className="h-4 w-auto object-contain" />
          </span>
        </a>

        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-muted-foreground">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-foreground transition-colors">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          <button
            onClick={() => navigate("/business-dashboard")}
            className="px-4 lg:px-5 py-2 lg:py-2.5 text-xs lg:text-sm font-bold border-2 border-foreground/20 text-foreground rounded-full hover:border-foreground/40 transition-colors"
          >
            For Businesses
          </button>
          <button
            onClick={() => navigate("/onboarding")}
            className="px-4 lg:px-5 py-2 lg:py-2.5 text-xs lg:text-sm font-bold bg-military text-lime rounded-full hover:opacity-90 transition-opacity"
          >
            Start Earning →
          </button>
        </div>

        <button className="md:hidden p-2 -mr-2 text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={22} /> : <Menu size={22} />}
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
            <div className="container py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors font-medium py-1.5 text-sm">
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <button
                  onClick={() => { navigate("/business-dashboard"); setIsOpen(false); }}
                  className="py-3 text-sm font-bold border-2 border-foreground/20 text-foreground rounded-full hover:border-foreground/40 transition-colors"
                >
                  For Businesses
                </button>
                <button
                  onClick={() => { navigate("/onboarding"); setIsOpen(false); }}
                  className="py-3 text-sm font-bold bg-military text-lime rounded-full w-full"
                >
                  Start Earning →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
