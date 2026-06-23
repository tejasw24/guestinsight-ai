import { useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
    Button,
    Input,
    Modal,
    Toast,
    Loader,
} from "../components/ui";

function ComponentDemo() {
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);

    return (
        <>
            <Navbar />

            <div className="min-h-screen p-10 bg-slate-100">

                <h1 className="text-4xl font-bold mb-8">
                    UI Component Showcase
                </h1>

                {/* Button */}
                <div className="mb-8">
                    <h2 className="font-semibold mb-2">Button</h2>

                    <Button
                        variant="primary"
                        onClick={() => alert("Button Clicked")}
                    >
                        Analyze Reviews
                    </Button>
                </div>

                {/* Input */}
                <div className="mb-8 max-w-md">
                    <h2 className="font-semibold mb-2">Input</h2>

                    <Input
                        label="Guest Review"
                        placeholder="Paste review here..."
                    />
                </div>

                {/* Modal */}
                <div className="mb-8">
                    <h2 className="font-semibold mb-2">Modal</h2>

                    <Button
                        variant="secondary"
                        onClick={() => setShowModal(true)}
                    >
                        Open Modal
                    </Button>

                    <Modal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        title="Review Details"
                    >
                        <p>
                            Sample review details displayed inside modal.
                        </p>
                    </Modal>
                </div>

                {/* Toast */}
                <div className="mb-8">
                    <h2 className="font-semibold mb-2">Toast</h2>

                    <Button
                        variant="primary"
                        onClick={() => {
                            setShowToast(true);

                            setTimeout(() => {
                                setShowToast(false);
                            }, 3000);
                        }}
                    >
                        Show Toast
                    </Button>

                    {showToast && (
                        <Toast
                            message="Review analyzed successfully!"
                            type="success"
                        />
                    )}
                </div>

                {/* Loader */}
                <div className="mb-8">
                    <h2 className="font-semibold mb-2">Loader</h2>

                    <Loader />
                </div>

            </div>

            <Footer />
        </>
    );
}

export default ComponentDemo;