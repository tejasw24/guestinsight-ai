import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Login() {
    return (
        <div className="bg-gray-950 min-h-screen text-white">
            <Navbar />

            <div className="flex justify-center items-center py-32 px-6">
                <div className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl w-full max-w-md shadow-lg">
                    <h1 className="text-4xl font-bold mb-8 text-center">
                        Login
                    </h1>

                    <form className="space-y-6">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full p-4 rounded-lg bg-black/30 border border-white/20"
                        />

                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full p-4 rounded-lg bg-black/30 border border-white/20"
                        />

                        <button
                            className="w-full bg-green-500 hover:bg-green-600 py-4 rounded-lg font-semibold transition"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Login;