import { useContext, useEffect, useState } from 'react';
import styles from './style.module.css'
import DataContext from '../../context/DataContext';
import axios from 'axios';

export default function Task() {

  const { oneWork, setOneWork } = useContext(DataContext)
  const [tasks, setTasks] = useState([])


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (oneWork._id) {
          const response = await axios.get(`http://localhost:4141/task/byWork/${oneWork._id}`);
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
      await axios.put(`http://localhost:4141/task/${id}`, { isDone: updateDone });
      
      // Fetch the updated tasks
      await axios.get(`http://localhost:4141/task/byWork/${oneWork._id}`)
        .then((response) => {
          setTasks(response.data);
  
          const allTasksDone = response.data.every((task) => task.isDone);
  
          try {
            // If all tasks are done, update the work status to "completed"
            axios.put(`http://localhost:4141/work/${oneWork._id}`, { isDone: allTasksDone });
            setOneWork((prevWork) => ({ ...prevWork, isDone: allTasksDone }));
          } catch (error) {
            console.log(error);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <div>

      {tasks.map((task, index) => {
        return (
          <div className={styles.task} key={index}>
            <div>
              <span onClick={() => handleDone(task)}><input type='checkbox' checked={task.isDone} /></span>

              {task.taskName}</div>
            <div>{task.isDone}</div>


          </div>
        )
      })}

    </div>
  )
}
