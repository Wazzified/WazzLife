// src/app/login/page.tsx
import { signIn } from "@/lib/auth"

export default function LoginPage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="flex flex-col gap-6 p-8 bg-gray-800 rounded-xl w-full max-w-md shadow-2xl border border-gray-700">
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-500">WazzLife</h1>
          <p className="text-gray-400 mt-2">Masuk untuk melanjutkan</p>
        </div>

        {/* Form Login Biasa */}
        <form
          action={async (formData) => {
            "use server"
            await signIn("credentials", {
              username: formData.get("username"),
              password: formData.get("password"),
              redirectTo: "/dashboard",
            })
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Username</label>
            <input 
              name="username" 
              placeholder="Masukkan username" 
              className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none" 
              required 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Password</label>
            <input 
              name="password" 
              type="password" 
              placeholder="Masukkan password" 
              className="p-3 rounded-lg bg-gray-700 text-white border class-gray-600 focus:border-blue-500 focus:outline-none" 
              required 
            />
          </div>
          <button type="submit" className="p-3 bg-blue-600 rounded-lg hover:bg-blue-700 font-bold transition-colors">
            Masuk
          </button>
        </form>

        {/* Pembatas */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">atau</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        {/* Tombol Login Demo */}
        <form
          action={async () => {
            "use server"
            await signIn("credentials", {
              username: "demo",
              password: "demo123",
              redirectTo: "/dashboard",
            })
          }}
        >
          <button type="submit" className="w-full p-3 bg-green-600 rounded-lg hover:bg-green-700 font-bold transition-colors flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Coba Mode Demo (Tanpa Password)
          </button>
        </form>

        {/* Info Kredensial */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-400 text-center font-mono">
            <span className="text-blue-400">Admin:</span> admin / admin123 <br/>
            <span className="text-green-400">Demo:</span> demo / demo123
          </p>
        </div>
      </div>
    </div>
  )
}