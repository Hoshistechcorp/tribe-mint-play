import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="container flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-2 font-heading text-xl font-bold">
          <span className="text-gradient-mint">Tribe</span>
          <span className="text-foreground">Mint</span>
          <span className="text-lg">🌿</span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="/#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
          <a href="/#features" className="hover:text-primary transition-colors">Features</a>
          <button onClick={() => navigate("/campaigns")} className="hover:text-primary transition-colors">Campaigns</button>
          <button onClick={() => navigate("/dashboard")} className="hover:text-primary transition-colors">Dashboard</button>
          <button onClick={() => navigate("/business-dashboard")} className="hover:text-primary transition-colors">For Business</button>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 text-sm font-bold bg-gradient-mint text-primary-foreground rounded-lg shadow-mint hover:opacity-90 transition-opacity"
          >
            Start Earning 🚀
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
              <a href="/#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How It Works</a>
              <a href="/#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
              <button onClick={() => { navigate("/campaigns"); setIsOpen(false); }} className="text-left text-muted-foreground hover:text-primary transition-colors">Campaigns</button>
              <button onClick={() => { navigate("/dashboard"); setIsOpen(false); }} className="text-left text-muted-foreground hover:text-primary transition-colors">Dashboard</button>
              <button onClick={() => { navigate("/business-dashboard"); setIsOpen(false); }} className="text-left text-muted-foreground hover:text-primary transition-colors">For Business</button>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <span className="text-sm text-muted-foreground">Toggle theme</span>
              </div>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 text-sm font-bold bg-gradient-mint text-primary-foreground rounded-lg w-full"
              >
                Start Earning 🚀
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
