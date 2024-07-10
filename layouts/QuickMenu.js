'use client'
// import node module libraries
import Link from 'next/link';
import { Fragment, useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
    Row,
    Col,
    Image,
    Dropdown,
    ListGroup,
    Spinner
} from 'react-bootstrap';

// simple bar scrolling used for notification item scrolling
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

// import data files
import NotificationList from 'data/Notification';

// import hooks
import useMounted from 'hooks/useMounted';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { logOut } from 'services/users/users';

const QuickMenu = () => {
    const { data: session, status } = useSession();

    const hasMounted = useMounted();
    const isDesktop = useMediaQuery({
        query: '(min-width: 1224px)'
    });

    const [profileUrl, setProfileUrl] = useState('');
    const [profileName, setProfileName] = useState('');

    useEffect(() => {
        const profileUrl = localStorage.getItem('profileurl') || '';
        const profileName = localStorage.getItem('name') || '';
        setProfileUrl(profileUrl);
        setProfileName(profileName);
    }, []);

    async function signout() {
        try {
            let access_token = localStorage.getItem('access_token');
            await logOut(JSON.stringify({ token: access_token }));
            localStorage.clear();
            await signOut();
            await signOut();
        } catch (error) {
            console.error("Error signing out:", error);
            await signOut();
        }
    }

    const Notifications = () => {
        return (
            <SimpleBar style={{ maxHeight: '300px' }}>
                <ListGroup variant="flush">
                    {NotificationList.map((item, index) => (
                        <ListGroup.Item className={index === 0 ? 'bg-light' : ''} key={index}>
                            <Row>
                                <Col>
                                    <Link href="#" className="text-muted">
                                        <h5 className=" mb-1">{item.sender}</h5>
                                        <p className="mb-0"> {item.message}</p>
                                    </Link>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </SimpleBar>
        );
    }

    const QuickMenuDesktop = () => {
        return (
            <ListGroup as="ul" bsPrefix='navbar-nav' className="navbar-right-wrap ms-auto d-flex nav-top-wrap">
                <Dropdown as="li" className="ms-2">
                    <Dropdown.Toggle
                        as="a"
                        bsPrefix=' '
                        className="rounded-circle"
                        id="dropdownUser">
                        <div className="avatar avatar-md avatar-indicators avatar-online">
                            <Image alt="profile" src={profileUrl || '/images/avatar/avatar_1.jpg'} className="rounded-circle" loading='lazy' />
                        </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                        className="dropdown-menu dropdown-menu-end"
                        align="end"
                        aria-labelledby="dropdownUser"
                    >
                        <Dropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=' '>
                            <div className="lh-1">
                                <h5 className="mb-1">{profileName}</h5>
                            </div>
                            <div className="dropdown-divider mt-3 mb-2"></div>
                        </Dropdown.Item>
                        <Dropdown.Item onClick={signout}>
                            <i className="fe fe-power me-2"></i>Sign Out
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </ListGroup>
        );
    }

    const QuickMenuMobile = () => {
        return (
            <ListGroup as="ul" bsPrefix='navbar-nav' className="navbar-right-wrap ms-auto d-flex nav-top-wrap">
                <Dropdown as="li" className="ms-2">
                    <Dropdown.Toggle
                        as="a"
                        bsPrefix=' '
                        className="rounded-circle"
                        id="dropdownUser">
                        <div className="avatar avatar-md avatar-indicators avatar-online">
                            <Image alt="profile" src={profileUrl || '/images/avatar/avatar_1.jpg'} className="rounded-circle" loading='lazy' />
                        </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                        className="dropdown-menu dropdown-menu-end"
                        align="end"
                        aria-labelledby="dropdownUser"
                    >
                        <Dropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=' '>
                            <div className="lh-1">
                                <h5 className="mb-1">{profileName}</h5>
                            </div>
                            <div className="dropdown-divider mt-3 mb-2"></div>
                        </Dropdown.Item>
                        <Dropdown.Item onClick={signout}>
                            <i className="fe fe-power me-2"></i>Sign Out
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </ListGroup>
        );
    }

    if (status === 'loading') {
        return <Spinner animation="border" />;
    }

    return (
        <Fragment>
            {hasMounted && isDesktop ? <QuickMenuDesktop /> : <QuickMenuMobile />}
        </Fragment>
    );
}

export default QuickMenu;
