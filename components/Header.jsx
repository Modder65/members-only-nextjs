export function Header({ openLoginModal, openSignupModal }) {
  return (
    <header>
      <div className="header-container">
        <div className="header-title-container">
          <h1>
            <span className="members">Members</span>
            <span className="only">Only</span>
          </h1>
        </div>
        <div className="header-button-container">
          <button className="header-button login-button" onClick={openLoginModal}>Log In</button>
          <button className="header-button signup-button" onClick={openSignupModal}>Sign Up</button>
        </div>
      </div>
    </header>
  )
}