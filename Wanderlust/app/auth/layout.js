// app/(auth)/layout.js
export const metadata = {
  title: "Login | Wanderlust",
  description: "Access your Wanderlust account",
};

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {children}
    </div>
  );
}
