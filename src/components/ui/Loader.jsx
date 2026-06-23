/**
 * Reusable Loader Component
 *
 * Props:
 * - text: Loading message
 */

function Loader({ text = "Analyzing Reviews..." }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-8">

            <div
                className="
          w-12
          h-12
          border-4
          border-emerald-500
          border-t-transparent
          rounded-full
          animate-spin
        "
            ></div>

            <p className="text-slate-600 font-medium">
                {text}
            </p>

        </div>
    );
}

export default Loader;