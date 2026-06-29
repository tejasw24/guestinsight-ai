import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Footer from "../components/Footer";

function Home({ darkMode, setDarkMode }) {
    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen text-gray-900 dark:text-white">
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

            <Hero />

            <section className="max-w-7xl mx-auto px-8 py-20">
                <div className="text-center mb-14">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Core Features
                    </h2>

                    <p className="text-gray-600 dark:text-gray-400">
                        Advanced AI insights for smarter guest experience management.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <Card
                        icon="😊"
                        title="Sentiment Detection"
                        description="Automatically classify reviews into positive, neutral, or negative sentiment."
                    />

                    <Card
                        icon="🏠"
                        title="Theme Classification"
                        description="Identify core themes like host, food, cleanliness, location, and value."
                    />

                    <Card
                        icon="🤖"
                        title="AI Response Generator"
                        description="Generate personalized one-line management responses instantly."
                    />
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Home;