import { useContext, useEffect, useState } from 'react'
import styles from './style.module.css'
import DataContext from '../../context/DataContext'
import Task from '../../components/Task';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../../context/UserContext';

export default function OneWork() {

  const { oneWork, setOneWork, serverUrl, setWork, work } = useContext(DataContext);
  const { team, user } = useContext(UserContext);
  const [teamId, setTeamId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  let workId = useParams()
  const [updateWork, setUpdateWork] = useState(false)
  const start = new Date(oneWork.beggingTime);
  const end = new Date(oneWork.endingTime);
  const nav = useNavigate();
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      nav("/login")
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${serverUrl}/work/${workId.workId}`);
        setOneWork(response.data);
        setTeamId(response.data.teamId);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddTask = () => {
    if (taskInput.trim() !== '') {
      setTasks([...tasks, taskInput]);
      setTaskInput('');
    }
  };
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
    if (e.target.beggingTime.value === "") {
      const start = new Date(oneWork.beggingTime).toLocaleTimeString().slice(0, -3)
      e.target.beggingTime.value = start;
    }

    if (e.target.endingTime.value === "") {
      const end = new Date(oneWork.endingTime).toLocaleTimeString().slice(0, -3)
      e.target.endingTime.value = end;
    }

    if (!e.target.workDate.value) {
      const workDate = new Date(oneWork.beggingTime);
      e.target.workDate.value = `${workDate.getFullYear()}-${(workDate.getMonth() + 1).toString().padStart(2, '0')}-${workDate.getDate().toString().padStart(2, '0')}`;
    }


    const newWork = {
      beggingTime: `${e.target.workDate.value}T${e.target.beggingTime.value}:00.000Z`,
      endingTime: `${e.target.workDate.value}T${e.target.endingTime.value}:00.000Z`,
      teamId: teamId,
      price: e.target.price.value,
      address: e.target.address.value,
      phoneClient: e.target.phoneClient.value,
      clientName: e.target.clientName.value,
      description: e.target.description.value,
    };
    console.log(newWork);

    try {
      const res = await axios.put(`${serverUrl}/work/${workId.workId}`, newWork)
        .then((res) => { setOneWork(res.data) })
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
      await axios.post(`${serverUrl}/task/create`, task);
    }
  }

  const handleDelete = async () => {
    const areUSure = window.confirm("Are you sure you want to delete this work?");
    if (areUSure) {
      try {
        const res = await axios.delete(`${serverUrl}/work/` + workId.workId);
        console.log(res);
        setOneWork(null);
        nav("/");
      } catch (error) {
        console.log(error);
      }
    }
    else {
      return;
    }
  };

  const handleCopy = async () => {
    const newWork = {

      beggingTime: oneWork.beggingTime,
      endingTime: oneWork.endingTime,
      teamId: teamId,
      price: oneWork.price,
      address: oneWork.address,
      phoneClient: oneWork.phoneClient,
      clientName: oneWork.clientName,
      description: `${oneWork.description}(Copied)`,
    };

    console.log("newWork", newWork);

    try {
      const res = await axios.post(`${serverUrl}/work/create`, newWork);
      const createdWorkId = res.data._id;
      
      for (const i of tasks) {
        const task = {
          workId: createdWorkId,
          taskName: i
        };
        await axios.post(`${serverUrl}/task/create`, task);
      }
      
      console.log(res);
      setWork([...work, res.data]);
      
      nav('/');
    } catch (error) {
      console.log("error:", error);
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
            <a href={`tel:${oneWork.phoneClient}`}>{oneWork.phoneClient}</a>
            {updateWork ? <input type="text" name="phoneClient" placeholder='טלפון' /> : ""}
            <a href={`waze://?q=${encodeURIComponent(oneWork.address)}`} target="_blank">
              {oneWork.address}
            </a>
            {updateWork ? <input type="text" name="address" placeholder='כתובת' /> : ""}
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.times}>
            זמנים:

            <p>{start.toLocaleDateString()}</p>
            <p>{start.toLocaleTimeString().slice(0, -3)} - {end.toLocaleTimeString().slice(0, -3)}</p>
            {updateWork ?

              <div> <div>תאריך:</div>
                <input type="date" name="workDate" />
                <div>שעת התחלה:</div>
                <input type="time" name='beggingTime' />
                <div>שעת סיום:</div>
                <input type="time" name='endingTime' /></div> : ""}

          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.description}>
            תיאור:
            <p>{oneWork.description}</p>
            {updateWork ? <input type="text" name="description" placeholder='תיאור' /> : ""}            <div className={styles.tasks}>
              <Task updateWork={updateWork} />
            </div>
          </div>
        </div>
        <div className={styles.section}>
          ביצוע:
          {oneWork.isDone ? (
            <p className={styles.doneStatus}>בוצעה</p>
          ) : (
            <p className={styles.doneStatus}>עדיין לא בוצעה</p>
          )}
          {user && user.permission === "admin" && (
            <div className={styles.additionalInfo}>
              {updateWork ? <input type="number" name="price" placeholder='מחיר' /> : <p className={styles.price}>: {oneWork.price}</p>}
              צוות:
              <p>{teamId.teamName}</p>

              {updateWork ?
                <select name="team" onChange={(e) => setTeamId(e.target.value)}>
                  <option value={teamId}>{teamId.teamName}</option>
                  {team.map(t => (
                    <option key={t._id} value={t._id}>{t.teamName}</option>
                  ))}
                </select> : ""}

            </div>)}
        </div>
        {updateWork ?
          <form>
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
        {updateWork ? <button type="submit">שינוי</button> : ""}

      </form>

      {user && user.permission === "admin" && !updateWork && (<button onClick={() => setUpdateWork(!updateWork)}>עריכה</button>)}
      {user && user.permission === "admin" && (<button onClick={() => handleDelete()}>מחיקה</button>)}
      {user && user.permission === "admin" && (<button onClick={() => handleCopy()}>שיכפול עבודה</button>)}

    </div>
  )
}
