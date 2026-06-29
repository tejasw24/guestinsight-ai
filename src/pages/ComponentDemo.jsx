import { useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { Button, Input, Modal, Toast, Loader } from "../components/ui";

function ComponentDemo({ darkMode, setDarkMode }) {
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);

    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen text-gray-900 dark:text-white">
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

            <div className="max-w-6xl mx-auto px-8 py-32">
                <h1 className="text-4xl font-bold mb-4">
                    UI Component Showcase
                </h1>

                <p className="text-gray-600 dark:text-gray-400 mb-10">
                    Demo page showing reusable UI components used in the project.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gray-100 dark:bg-white/10 p-6 rounded-2xl border border-gray-200 dark:border-white/20">
                        <h2 className="font-semibold mb-4">Button</h2>
                        <Button variant="primary" onClick={() => alert("Button Clicked")}>
                            Analyze Reviews
                        </Button>
                    </div>

                    <div className="bg-gray-100 dark:bg-white/10 p-6 rounded-2xl border border-gray-200 dark:border-white/20">
                        <h2 className="font-semibold mb-4">Input</h2>
                        <Input label="Guest Review" placeholder="Paste review here..." />
                    </div>

                    <div className="bg-gray-100 dark:bg-white/10 p-6 rounded-2xl border border-gray-200 dark:border-white/20">
                        <h2 className="font-semibold mb-4">Modal</h2>

                        <Button variant="secondary" onClick={() => setShowModal(true)}>
                            Open Modal
                        </Button>

                        <Modal
                            isOpen={showModal}
                            onClose={() => setShowModal(false)}
                            title="Review Details"
                        >
                            <p>Sample review details displayed inside modal.</p>
                        </Modal>
                    </div>

                    <div className="bg-gray-100 dark:bg-white/10 p-6 rounded-2xl border border-gray-200 dark:border-white/20">
                        <h2 className="font-semibold mb-4">Toast</h2>

                        <Button
                            variant="primary"
                            onClick={() => {
                                setShowToast(true);
                                setTimeout(() => setShowToast(false), 3000);
                            }}
                        >
                            Show Toast
                        </Button>

                        {showToast && (
                            <Toast message="Review analyzed successfully!" type="success" />
                        )}
                    </div>

                    <div className="bg-gray-100 dark:bg-white/10 p-6 rounded-2xl border border-gray-200 dark:border-white/20">
                        <h2 className="font-semibold mb-4">Loader</h2>
                        <Loader />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default ComponentDemo;