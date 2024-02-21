import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';
import UserContext from '../../context/UserContext';
import axios from 'axios';

export default function Login() {
  const nav = useNavigate();
  const { setEmployees, user, setUser } = useContext(UserContext);

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    const eData = {
      eName: e.target.eName.value,
      email: e.target.email.value,
      password: e.target.password.value,
      phon: e.target.phon.value,
    };

    try {
      const res = await axios.post('https://davidapp.onrender.com/employee/create', eData);
      console.log(res);
      nav('/');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const eData = {
      phon: e.target.tel.value,
      email: e.target.email.value,
    };
    try {
      const res = await axios.post('https://davidapp.onrender.com/employee/', eData);
      console.log(res);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      nav('/');
    }
    catch (error) {
      console.error('Error:', error);
    }
  }

  const handleLogout = () => {
    console.log("user", user);
    setUser(null);
    localStorage.removeItem('user');
    nav('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginContainer}>
        {user ? <div>
          <p>{`שלום ${user.eName}`}</p>
          <button className={styles.logoutButton} onClick={handleLogout}>התנתקות</button>
        </div>

          :
          <form onSubmit={(e) => { handleLogin(e) }}>
            <input className={styles.formInput} type="phon" name="tel" placeholder="מספר טלפון" />
            <input className={styles.formInput} type="email" name="email" placeholder="email" />
            <button className={styles.formButton} type="submit">התחברות</button>
          </form>
        }</div>
      <div className={styles.loginContainer}>

        {user && user.permission === "admin" && (<form onSubmit={handleCreateEmployee}>

          <h3>יצירת עובד חדש:</h3>
          <input className={styles.formInput} style={{width:"100%"}} type="text" name="eName" placeholder="שם העובד" />
          <input className={styles.formInput} type="tel" name="phon" placeholder="מספר טלפון" />
          <input className={styles.formInput} type="email" name="email" placeholder="email" />
          {/* <input className={styles.formInput} type="password" name="password" placeholder="סיסמה" /> */}
          <button className={styles.formButton} type="submit">שלח</button>
        </form>)}
      </div></div>
  );
}
