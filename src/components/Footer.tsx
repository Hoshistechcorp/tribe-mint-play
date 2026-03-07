import ibloovLogo from "@/assets/ibloov-logo.jpeg";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 bg-background">
      <div className="container">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src={ibloovLogo} alt="iBloov" className="h-8 rounded-lg" />
            </div>
            <p className="text-sm text-muted-foreground font-heading">
              Discover. Share. Earn. 🎉
            </p>
          </div>
          <div>
            <p className="font-heading font-bold text-sm mb-3 text-muted-foreground uppercase tracking-wider">Platform</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
            </ul>
          </div>
          <div>
            <p className="font-heading font-bold text-sm mb-3 text-muted-foreground uppercase tracking-wider">Connect</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Twitter / X</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">TikTok</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground font-heading">
          © 2026 iBloov. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
