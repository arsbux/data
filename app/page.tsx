'use client';
import Link from "next/link";
import { ArrowRight, Check, Zap, Globe, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Fast Data" className="w-8 h-8 rounded-lg" />
            <span className="font-bold text-xl tracking-tight">Fast Data</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            v1.0 is now live
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Web analytics that <br /> doesn't slow you down.
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Fast Data provides privacy-friendly, real-time analytics for your website.
            No cookies, no bloat, just the insights you need to grow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              Start Tracking Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#pricing"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-semibold transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white/5 border-y border-white/5">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-yellow-400" />}
              title="Lightweight Script"
              description="Our tracking script is less than 2kb. It loads asynchronously and never blocks your page rendering."
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6 text-blue-400" />}
              title="Privacy First"
              description="We don't use cookies and we don't track personal data. Fully GDPR, CCPA and PECR compliant."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-green-400" />}
              title="Real-time Data"
              description="See who is on your site right now. Watch visitors navigate through your pages in real-time."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Simple, transparent pricing</h2>
          <p className="text-gray-400 mb-16 text-lg">Choose the plan that fits your needs. No hidden fees.</p>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Monthly Plan */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all relative group">
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-2">Monthly</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">$9</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <ul className="space-y-4 mb-8 text-gray-300">
                  <PricingFeature text="Unlimited websites" />
                  <PricingFeature text="100k pageviews/mo" />
                  <PricingFeature text="Real-time analytics" />
                  <PricingFeature text="Data retention: 1 year" />
                  <PricingFeature text="Email support" />
                </ul>
                <Link
                  href="/signup?plan=monthly"
                  className="block w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all"
                >
                  Subscribe Monthly
                </Link>
              </div>
            </div>

            {/* Lifetime Plan */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-blue-600/20 to-blue-900/10 border border-blue-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-xs font-bold px-3 py-1 rounded-bl-xl">
                BEST VALUE
              </div>
              <div className="text-left relative z-10">
                <h3 className="text-xl font-semibold mb-2 text-blue-400">Lifetime Deal</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">$39</span>
                  <span className="text-gray-400">/one-time</span>
                </div>
                <ul className="space-y-4 mb-8 text-gray-300">
                  <PricingFeature text="Unlimited websites" />
                  <PricingFeature text="Unlimited pageviews" />
                  <PricingFeature text="Real-time analytics" />
                  <PricingFeature text="Lifetime data retention" />
                  <PricingFeature text="Priority support" />
                  <PricingFeature text="Future updates included" />
                </ul>
                <Link
                  href="/signup?plan=lifetime"
                  className="block w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-500/25"
                >
                  Get Lifetime Access
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-gray-500 text-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-8">
            <img src="/logo.png" alt="Fast Data" className="w-6 h-6 rounded grayscale opacity-50" />
            <span className="font-semibold">Fast Data</span>
          </div>
          <div className="flex justify-center gap-8 mb-8">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <a href="mailto:support@fastdata.com" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p>&copy; {new Date().getFullYear()} Fast Data. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
    </div>
  );
}

function PricingFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
        <Check className="w-3 h-3 text-blue-400" />
      </div>
      <span>{text}</span>
    </li>
  );
}
