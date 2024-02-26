import { Route, Routes } from 'react-router-dom'
import Calendar from './pages/Calendar'
import DataContext from './context/DataContext'
import UserContext from './context/UserContext'
import { useEffect, useState } from 'react'
import Header from './components/Header'
import Login from './pages/Login'
import AllWorks from './components/AllWorks'
import Employees from './components/Employees'
import axios from 'axios'
import OneWork from './pages/OneWork'
import NewTeam from './pages/NewTeam'
import TeamInfo from './pages/TeamInfo'
import AddNewWork from './pages/AddNewWork'
import EmployeeDetalse from './pages/EmployeeDetalse'
export default function App() {

  // const serverUrl = "https://davidapp.onrender.com"
    const serverUrl = 'http://localhost:4141'

  const [employees, setEmployees] = useState([])
  const [oneEmployee, setOneEmployee] = useState({})

  const [user, setUser] = useState(null)
  const [team, setTeam] = useState([])
  const [work, setWork] = useState([])
  const [oneWork, setOneWork] = useState({})

  useEffect(() => {
    // הבאת המשתמש מה-LocalStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));

    // אם יש משתמש שמאוחסן, עדכון של הסטייט
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${serverUrl}/team`);
        setTeam(response.data);
        console.log("team: ", response.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchData();
  }, []);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(`${serverUrl}/work`);
  
  //       if (user.permission !== 'admin') {
  //         // יצירת מערך עם כל הצוותים שבהם נמצא העובד
  //         const teamsOfUser = team.filter(team => team.teamUsers.some(u => u._id === user._id));
  
  //         // בדיקה אם יש צוותים שבהם נמצא העובד
  //         if (teamsOfUser.length > 0) {
  //           const filteredData = [];
  
  //           // עבור על כל הצוותים
  //           teamsOfUser.forEach(teamOfUser => {
  //             // סנון והוספה של העבודות ששייכות לצוות זה
  //             const teamWork = response.data.filter(element => element.teamId === teamOfUser._id);
  //             filteredData.push(...teamWork);
  //           });
  
  //           setWork(filteredData);
  //         } else {
  //           setWork([]);
  //         }
  //       } else {
  //         setWork(response.data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching teams:', error);
  //     }
  //   };
  
  //   fetchData();
  // }, [employees._id, employees.permission, team]);
  
  

  // console.log(oneWork)


  return (
    <div>
      <UserContext.Provider value={{ employees, setEmployees, team, setTeam, user, setUser, oneEmployee, setOneEmployee }}>
        <DataContext.Provider value={{ work, setWork, oneWork, setOneWork, serverUrl }}>
          <Header />
          <Routes>
            <Route path='/' element={<Calendar />} />
            <Route path='/calendar' element={<Calendar />} />
            <Route path='/login' element={<Login />} />
            <Route path='/works' element={<AllWorks />} />
            <Route path='/works/:workId' element={<OneWork />} />
            <Route path='/employees' element={<Employees />} />
            <Route path='/employees/:empId' element={<EmployeeDetalse />} />
            <Route path='/newteam' element={<NewTeam />} />
            <Route path='/teamInfo/:teamId' element={<TeamInfo />} />
            <Route path='/addNewWork' element={<AddNewWork />} />


          </Routes>
        </DataContext.Provider>
      </UserContext.Provider>
    </div>
  )
}
