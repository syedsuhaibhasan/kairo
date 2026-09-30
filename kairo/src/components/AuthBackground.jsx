// UI only, no business logic
const backgroundVariants = {
  login: {
    gradient:
      "bg-[radial-gradient(ellipse_at_50%_-10%,#ff6b0f_0%,#ff9960_27%,transparent_58%),radial-gradient(ellipse_at_10%_55%,#ffd8bd_0%,transparent_48%),linear-gradient(180deg,#ffc49f_0%,#fff4ea_63%,#fffdfb_100%)]",
    blob: "inset-x-[-15%] top-[-18%] h-[55%]",
  },
  signup: {
    gradient:
      "bg-[radial-gradient(ellipse_at_8%_8%,#f05b4f_0%,#f99a77_31%,transparent_61%),radial-gradient(ellipse_at_94%_35%,#ffc15e_0%,transparent_42%),linear-gradient(180deg,#f58b72_0%,#ffe3d2_58%,#fffdfb_100%)]",
    blob: "right-[-18%] top-[8%] h-[48%] w-[70%]",
  },
}

function AuthBackground({ children, variant = "login" }) {
  const styles = backgroundVariants[variant] ?? backgroundVariants.login

  return (
    <div className="relative isolate min-h-dvh w-full overflow-hidden bg-[#fffaf6]">
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 ${styles.gradient}`}
      />
      <div
        aria-hidden="true"
        className={`absolute -z-10 w-[85%] rounded-[50%] bg-white/25 blur-3xl ${styles.blob}`}
      />
      <div className="relative">{children}</div>
    </div>
  )
}

export default AuthBackground
