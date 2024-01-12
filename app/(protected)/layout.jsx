import { Navbar } from "./_components/navbar";

const ProtectedLayout = ({children}) => {
  return ( 
    <div className="h-full w-full flex flex-col gap-y-10 items-center 
     bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
    from-green-400 to-green-800 pt-[4rem]">
      <Navbar />
      {children}
    </div>
   );
}
 
export default ProtectedLayout;