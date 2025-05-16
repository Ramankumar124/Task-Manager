import { Button, Modal } from 'react-bootstrap'

interface DeleteTaskCardProps {
    showDeleteModal: boolean;
    setShowDeleteModal: (show: boolean) => void;
    confirmDelete: () => void;
    isDeleting: boolean;
}

const DeleteTaskCard = ({
    showDeleteModal,
    setShowDeleteModal,
    confirmDelete,
    isDeleting
}: DeleteTaskCardProps) => {
    return (
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete this task? This action cannot be
                undone.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                    Cancel
                </Button>
                <Button
                    variant="danger"
                    onClick={confirmDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? "Deleting..." : "Delete Task"}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default DeleteTaskCard