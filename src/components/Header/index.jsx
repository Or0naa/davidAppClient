import { NavLink } from 'react-router-dom';
import styles from './style.module.css'
import { useContext, useEffect } from 'react';
import UserContext from '../../context/UserContext';

export default function Header() {
  const { user } = useContext(UserContext);
  

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
  
  }, [])

  return (
    <div >
        <div className={styles.header}>
          <nav className={styles.navLink}>
             
            <NavLink
              to={'/works'}
              className={({ isActive }) => {
                return isActive ? styles.active : "";
              }}            >
              לצפיה בכל העבודות
            </NavLink>
  
         
          {user && user.permission === 'admin' &&
            <NavLink
              to={'/employees'}
              className={({ isActive }) => {
                return isActive ? styles.active : "";
              }}              
            >
              צוותים
            </NavLink>}

            <NavLink
              to={'/'}
              className={({ isActive }) => {
                return isActive ? styles.active : "";
              }}            >
              יומן
            </NavLink>

            <NavLink
              to={'/login'}
              className={({ isActive }) => {
                return isActive ? styles.active : "";
              }}            >
            {user ? `מחובר כרגע: ${user.eName}` : "התחברות"}
            </NavLink>
          </nav>
        </div>
      
    </div>
  )
}
