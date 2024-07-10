'use client'
import { useEffect, useState } from 'react';
import 'styles/theme.scss';
import NavbarVertical from '/layouts/navbars/NavbarVertical';
import NavbarTop from '/layouts/navbars/NavbarTop';
import { SessionProvider } from 'next-auth/react';
import SignIn from 'app/(auth)/authentication/sign-in/page';

export default function DashboardLayout({ children }) {
	const [showMenu, setShowMenu] = useState(true);
	const [isSignedIn, setIsSignedIn] = useState(false);

	const toggleMenu = () => {
		setShowMenu(!showMenu);
	};

	const checkSignInStatus = () => {
		if (localStorage.getItem("access_token")) {
			setIsSignedIn(true);
		} else {
			setIsSignedIn(false);
		}
	};

	useEffect(() => {
		// Check initial sign-in status
		checkSignInStatus();

		// Periodically check for changes in localStorage
		const interval = setInterval(() => {
			checkSignInStatus();
		}, 1000); // Adjust the interval as needed

		return () => clearInterval(interval);
	}, []);

	return (
		<SessionProvider>
			{!isSignedIn ? (
				<SignIn />
			) : (
				<div id="db-wrapper" className={`${showMenu ? '' : 'toggled'}`}>
					<div className="navbar-vertical navbar">
						<NavbarVertical
							showMenu={showMenu}
							onClick={(value) => setShowMenu(value)}
						/>
					</div>
					<div id="page-content">
						<div className="header">
							<NavbarTop
								data={{
									showMenu: showMenu,
									SidebarToggleMenu: toggleMenu
								}}
							/>
						</div>
						{children}
					</div>
				</div>
			)}
		</SessionProvider>
	);
}
