function Header() {
  return (
    <div className="relative z-2">
      {/* HEADER */}

      <header className="flex justify-between items-center p-4 bg-[#44066b] px-6 md:px-10 lg:px-14">
        <div>
          <a>
            <img src="\assets\Group 9.png" className="h-10 "></img>
          </a>
        </div>
        <a
          href="https://www.goldempresas.com.br/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="\assets\logo-site.png"
            className="h-8 hover:cursor-pointer"
          ></img>
        </a>
      </header>
    </div>
  );
}

export default Header;
