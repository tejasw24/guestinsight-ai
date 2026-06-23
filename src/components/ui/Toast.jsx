/**
 * Reusable Toast Component
 *
 * Props:
 * - message: Toast message
 * - type: success | error | info
 */

function Toast({ message, type = "info" }) {
    const styles = {
        success: "bg-green-500",
        error: "bg-red-500",
        info: "bg-blue-500",
    };

    return (
        <div
            className={`
        fixed top-5 right-5
        text-white
        px-5 py-3
        rounded-xl
        shadow-lg
        z-50
        ${styles[type]}
      `}
        >
            {message}
        </div>
    );
}

export default Toast;