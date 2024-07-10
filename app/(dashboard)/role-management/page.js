'use client';
// Import node module libraries
import { Fragment, useEffect, useState } from 'react';
import { Row, Col, Container, Card, Table, Pagination, Modal, Button } from 'react-bootstrap';
import Loader from 'components/loader/loader';
import { useRouter } from 'next/navigation';
import { fetchUserManagement, updateUserRole, listUserRole } from 'services/user_management/user_manage';
import Select from 'react-select';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UserManagement = () => {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newUserName, setNewUserName] = useState('');
    const [newUserRole, setNewUserRole] = useState('');
    const [roles, setRoles] = useState([]);
    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);
        fetchUserManagement()
            .then(response => {
                if (response.data) {
                    setCurrentUsers(response.data);
                    setTotalPages(Math.ceil(response.data.length / 10));
                }
                setIsLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch user data.');
                setIsLoading(false);
            });
    }, []);


    useEffect(() => {
        setIsLoading(true);
        listUserRole()
            .then(roles => {
                setRoles(roles.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching user roles:', error);
                setIsLoading(false);
            });
    }, []);



    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? '#529289' : '#B6E1DC',
            borderWidth: '2px',
            borderRadius: '8px',
            boxShadow: state.isFocused ? '0 0 0 1px #B6E1DC' : 'none',
            '&:hover': {
                borderColor: '#B6E1DC',
            }
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 9999
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#B6E1DC' : state.isFocused ? '#529289' : null,
            color: state.isSelected ? 'white' : 'black',
            '&:hover': {
                backgroundColor: '#529289',
                color: 'white'
            }
        }),
        placeholder: (provided) => ({
            ...provided,
            color: 'black'
        }),
        singleValue: (provided) => ({
            ...provided,
            color: 'black'
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: '0px 8px'
        })
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setNewUserName(user.name);
        setNewUserRole({ value: user.role_id, label: user.role_name });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
        setNewUserName('');
        setNewUserRole('');
    };

    const handleSaveChanges = () => {
        if (!selectedUser || !newUserRole) return;
        const payload = [{
            user_id: selectedUser.id,
            new_role_id: newUserRole.value
        }];

        updateUserRole(payload)
            .then(response => {
                console.log('User role updated successfully:', response);
                handleCloseModal();
                setIsLoading(true); // Set loading state
                router.push('/')
                fetchUserManagement() // Refetch data
                    .then(response => {
                        if (response.data) {
                            setCurrentUsers(response.data);
                            setTotalPages(Math.ceil(response.data.length / 10));
                        }
                        setIsLoading(false); // Unset loading state
                    })
                    .catch(err => {
                        setError('Failed to fetch user data.');
                        setIsLoading(false); // Unset loading state
                    });
            })
            .catch(error => {
                console.error('Error updating user role:', error);
            });
    };

    if (isLoading) {
        return <Loader />;
    }

    const handleUserRoleChange = (selectedOption) => {
        setNewUserRole(selectedOption);
    };

    const indexOfLastUser = currentPage * 10;
    const indexOfFirstUser = indexOfLastUser - 10;
    const currentUsers = currentUser.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <Fragment>
            <div className="pt-10 pb-21"></div>
            <Container fluid className="mt-n22 px-6">
                <Card>
                    <Card.Header className="bg-white py-4">
                        <h4 className="mb-0">Role Management</h4>
                    </Card.Header>
                    <Table responsive className="text-nowrap mh-100">
                        <thead className="table-light">
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th className="d-flex justify-content-center">Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {error ? (
                                <tr>
                                    <td colSpan="4" className="text-center text-danger">{error}</td>
                                </tr>
                            ) : currentUsers.length > 0 ? (
                                currentUsers.map((item, index) => (
                                    <tr key={index}>
                                        <td className="align-middle">{item.name}</td>
                                        <td className="align-middle">{item.email}</td>
                                        <td className="align-middle">{item.role_name}</td>
                                        <td className="align-middle">
                                            <div className="d-flex justify-content-center">
                                                <button className="btn" onClick={() => handleEditUser(item)}  style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#000',
                                                        cursor: 'pointer',
                                                    }}>
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">No Users found</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <Card.Footer className="bg-white text-center d-flex justify-content-center">
                        <Pagination>
                            <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                            <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                            {Array.from({ length: totalPages }, (_, index) => (
                                <Pagination.Item
                                    key={index + 1}
                                    active={index + 1 === currentPage}
                                    onClick={() => paginate(index + 1)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                            <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
                        </Pagination>
                    </Card.Footer>
                </Card>
            </Container>

            {/* Modal for editing user */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>User Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={selectedUser ? selectedUser.name : ''}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label>User Role</label>
                        <Select
                            options={roles.map(role => ({ value: role.id, label: role.name }))}
                            styles={customStyles}
                            value={newUserRole}
                            onChange={handleUserRoleChange}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default UserManagement;
