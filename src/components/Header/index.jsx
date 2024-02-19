import { NavLink } from 'react-router-dom';
import styles from './style.module.css'

export default function Header() {
  return (
    <div >
        <div className={styles.header}>
          <nav className={styles.navLink}>
            <NavLink
              to={'/'}
              className={({ isActive }) => {
                return isActive ? styles.active : "";
              }}            >
              יומן
            </NavLink>
  
            <NavLink
              to={'/works'}
              className={({ isActive }) => {
                return isActive ? styles.active : "";
              }}            >
              לצפיה בכל העבודות
            </NavLink>
  
            <NavLink
              to={'/login'}
              className={({ isActive }) => {
                return isActive ? styles.active : "";
              }}            >
              Login
            </NavLink>
  
            <NavLink
              to={'/employee'}
              className={({ isActive }) => {
                return isActive ? styles.active : "";
              }}              
            >
              צוותים
            </NavLink>
          </nav>
        </div>
      
    </div>
  )
}
