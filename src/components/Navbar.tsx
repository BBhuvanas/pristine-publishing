import { Shield } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-foreground/95 backdrop-blur-md border-b border-primary-foreground/10">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Shield className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="font-bold text-lg text-primary-foreground">SynapX Claims</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-primary-foreground/60">
          <a href="#processor" className="hover:text-primary-foreground transition-colors">Process</a>
          <a href="#features" className="hover:text-primary-foreground transition-colors">Features</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
