const EmailTemplate = ({confirmLink}) => {
  return ( 
    <main className="flex h-full flex-col items-center justify-center 
    bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
    from-green-400 to-green-800">
      <div className="space-y-6 text-center">
        <h1 className="text-6xl font-semibold text-white drop-shadow-md">
          🔐MembersOnly
        </h1>
        <p className="text-white text-lg">
          A private social media platform
        </p>
        <p>
          Click <a href={confirmLink}>here</a> to confirm email.
        </p>
      </div>
    </main>
  );
};
 
export default EmailTemplate;