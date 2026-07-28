import { Input } from "@workspace/ui/components/input"

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 py-20 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white">
              <div className="bg-primary-600 flex h-8 w-8 items-center justify-center rounded-lg text-xl font-bold">
                N
              </div>
              <span className="text-xl font-bold tracking-tight">
                NexusMarket
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              The world&apos;s most sophisticated multi-tenant ecosystem for
              high-end e-commerce and artisanal craftsmanship.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="hover:bg-primary-600 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white transition-colors"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a
                href="#"
                className="hover:bg-primary-600 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white transition-colors"
              >
                <i className="fa-brands fa-twitter"></i>
              </a>
              <a
                href="#"
                className="hover:bg-primary-600 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white transition-colors"
              >
                <i className="fa-brands fa-facebook"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-white">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-primary-400 transition-colors"
                >
                  Shop All Products
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-400 transition-colors"
                >
                  Become a Vendor
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-400 transition-colors"
                >
                  Shipping Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-white">Support</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-primary-400 transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-400 transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-400 transition-colors"
                >
                  Order Tracking
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-400 transition-colors"
                >
                  Return Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-white">Stay Updated</h4>
            <p className="mb-4 text-sm">
              Join our newsletter for exclusive drops.
            </p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Email address"
                className="focus:border-primary-500 flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm transition-colors focus:outline-none"
              />
              <button className="bg-primary-600 hover:bg-primary-700 rounded-lg px-4 py-2 text-sm font-bold text-white transition-colors">
                Join
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
          &copy; 2026 NexusMarket Inc. All rights reserved. Built for elegance
          and scale.
        </div>
      </div>
    </footer>
  )
}
