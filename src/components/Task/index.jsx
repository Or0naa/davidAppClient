import { useContext, useEffect, useState } from 'react';
import styles from './style.module.css'
import DataContext from '../../context/DataContext';
import axios from 'axios';

export default function Task({ updateWork }) {

  const { oneWork, setOneWork, serverUrl } = useContext(DataContext)

  const [tasks, setTasks] = useState([])


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (oneWork._id) {
          const response = await axios.get(`${serverUrl}/task/byWork/${oneWork._id}`);
          setTasks(response.data);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchData();
  }, [oneWork._id]);

  const handleDone = async (e) => {
    const id = e._id;
    const updateDone = !e.isDone;

    try {
      await axios.put(`${serverUrl}/task/${id}`, { isDone: updateDone });

      // Fetch the updated tasks
      await axios.get(`${serverUrl}/task/byWork/${oneWork._id}`)
        .then((response) => {
          setTasks(response.data);

          const allTasksDone = response.data.every((task) => task.isDone);

          try {
            // If all tasks are done, update the work status to "completed"
            axios.put(`${serverUrl}/work/${oneWork._id}`, { isDone: allTasksDone });
            setOneWork((prevWork) => ({ ...prevWork, isDone: allTasksDone }));
          } catch (error) {
            console.log(error);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTask = async (e) => {
    const id = e._id;
    try {
      await axios.delete(`${serverUrl}/task/${id}`);
      await axios.get(`${serverUrl}/task/byWork/${oneWork._id}`)
        .then((response) => {
          setTasks(response.data);
        })
    } catch (error) {
      console.log(error);

    }

  }

  return (
    <div className={styles.tasksContainer}>
      {tasks.map((task, index) => (
        <div className={styles.task} key={index}>
          <span onClick={() => handleDone(task)}><input type='checkbox' checked={task.isDone} /></span>
          <div className={styles.taskName}>{task.taskName}</div>
          <div className={styles.isDone}>{task.isDone}</div>
          {updateWork ? <div onClick={() => handleDeleteTask(task)}>❌</div> : ""}
        </div>
      ))}
    </div>
  )
}
