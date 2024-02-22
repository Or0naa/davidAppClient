import { useNavigate, useParams } from 'react-router-dom'
import styles from './style.module.css'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { h } from '@fullcalendar/core/preact'
import DataContext from '../../context/DataContext'

export default function TeamInfo() {
  const { serverUrl } = useContext(DataContext);

  let teamId = useParams()
  // console.log(teamId)

  const [thisTeam, setThisTeam] = useState({})
  const nav = useNavigate()

  useEffect(() => {
    const teamData = async () => {
      try {
        const res = await axios.get(`${serverUrl}/team/${teamId.teamId}`)
        setThisTeam(res.data)
      }
      catch {
        console.log("error")
      }
    }
    teamData()
  }, [])

  // console.log(thisTeam)

  const handleEmployeeClick = (user) => {
    nav(`/employees/${user._id}`)
  }


  return (
    <div className={styles.container}>
      {thisTeam && (
        <>
          <h1 className={styles.teamName}>{thisTeam.teamName}</h1>
          <ul className={styles.teamUsers}>
            {thisTeam.teamUsers && thisTeam.teamUsers.map((user) => (
              <li key={user._id} className={styles.userItem}>
                <div className={styles.userDetails} onClick={() => { handleEmployeeClick(user) }}>
                  <span className={styles.userName}>{user.eName}</span>
                  <span className={styles.userPermission}>{user.permission}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}  