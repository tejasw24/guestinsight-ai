import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Dashboard() {
    return (
        <div className="bg-gray-950 min-h-screen text-white">
            <Navbar />

            <div className="max-w-6xl mx-auto px-8 py-32">
                <h1 className="text-5xl font-bold mb-8">
                    Dashboard
                </h1>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white/10 p-6 rounded-2xl">
                        <h2 className="text-2xl font-semibold">120</h2>
                        <p className="text-gray-400">Total Reviews</p>
                    </div>

                    <div className="bg-white/10 p-6 rounded-2xl">
                        <h2 className="text-2xl font-semibold">85%</h2>
                        <p className="text-gray-400">Positive Reviews</p>
                    </div>

                    <div className="bg-white/10 p-6 rounded-2xl">
                        <h2 className="text-2xl font-semibold">15%</h2>
                        <p className="text-gray-400">Negative Reviews</p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Dashboard;