import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
    return (
        <div className="bg-gray-950 min-h-screen text-white">
            <Navbar />

            <div className="max-w-6xl mx-auto px-8 py-32">
                <h1 className="text-5xl font-bold mb-8">
                    About the Project
                </h1>

                <p className="text-gray-300 text-lg leading-relaxed">
                    This AI-powered sentiment classifier helps Trishul Eco-Homestays
                    analyze guest reviews efficiently by detecting sentiment, identifying
                    review themes, and generating instant management responses.
                </p>
            </div>

            <Footer />
        </div>
    );
}

export default About;