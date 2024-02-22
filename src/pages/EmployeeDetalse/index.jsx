import { useContext, useEffect } from 'react';
import styles from './style.module.css'
import UserContext from '../../context/UserContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DataContext from '../../context/DataContext';

export default function EmployeeDetalse() {
  const { serverUrl } = useContext(DataContext);

  const { user, oneEmployee, setOneEmployee, team } = useContext(UserContext);

  let employeeId = useParams()

  console.log("oneEmployee", employeeId)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${serverUrl}/employee/${employeeId.empId}`);
        setOneEmployee(response.data);
        console.log("res: ", response.data)
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchData();

  }, []);


  return (
    <div>
      <div> {oneEmployee.eName}</div>
      <div>      {oneEmployee.email}
      </div>
      <div>      {oneEmployee.phon}
      </div>
      <button>עריכה</button>
      <button>מחיקה</button>

    </div>
  )
}
