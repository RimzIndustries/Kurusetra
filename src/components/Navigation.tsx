import React from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Castle,
  Building2,
  Coins,
  Sword,
  Users,
  Shield,
  LogOut,
  Map,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { NeumorphicButton } from "../styles/components";

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${props => props.theme.primary};
  box-shadow: 
    0 5px 10px ${props => props.theme.shadow},
    0 -2px 5px ${props => props.theme.light};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.accent};
  text-decoration: none;
  text-shadow: 
    1px 1px 2px ${props => props.theme.shadow},
    -1px -1px 2px ${props => props.theme.light};
`;

const DesktopNav = styled.nav`
  display: none;
  gap: 0.25rem;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const NavLink = styled(Link)<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: ${props => props.theme.text};
  transition: all 0.3s ease;

  ${props => props.active ? `
    background: ${props.theme.accent};
    color: white;
    box-shadow: 
      inset 3px 3px 6px rgba(0, 0, 0, 0.2),
      inset -3px -3px 6px rgba(255, 255, 255, 0.1);
  ` : `
    box-shadow: 
      3px 3px 6px ${props.theme.shadow},
      -3px -3px 6px ${props.theme.light};

    &:hover {
      transform: translateY(-2px);
      background: ${props.theme.secondary};
    }
  `}
`;

const MobileNav = styled.div`
  display: flex;
  gap: 0.25rem;
  overflow-x: auto;
  padding-bottom: 0.75rem;
  
  @media (min-width: 768px) {
    display: none;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const MobileNavLink = styled(NavLink)`
  padding: 0.5rem;
  flex-direction: column;
  font-size: 0.75rem;
  white-space: nowrap;
`;

const MobileMenuButton = styled.button`
  padding: 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.primary};
  color: ${props => props.theme.text};
  box-shadow: 
    3px 3px 6px ${props => props.theme.shadow},
    -3px -3px 6px ${props => props.theme.light};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const LogoutButton = styled(NeumorphicButton)`
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.clear();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout:", error);
      navigate("/login");
    }
  };

  const navItems = [
    { path: "/", label: "Home", icon: <Home size={20} /> },
    { path: "/kingdom", label: "Kingdom", icon: <Castle size={20} /> },
    { path: "/building", label: "Building", icon: <Building2 size={20} /> },
    { path: "/resources", label: "Resources", icon: <Coins size={20} /> },
    { path: "/military", label: "Military", icon: <Sword size={20} /> },
    { path: "/alliance", label: "Dewan Raja", icon: <Users size={20} /> },
    { path: "/combat", label: "Combat", icon: <Shield size={20} /> },
    { path: "/map", label: "World Map", icon: <Map size={20} /> },
  ];

  return (
    <Header>
      <Container>
        <NavContainer>
          <Logo to="/">Kurusetra</Logo>

          <DesktopNav>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                active={location.pathname === item.path}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
            {user && (
              <>
                <NavLink
                  to="/profile"
                  active={location.pathname === "/profile"}
                >
                  <Users size={20} />
                  Profile
                </NavLink>
                <LogoutButton onClick={handleLogout}>
                  <LogOut size={20} />
                  <span className="hidden sm:inline">Logout</span>
                </LogoutButton>
              </>
            )}
          </DesktopNav>

          <div className="flex items-center gap-2">
            {user && (
              <>
                <NavLink
                  to="/profile"
                  active={location.pathname === "/profile"}
                  className="md:hidden"
                >
                  <Users size={20} />
                </NavLink>
                <LogoutButton onClick={handleLogout} className="md:hidden">
                  <LogOut size={20} />
                </LogoutButton>
              </>
            )}
            <MobileMenuButton>
              <span className="sr-only">Open menu</span>
              <svg
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </MobileMenuButton>
          </div>
        </NavContainer>

        <MobileNav>
          {navItems.map((item) => (
            <MobileNavLink
              key={item.path}
              to={item.path}
              active={location.pathname === item.path}
            >
              {item.icon}
              {item.label}
            </MobileNavLink>
          ))}
        </MobileNav>
      </Container>
    </Header>
  );
};

export default Navigation;
