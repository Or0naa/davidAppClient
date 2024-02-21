import { useNavigate, useParams } from 'react-router-dom'
import styles from './style.module.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { h } from '@fullcalendar/core/preact'

export default function TeamInfo() {
  let teamId = useParams()
  // console.log(teamId)

  const [thisTeam, setThisTeam] = useState({})
  const nav = useNavigate()

  useEffect(() => {
    const teamData = async () => {
      try {
        const res = await axios.get(`http://localhost:4141/team/${teamId.teamId}`)
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