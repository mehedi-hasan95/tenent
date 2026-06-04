interface Props {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export const AuthModal = ({ isOpen, onClose, children }: Props) => {
  return (
    <div
      aria-hidden={isOpen}
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-500 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"} `}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-white/90 transition-all duration-500 dark:bg-black/80 ${isOpen ? "opacity-100" : "opacity-0"} `}
      />

      {/* modal */}
      <div
        className={`relative z-10 w-full max-w-lg transform rounded-2xl shadow-2xl transition-all duration-500 ${isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"} `}
      >
        {/* content */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
