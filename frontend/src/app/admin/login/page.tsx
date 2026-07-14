'use client';

import { useState, use } from 'react';
import { login } from './actions';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle client-side error query by unwrapping Promise
  const resolvedSearchParams = use(searchParams);
  const errorMsg = resolvedSearchParams?.error;

  return (
    <div className="min-h-screen w-full flex bg-[#fcfbf9] overflow-hidden">
      
      {/* Left Column: Image Background & Overlay (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 text-white select-none">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1200&auto=format&fit=crop" 
            alt="Peony Arrangement" 
            className="w-full h-full object-cover"
          />
          {/* Rich Dark Maroon Tint Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#250410]/95 via-[#3a081a]/80 to-[#3a081a]/70 mix-blend-multiply z-10" />
        </div>

        {/* Top Section */}
        <div className="relative z-20 flex flex-col gap-1">
          <span className="text-sm font-bold tracking-widest text-[#f5ebd3] uppercase" style={{ fontFamily: 'var(--font-inter)' }}>
            AMPceylon admin
          </span>
          <span className="text-[10px] tracking-widest text-white/50 uppercase font-semibold">
            Established 1994
          </span>
        </div>

        {/* Middle Brand Statement */}
        <div className="relative z-20 max-w-md">
          <h1 className="text-4xl xl:text-5xl leading-tight text-white mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            The Standard of <br />Global Artistry.
          </h1>
          <p className="text-xs text-white/70 leading-relaxed max-w-sm">
            Managing precision exports for high-end artificial botanical arrangements across six continents.
          </p>
        </div>

        {/* Bottom indicator */}
        <div className="relative z-20 flex items-center gap-3">
          <span className="w-8 h-px bg-white/30" />
          <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold">
            Admin Portal
          </span>
        </div>
      </div>

      {/* Right Column: Login Card Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white min-h-screen relative">
        <div className="w-full max-w-md space-y-8 relative z-10">
          
          {/* Welcome Text */}
          <div>
            <h2 className="text-3xl font-bold text-[#3a081a] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
              Welcome Back
            </h2>
            <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
              Please enter your credentials to access the AMP pvt ltd management system.
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form action={login} className="space-y-5">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#3a081a] transition-colors text-black w-full bg-white"
                placeholder="name@amp-export.com"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Password
                </label>
                <a href="#" className="text-[10px] font-bold text-gray-400 hover:text-[#3a081a] transition-colors">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-4 py-2.5 pr-10 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#3a081a] transition-colors text-black w-full bg-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-0.5"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-3.5 h-3.5 border-gray-300 rounded text-[#3a081a] focus:ring-[#3a081a]"
              />
              <label htmlFor="remember" className="text-[10px] font-medium text-gray-400 cursor-pointer">
                Keep me logged in for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="mt-6 w-full bg-[#3a081a] hover:bg-[#4a0b22] text-white py-3 rounded text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              Secure Sign In →
            </button>
          </form>

          {/* Footer Rights */}
          <div className="pt-10 flex flex-col items-center justify-between text-[9px] text-gray-400 gap-2 border-t border-gray-100 relative">
            {/* Soft Watermark behind the footer */}
            <div className="absolute right-4 bottom-0 opacity-5 pointer-events-none select-none">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8M8 12h8"></path></svg>
            </div>
            
            <div className="w-full flex justify-between items-center">
              <span>© 2026 AMP pvt ltd. All rights reserved.</span>
              <div className="flex gap-3">
                <a href="#" className="hover:underline">Privacy Policy</a>
                <a href="#" className="hover:underline">Support</a>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
