import { useContext, useEffect, useState } from 'react';
import styles from './style.module.css';
import axios from 'axios';
import UserContext from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function NewTeam() {
  const { employee, setEmployee } = useContext(UserContext);
  const [empList, setEmpList] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    const empData = async () => {
      try {
        const allEmp = await axios.get("http://localhost:4141/employee");
        setEmployee(allEmp.data);
      } catch (error) {
        console.log("error:", error);
      }
    };
    empData();
  }, []);

  const addToTeam = (e) => {
    setEmpList([...empList, e]); // Append the new employee to the existing list
  };

  const handleNewTeam = async (e) => {
    e.preventDefault();
    const teamData = {
      teamName: e.target.teamName.value,
      teamUsers: empList,
      color: e.target.color.value,
    };
    try {
      const res = await axios.post("http://localhost:4141/team/create", teamData);
      console.log(res);
      nav("/employee");
    } catch (error) {
      console.log("error:", error);
    }
  };

  return (
    <div className={styles.container}>
    <div className={styles.employeeList}>
      {employee.map((emp) => (
        <div key={emp._id} className={styles.employeeItem}>
          {emp.eName}
          <button onClick={() => addToTeam(emp)} className={styles.addButton}>+</button>
        </div>
      ))}
    </div>
    <div className={styles.teamMembers}>
      לצוות החדש יצטרפו: {empList.map((e) => (
        <span key={e._id} className={styles.teamMemberItem}>{e.eName}, </span>
      ))}
    </div>
    <form onSubmit={handleNewTeam} className={styles.formContainer}>
      <input type="text" name="teamName" placeholder="שם הצוות" className={styles.formInput} />
      <label>צבע הקבוצה</label>
      <input type="color" name="color" className={styles.formInput} />
      <button type="submit" className={styles.submitButton}>צור</button>
    </form>
  </div>
  );
}
