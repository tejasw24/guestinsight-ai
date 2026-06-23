/**
 * Reusable Modal Component
 *
 * Props:
 * - isOpen: Boolean
 * - onClose: Close handler
 * - title: Modal title
 * - children: Modal content
 */

function Modal({
    isOpen,
    onClose,
    title,
    children,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-lg p-6">

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-500"
                    >
                        ✕
                    </button>
                </div>

                <div>
                    {children}
                </div>

            </div>
        </div>
    );
}

export default Modal;