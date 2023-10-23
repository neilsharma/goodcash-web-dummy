import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Main } from "@/components/layout/Main";
import { AuthProvider } from "./auth-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </AuthProvider>
  );
}
