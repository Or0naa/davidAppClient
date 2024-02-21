import { useContext, useState } from 'react';
import axios from 'axios';
import styles from './style.module.css';
import UserContext from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import DataContext from '../../context/DataContext';

export default function AddNewWork() {
  const { team } = useContext(UserContext);
  const { work, setWork } = useContext(DataContext);
  const [teamId, setTeamId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const nav = useNavigate()

  const handleAddTask = () => {
    if (taskInput.trim() !== '') {
      setTasks([...tasks, taskInput]);
      setTaskInput('');
    }
  };

  const handleAddWork = async (e) => {
    e.preventDefault();

    const newWork = {
      // 2024-02-18T07:00:00.000Z

      beggingTime: `${e.target.workDate.value}T${e.target.beggingTime.value}:00.000Z`,
      endingTime: `${e.target.workDate.value}T${e.target.endingTime.value}:00.000Z`,
      teamId: teamId,
      price: e.target.price.value,
      address: e.target.address.value,
      phoneClient: e.target.phoneClient.value,
      clientName: e.target.clientName.value,
      description: e.target.description.value,
    };

    console.log("newWork", newWork);

    try {
      const res = await axios.post("http://localhost:4141/work/create", newWork);
      const createdWorkId = res.data._id;
      
      for (const i of tasks) {
        const task = {
          workId: createdWorkId,
          taskName: i
        };
        await axios.post("http://localhost:4141/task/create", task);
      }
      
      console.log(res);
      setWork([...work, res.data]);
      
      nav('/works')
    } catch (error) {
      console.log("error:", error);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleAddWork}>
        <div>תאריך:</div>
        <input type="date" name="workDate" />
        <div>שעת התחלה:</div>
        <input type="time" name='beggingTime' />
        <div>שעת סיום:</div>
        <input type="time" name='endingTime' />
        
        <label htmlFor="team">צוות:</label>
        <select name="team" onChange={(e) => setTeamId(e.target.value)}>
          <option value="">--בחר--</option>
          {team.map(t => (
            <option key={t._id} value={t._id}>{t.teamName}</option>
          ))}
        </select>

        <div>מחיר:</div>
        <input type="number" name='price' />
        <div>פרטי הלקוח:</div>
        <div>שם:</div>
        <input type="text" name='clientName' />
        <div>טלפון:</div>
        <input type="tel" name='phoneClient' />
        <div>כתובת:</div>
        <input type="text" name='address' />
        <div>תיאור העבודה:</div>
        <input type="text" name='description' />
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

      </form>
        <button type="submit">צור</button>
      </form>


    </div>
  );
}
