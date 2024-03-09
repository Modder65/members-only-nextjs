import { Footer } from "@/components/Footer";
import { Navbar } from "./_components/navbar";
import { Header } from "@/components/Header";

const SettingsLayout = ({children}) => {
  return ( 
    <>
      <Header />
      <div className="max-w-3xl mx-auto px-5 h-full flex flex-col items-center gap-y-8 pt-[2rem]">
        <Navbar />
        {children}
      </div>
      <Footer />
    </>
   );
}
 
export default SettingsLayout;