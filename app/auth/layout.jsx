const AuthLayout = ({ children }) => {
  return ( 
    <div className="h-full flex items-center justify-center
    bg-skin-fill">
      {children}
    </div>
   );
}
 
export default AuthLayout;