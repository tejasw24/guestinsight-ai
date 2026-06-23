/**
 * Reusable Button Component
 *
 * Props:
 * - children: Button content
 * - variant: primary | secondary | danger
 * - onClick: Click handler
 * - disabled: Disable button
 */

const variants = {
    primary:
        "bg-emerald-600 hover:bg-emerald-700 text-white",

    secondary:
        "bg-slate-200 hover:bg-slate-300 text-slate-900",

    danger:
        "bg-red-600 hover:bg-red-700 text-white",
};

function Button({
    children,
    variant = "primary",
    onClick,
    disabled = false,
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        px-5 py-3 rounded-xl
        font-medium
        transition-all duration-300
        shadow-md hover:shadow-lg
        ${variants[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
        >
            {children}
        </button>
    );
}

export default Button;