const Footer = () => {
  return (
    <footer className="border-t border-border py-10 sm:py-14 bg-background" itemScope itemType="https://schema.org/Organization">
      <div className="container">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1 space-y-3">
            <p className="font-heading font-bold text-lg" itemProp="name">
              <span className="text-gradient-mint">Tribe</span>Mint 🌿
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Hospitality affiliate marketing platform by{" "}
              <span className="font-semibold text-foreground/80" itemProp="parentOrganization">Ibloov</span>.
              Commission-based — no subscriptions.
            </p>
            <p className="text-xs text-muted-foreground" itemProp="email">hello@tribemint.com</p>
          </div>

          {/* Platform */}
          <div>
            <p className="font-heading font-bold text-xs mb-3 text-muted-foreground uppercase tracking-wider">Platform</p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><a href="/#what-it-is" className="hover:text-foreground transition-colors">What It Is</a></li>
              <li><a href="/#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
              <li><a href="/#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="/#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="/#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="font-heading font-bold text-xs mb-3 text-muted-foreground uppercase tracking-wider">Resources</p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><a href="/#use-cases" className="hover:text-foreground transition-colors">Use Cases</a></li>
              <li><a href="/#integrations" className="hover:text-foreground transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">API Docs</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <p className="font-heading font-bold text-xs mb-3 text-muted-foreground uppercase tracking-wider">Connect</p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Twitter / X</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">TikTok</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <p>© 2026 TribeMint — a property of Ibloov. All rights reserved.</p>
          <p>Commission-based platform · Payouts via Stripe Connect</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
