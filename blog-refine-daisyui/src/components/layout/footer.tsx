import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="footer flex xs:flex-col flex-row justify-between items-center bg-gradient-to-r from-base-200 via-base-300 to-base-200 text-base-content border-t border-base-300 px-6 py-10 gap-8 relative overflow-hidden">
      {/* Animated wave effect */}
      <div className="absolute bottom-0 w-full h-4 bg-gradient-to-t from-base-300 to-transparent animate-wave"></div>

      {/* Right side: Logos equally spaced */}
      <nav className="flex-1 z-10">
        <div className="flex w-full items-center gap-4 xs:flex-col xs:flex-row justify-between mb-5">
          <>
            
              <a
        href="https://www.gecad.isep.ipp.pt/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GECAD Website"
        className="hover:scale-110 transition-transform duration-300 "
    >
        <img src="/gecadLogo.png" alt="GECAD Logo" className="h-36 w-auto object-contain" />
    </a>
        </>  
          <a
            href="https://satcommproject.eu/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="SATCOMM Website"
            className="hover:scale-110 transition-transform duration-300"
          >
            <img
              src="/SATCOMM-650x500.png"
              alt="SATCOMM Logo"
              className="h-20 w-auto object-contain"
            />
          </a>
          <a
            href="https://www.isep.ipp.pt/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ISEP Website"
            className="hover:scale-110 transition-transform duration-300"
          >
            <img
              src="/Isep-logo.png"
              alt="ISEP Logo"
              className="h-20 w-auto object-contain"
            />
          </a>
          <a
            href="https://www.ipp.pt/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="P.PORTO Website"
            className="hover:scale-110 transition-transform duration-300"
          >
            <img
              src="/Pporto_norm.png"
              alt="P.PORTO Logo"
              className="h-20 w-auto object-contain mb-5"
            />
          </a>
        </div>
      </nav>
        <div className="w-full flex xs:flex-col flex-row justify-center items-center gap-1 absolute bottom-2 left-0 z-20 mb-5 ">
            <p>© {new Date().getFullYear()} - All rights reserved by</p>
            <p className="font-semibold">GECAD, SATCOMM, ISEP and P.PORTO</p>
        </div>
    </footer>
    
  );
};

export default Footer;
