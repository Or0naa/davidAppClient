import { useParams } from 'react-router-dom'
import styles from './style.module.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function TeamInfo() {
  let teamId = useParams()
  // console.log(teamId)

  const [thisTeam, setThisTeam] = useState({})

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

  console.log(thisTeam)

  return (
    <div>
      {thisTeam && (
        <>
          <h1>{thisTeam.teamName}</h1>
          {thisTeam.teamUsers && thisTeam.teamUsers.map((user) => (
            <div key={user._id}>{user.eName}, {user.permission}</div>
          ))}
        </>
      )}
    </div>
  );
          }  
