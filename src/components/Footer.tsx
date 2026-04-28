const Footer = () => {
  return (
    <footer className="border-t border-border py-8 sm:py-12 bg-background">
      <div className="container">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="col-span-2 sm:col-span-1 mb-2 sm:mb-0">
            <p className="font-heading font-bold text-lg mb-1.5 sm:mb-2">
              <span className="text-gradient-mint">Tribe</span>Mint 🌿
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Promote. Earn. Grow.
            </p>
          </div>
          <div>
            <p className="font-heading font-bold text-xs sm:text-sm mb-2 sm:mb-3 text-muted-foreground uppercase tracking-wider">Platform</p>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li><a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#earn" className="hover:text-primary transition-colors">Earn</a></li>
              <li><a href="#tiers" className="hover:text-primary transition-colors">Tiers</a></li>
            </ul>
          </div>
          <div>
            <p className="font-heading font-bold text-xs sm:text-sm mb-2 sm:mb-3 text-muted-foreground uppercase tracking-wider">Connect</p>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Twitter / X</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">TikTok</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-border text-center text-[11px] sm:text-xs text-muted-foreground">
          © 2026 TribeMint — a property of <span className="font-semibold text-foreground/80">Ibloov</span>. All rights reserved.
          <span className="block mt-1 opacity-70">Commission-based platform · Payouts via Stripe Connect</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
