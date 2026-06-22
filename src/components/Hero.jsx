function Hero() {
    return (
        <section
            className="h-screen bg-cover bg-center relative flex items-center justify-center"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85')",
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* Content */}
            <div className="relative text-center text-white px-6 max-w-4xl">
                <h1 className="text-6xl font-bold leading-tight mb-6">
                    AI-Powered Guest Review Intelligence
                </h1>

                <p className="text-xl text-gray-200 mb-8">
                    Analyze guest feedback, detect sentiment, classify themes, and
                    generate management responses in seconds.
                </p>

                <button className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-xl text-lg font-semibold transition">
                    Start Analysis
                </button>
            </div>
        </section>
    );
}

export default Hero;