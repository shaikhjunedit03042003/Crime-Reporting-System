import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiHome, FiFileText, FiMenu, FiX, FiClock, FiSettings } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link to="/dashboard" className={styles.navBrand}>
          🚨 Crime Reporting
        </Link>

        <button
          className={styles.menuToggle}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <div className={`${styles.navMenu} ${menuOpen ? styles.active : ""}`}>
          <Link to="/dashboard" className={styles.navLink}>
            <FiHome size={18} />
            Dashboard
          </Link>
          <Link to="/report-crime" className={styles.navLink}>
            <FiFileText size={18} />
            Report Crime
          </Link>

          {user?.role === "ROLE_ADMIN" && (
            <>
              <div className={styles.navDivider}></div>
              <Link to="/admin/dashboard" className={styles.navLink}>
                <FiHome size={18} />
                Admin Dashboard
              </Link>
              <Link to="/admin/audit-logs" className={styles.navLink}>
                <FiClock size={18} />
                Audit Logs
              </Link>
              <Link to="/admin/settings" className={styles.navLink}>
                <FiSettings size={18} />
                Settings
              </Link>
            </>
          )}

          <div className={styles.navDivider}></div>

          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.email}</span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <FiLogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
