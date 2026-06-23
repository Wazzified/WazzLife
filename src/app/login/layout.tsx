// src/app/login/layout.tsx
export const metadata = {
  title: "Login - WazzLife",
  description: "Masuk ke WazzLife",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {children}
    </div>
  );
}