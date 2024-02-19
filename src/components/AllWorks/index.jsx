import { useContext, useEffect } from 'react';
import styles from './style.module.css';
import axios from 'axios';
import DataContext from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';

export default function AllWorks() {
  const { work, setWork, oneWork, setOneWork } = useContext(DataContext);
  const nav = useNavigate();
  const { team, user } = useContext(UserContext);

  console.log("team", team)

  const goToWork = (data) => {
    setOneWork(data)
    
    nav("/works/" + data._id);
  }

  const handleDeleteWork = async (w) => {
    try {
      const res = await axios.delete("http://localhost:4141/work/delete/" + w._id);
      console.log(res);
      setWork(work.filter((workItem) => workItem._id !== w._id));
      nav("/works");
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <>
    <div className={styles.worksContainer}>
      {work.map((w) => (
        <div onClick={() => goToWork(w)} className={styles.workItem} style={{backgroundColor:team.find(t => t._id === w.teamId)?.color || "#a5d3eb"}} key={w._id}>
          <p>{w.workDate}</p>
          <p>{w.clientName}</p>
          {user && user.permission === "admin" && (     <button onClick={()=>{handleDeleteWork(w)}}>מחיקה</button>)}
        </div>
      ))}
    </div>
    {user && user.permission === "admin" && (    <div className={styles.workItem} onClick={()=>{nav('/addNewWork')}}>עבודה חדשה</div>)}
    </>
  );
}
