import { Toaster as Sonner } from "sonner"
import { CircleCheck, CircleX, TriangleAlert, Info } from "lucide-react"

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="light"
      closeButton
      visibleToasts={3}
      gap={10}
      offset={{ top: "16px", bottom: "16px", left: "16px", right: "16px" }}
      mobileOffset={{ top: "64px", bottom: "96px", left: "12px", right: "12px" }}
      className="toaster group"
      icons={{
        success: <CircleCheck className="size-5" />,
        error: <CircleX className="size-5" />,
        warning: <TriangleAlert className="size-5" />,
        info: <Info className="size-5" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group rounded-xl border border-[#F0DCCB] bg-white p-3.5 shadow-lg shadow-orange-950/10 text-[#2B1810] w-full sm:w-[356px]",
          title: "text-sm font-medium text-[#2B1810]",
          description: "text-[13px] leading-snug text-[#6F4636]",
          icon: "size-8 rounded-lg flex items-center justify-center shrink-0 group-data-[type=success]:bg-emerald-50 group-data-[type=success]:text-emerald-700 group-data-[type=error]:bg-red-50 group-data-[type=error]:text-red-700 group-data-[type=warning]:bg-amber-50 group-data-[type=warning]:text-amber-700 group-data-[type=info]:bg-orange-50 group-data-[type=info]:text-[#A83A04]",
          closeButton:
            "border border-[#F0DCCB] bg-white text-[#6F4636] hover:bg-[#FFF4EC] hover:text-[#2B1810] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b0f] transition-colors",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
