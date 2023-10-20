import { AuthProvider } from "./auth-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
