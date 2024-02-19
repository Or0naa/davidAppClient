import { useContext, useEffect, useState } from 'react'
import styles from './style.module.css'
import DataContext from '../../context/DataContext'
import Task from '../../components/Task';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../../context/UserContext';

export default function OneWork() {

  const { oneWork, setOneWork } = useContext(DataContext);
  const { team, user } = useContext(UserContext);
  const [teamId, setTeamId] = useState(oneWork.teamId);

  let workId = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4141/work/${workId.workId}`);
        setOneWork(response.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchData();
  }, []);

  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');

  const handleAddTask = () => {
    if (taskInput.trim() !== '') {
      setTasks([...tasks, taskInput]);
      setTaskInput('');
    }
  };

  const [updateWork, setUpdateWork] = useState(false)

  const handleUpdate = async (e) => {
    e.preventDefault();

   
    if (e.target.price.value === "") {
      e.target.price.value = oneWork.price;
    }
    if (e.target.address.value === "") {
      e.target.address.value = oneWork.address;
    }
    if (e.target.phoneClient.value === "") {
      e.target.phoneClient.value = oneWork.phoneClient;
    }
    if (e.target.clientName.value === "") {
      e.target.clientName.value = oneWork.clientName;
    }
    if (e.target.description.value === "") {
      e.target.description.value = oneWork.description;
    }
    const newWork = {
    
      teamId: teamId,
      price: e.target.price.value,
      address: e.target.address.value,
      phoneClient: e.target.phoneClient.value,
      clientName: e.target.clientName.value,
      description: e.target.description.value,
    };
    console.log(newWork);

    try {
      const res = await axios.put(`http://localhost:4141/work/${workId.workId}`, newWork);
      // If needed, you can use the updated work ID
      console.log("Work updated successfully", res);
      setUpdateWork(false);
    } catch (error) {
      console.error("Error updating work:", error);

    }
    for (const i of tasks) {
      const task = {
        workId: workId.workId,
        taskName: i
      };
      await axios.post("http://localhost:4141/task/create", task);
    }
  }

  return (
    <div className={styles.oneWorkContainer}>
      <form onSubmit={(e) => { handleUpdate(e) }}>
        <div className={styles.section}>
          <div className={styles.clientDetails}>
            פרטי הלקוח:
            <p>{oneWork.clientName}</p>
            {updateWork ? <input type="text" name="clientName" placeholder='שם' /> : ""}
            <p>{oneWork.phoneClient}</p>
            {updateWork ? <input type="text" name="phoneClient" placeholder='טלפון' /> : ""}
            <p>{oneWork.address}</p>
            {updateWork ? <input type="text" name="address" placeholder='כתובת' /> : ""}

          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.times}>
            זמנים:

            <p>{oneWork.beggingTime}</p>
            {/* {updateWork ? <input type="text" name="beggingTime" /> : ""} */}
            <p>{oneWork.endingTime}</p>
            {/* {updateWork ? <input type="text" name="endingTime" /> : ""} */}

          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.description}>
            תיאור:
            <p>{oneWork.description}</p>
            {updateWork ? <input type="text" name="description" placeholder='תיאור' /> : ""}

            <div className={styles.tasks}>
              <Task />
            </div>
          </div>
        </div>
        <div className={styles.section}>
          {oneWork.isDone ? (
            <p className={styles.doneStatus}>בוצעה</p>
          ) : (
            <p className={styles.doneStatus}>עדיין לא בוצעה</p>
          )}
          <div className={styles.additionalInfo}>
            לדוד בלבד:
            <p className={styles.price}>price: {oneWork.price}</p>
            {updateWork ? <input type="number" name="price" placeholder='מחיר' /> : ""}
            צוות:
            <p>{team.find(t => t._id === oneWork.teamId)?.teamName}</p>
            {updateWork ?
              <select name="team" onChange={(e) => setTeamId(e.target.value)}>
                <option value="">--בחר--</option>
                {team.map(t => (
                  <option key={t._id} value={t._id}>{t.teamName}</option>
                ))}
              </select> : ""}

          </div>
        </div>

        {updateWork ? <button type="submit">שינוי</button> : ""}

      </form>
      {updateWork?
            <form>
            <div>משימות:</div>
            <input
              type="text"
              placeholder='הוסף משימה'
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
            />
            <button type="button" onClick={handleAddTask}>הוסף</button>
    
            {tasks.map((task, index) => (
      <div key={`task_${index}`}>{task}</div>
    ))}
    
        </form> : ""}
        {user && user.permission === "admin" && (    <button onClick={() => setUpdateWork(!updateWork)}>עריכה</button>)}
    </div>
  )
}
