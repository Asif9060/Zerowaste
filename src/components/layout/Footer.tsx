import Link from "next/link";
import { Leaf, Facebook, Twitter, Instagram, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-stone-900 text-stone-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-white">
              <Leaf className="h-6 w-6 text-primary" />
              <span>ZeroWaste Farm</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-stone-400">
              Connecting farmers with buyers to eliminate food waste across South Africa and Zimbabwe.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" aria-label="Facebook" className="text-stone-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-stone-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className="text-stone-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold text-white">Platform</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                { href: "/marketplace", label: "Browse Marketplace" },
                { href: "/auth/register", label: "Register as Farmer" },
                { href: "/auth/register", label: "Register as Buyer" },
                { href: "/about", label: "How It Works" },
                { href: "/about#pricing", label: "Pricing & Commission" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white">Support</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                { href: "/about#faq", label: "FAQ" },
                { href: "/about#contact", label: "Contact Us" },
                { href: "/about#whatsapp", label: "WhatsApp Support" },
                { href: "/about#terms", label: "Terms of Service" },
                { href: "/about#privacy", label: "Privacy Policy" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white">Contact</h3>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span>Serving South Africa &amp; Zimbabwe</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a href="tel:+27001234567" className="hover:text-white transition-colors">
                  +27 00 123 4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a href="mailto:hello@zerowaste.farm" className="hover:text-white transition-colors">
                  hello@zerowaste.farm
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-stone-700 pt-6 text-xs text-stone-500 sm:flex-row">
          <p>© {new Date().getFullYear()} ZeroWaste Farm. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-primary inline-block" /> South Africa
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500 inline-block" /> Zimbabwe
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
