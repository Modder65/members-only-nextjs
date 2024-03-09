import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-[100vh]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;