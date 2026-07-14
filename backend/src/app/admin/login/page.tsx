import { login } from './actions'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#fcfbf9]">
      <div className="w-full max-w-md p-8 bg-white border border-gray-200 shadow-sm rounded-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#3a081a] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Botanical Heritage
          </h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            Export Admin Portal
          </p>
        </div>

        {searchParams?.error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded text-center">
            {searchParams.error}
          </div>
        )}

        <form action={login} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#3a081a] transition-colors text-black"
              placeholder="admin@ampceylon.com"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#3a081a] transition-colors text-black"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="mt-4 w-full bg-[#3a081a] text-white py-2.5 rounded font-medium text-sm hover:bg-[#4a0b22] transition-colors"
          >
            Sign In to Portal
          </button>
        </form>
      </div>
    </div>
  )
}
