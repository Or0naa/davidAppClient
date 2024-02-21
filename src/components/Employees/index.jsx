import { useContext, useEffect } from 'react';
import styles from './style.module.css'
import UserContext from '../../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Employees() {
  const { employees, setEmployees, team, user } = useContext(UserContext)
  const nav = useNavigate()

  useEffect(() => {
    // הבאת המשתמש מה-LocalStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));

    // אם יש משתמש שמאוחסן, עדכון של הסטייט
    if (!storedUser) {
            nav("/login")
    }
  }, [])

  const handleDelete = async (e) => {
    const wontToDelete = confirm("בטוח שאתה רוצה למחוק?")
    if (wontToDelete) {
      try {
        await axios.delete(`https://davidapp.onrender.com/team/${e._id}`)
          .then(console.log("delete done"))
      }
      catch {
        console.log("error")
      }
    }

  }

  return (
    <div className={styles.teams}>
      {team.map((t) => (
        <div onClick={() => nav(`/teamInfo/${t._id}`)} className={styles.team} style={{ backgroundColor: t.color }} key={t._id}>
          {t.teamName}
          {user && user.permission === "admin" && (<button onClick={() => { handleDelete(t) }}>❌</button>)}
        </div>
      ))}
      {user && user.permission === "admin" && (<div className={styles.team} onClick={() => nav('/newteam')}>יצירת צוות חדש</div>)}
    </div>
  )
}