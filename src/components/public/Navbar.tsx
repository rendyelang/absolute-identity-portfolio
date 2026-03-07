import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold font-playfair text-gradient">
              RE.
            </Link>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="#about" className="text-sm font-medium hover:text-accent transition-colors">
              About
            </Link>
            <Link href="#experience" className="text-sm font-medium hover:text-accent transition-colors">
              Experience
            </Link>
            <Link href="#projects" className="text-sm font-medium hover:text-accent transition-colors">
              Projects
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:text-accent transition-colors">
              Contact
            </Link>
          </div>
          <div className="flex space-x-4 items-center">
            <Link href="/dashboard" className="text-xs font-semibold px-4 py-2 border border-border rounded hover:border-accent hover:text-accent transition-all">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
