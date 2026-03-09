import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img
                src="/devils-marketplace-logo.png"
                alt="Devil's Marketplace logo"
                className="h-9 w-9"
              />
              <span className="font-bold text-xl">Devil's Marketplace</span>
            </Link>
            <p className="text-secondary-foreground/60 text-sm">
              Your campus marketplace for buying and selling. 
              Built by students, for students.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/60">
              <li><Link to="/marketplace" className="hover:text-secondary-foreground transition-colors">Marketplace</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/60">
              <li><Link to="/about" className="hover:text-secondary-foreground transition-colors">About Us</Link></li>
              <li><Link to="/faq" className="hover:text-secondary-foreground transition-colors">FAQ</Link></li>
              <li><a href="mailto:info@devilsmarketplace.com" className="hover:text-secondary-foreground transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/60">
              <li><Link to="/privacy" className="hover:text-secondary-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-secondary-foreground transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-secondary-foreground/20" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary-foreground/60 text-sm">
            © {new Date().getFullYear()} Devil's Marketplace. All rights reserved.
          </p>
          <p className="text-secondary-foreground/60 text-sm">
            Made with ❤️ for students
          </p>
        </div>

        <p className="text-secondary-foreground/40 text-xs text-center mt-6">
          Devil's Marketplace is an independent student marketplace and is not affiliated with or endorsed by Duke University.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
