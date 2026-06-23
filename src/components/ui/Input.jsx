/**
 * Reusable Input Component
 *
 * Props:
 * - label: Input label
 * - type: text, email, password
 * - placeholder: Placeholder text
 * - value: Current value
 * - onChange: Change handler
 */

function Input({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
}) {
    return (
        <div className="flex flex-col gap-2 w-full">
            <label className="font-medium text-slate-700">
                {label}
            </label>

            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="
          border
          border-slate-300
          rounded-xl
          px-4
          py-3
          outline-none
          focus:ring-2
          focus:ring-emerald-500
          transition
        "
            />
        </div>
    );
}

export default Input;