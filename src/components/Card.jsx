function Card({ title, description, icon }) {
    return (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg hover:scale-105 transition duration-300">
            <div className="text-4xl mb-4">{icon}</div>

            <h2 className="text-2xl font-semibold text-white mb-3">
                {title}
            </h2>

            <p className="text-gray-300 leading-relaxed">
                {description}
            </p>
        </div>
    );
}

export default Card;