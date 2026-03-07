import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ibloovLogo from "@/assets/ibloov-logo.jpeg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="container flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-2">
          <img src={ibloovLogo} alt="iBloov" className="h-10 rounded-lg" />
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="/#how-it-works" className="hover:text-primary transition-colors font-heading font-bold">How It Works</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate("/search")}
            className="px-5 py-2.5 text-sm font-bold font-heading bg-gradient-mint text-primary-foreground rounded-xl shadow-mint hover:opacity-90 transition-opacity"
          >
            Explore 🎉
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
              <a href="/#how-it-works" className="text-muted-foreground hover:text-primary transition-colors font-heading font-bold">How It Works</a>
              <button
                onClick={() => { navigate("/search"); setIsOpen(false); }}
                className="px-4 py-2 text-sm font-bold font-heading bg-gradient-mint text-primary-foreground rounded-xl w-full"
              >
                Explore 🎉
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
