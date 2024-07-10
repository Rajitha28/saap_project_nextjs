import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap'; // Assuming using Bootstrap

export default function PopupNotification({ showPopup, onClose, title, message }) {
    const [isPopupOpen, setIsPopupOpen] = useState(showPopup);

    // Optional timeout functionality (adjust timeout duration as needed)
    useEffect(() => {
        if (showPopup) {
            const timeoutId = setTimeout(() => setIsPopupOpen(false), 3000); // Hide after 3 seconds
            return () => clearTimeout(timeoutId);
        }
    }, [showPopup]); // Re-run effect when showPopup changes

    return (
        <Modal show={isPopupOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

