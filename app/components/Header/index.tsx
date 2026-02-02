
const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-base-200/70 bg-base-100/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-primary-content shadow-sm">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M3 11.5 12 4l9 7.5v8.5a2 2 0 0 1-2 2h-4v-6a3 3 0 0 0-6 0v6H5a2 2 0 0 1-2-2v-8.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">
              SweetHomes
            </div>
            <div className="text-xs opacity-70">Find your next place</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn btn-ghost btn-sm hidden md:inline-flex">
            Log in
          </button>
          <button className="btn btn-primary btn-sm">Get started</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
