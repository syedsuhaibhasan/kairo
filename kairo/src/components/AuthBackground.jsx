// UI only, no business logic
function AuthBackground({ children }) {
  return (
    <div className="relative isolate min-h-[calc(100vh-5rem)] overflow-hidden bg-[#fffaf6]">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_-10%,#ff6b0f_0%,#ff9960_27%,transparent_58%),radial-gradient(ellipse_at_10%_55%,#ffd8bd_0%,transparent_48%),linear-gradient(180deg,#ffc49f_0%,#fff4ea_63%,#fffdfb_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-[-15%] top-[-18%] -z-10 h-[55%] rounded-[50%] bg-white/25 blur-3xl"
      />
      <div className="relative">{children}</div>
    </div>
  )
}

export default AuthBackground
