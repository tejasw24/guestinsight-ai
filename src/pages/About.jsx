import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About({ darkMode, setDarkMode }) {
    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen text-gray-900 dark:text-white">
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

            <div className="max-w-6xl mx-auto px-8 py-32">
                <h1 className="text-5xl font-bold mb-8">
                    About the Project
                </h1>

                <div className="bg-gray-100 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-white/20">
                    <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                        <span className="font-semibold text-green-600">
                            GuestInsight AI
                        </span>{" "}
                        is an AI-powered web application developed to help Trishul
                        Eco-Homestays efficiently analyze guest reviews collected from
                        multiple booking platforms.
                    </p>

                    <p className="mt-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                        The system automatically classifies reviews into
                        <span className="font-semibold"> Positive</span>,
                        <span className="font-semibold"> Neutral</span>, or
                        <span className="font-semibold"> Negative</span> sentiments,
                        identifies the primary review theme such as Food, Host,
                        Cleanliness, Location, Value, or Experience, and generates an
                        AI-assisted management response.
                    </p>

                    <p className="mt-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                        This project is built using
                        <span className="font-semibold"> React</span>,
                        <span className="font-semibold"> Tailwind CSS</span>, and will
                        be extended with an
                        <span className="font-semibold"> Express.js REST API</span> and
                        AI integration in the upcoming development phases.
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default About;