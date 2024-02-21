import React, { useContext, useEffect, useState } from 'react';
import { formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useNavigate } from 'react-router-dom';
import heLocale from '@fullcalendar/core/locales/he'
import UserContext from '../../context/UserContext';
import axios from 'axios';
import DataContext from '../../context/DataContext';

export default function DemoApp() {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const { team, user, oneEmployee } = useContext(UserContext);
  const [teamId, setTeamId] = useState("")
  const { work, setWork } = useContext(DataContext)
  const nav = useNavigate()
  // const [initialEvents, setInitialEvents] = useState([])
  const [initialEvents, setInitialEvents] = useState([])

  let eventGuid = 0

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      nav("/login")
    }
  }, [])

  // console.log("user: ", user);
  
  useEffect(() => {
    const fetchData = async () => {
      if (user && user.permission === "admin") {
        try {
          const response = await axios.get('http://localhost:4141/work');
          if (response.data && response.data.length > 0) {
            console.log("work: ", response.data);
            setWork(response.data);
            setInitialEvents(response.data.map(w => ({
              id: w._id,
              title: w.description,
              start: w.beggingTime,
              end: w.endingTime,
              color: team.find(t => t._id === w.teamId)?.color || "#ffffff"
            })));
          }
        } catch (error) {
          console.error('Error fetching teams:', error);
        }
      }
  
      if (user && user.permission === "employee") {
        try {
          const response = await axios.get(`http://localhost:4141/employee/works/${user._id}`);
          if (response.data && response.data.length > 0) {
            setWork(response.data);
            setInitialEvents(response.data.map(w => ({
              id: w._id,
              title: w.description,
              start: w.beggingTime,
              end: w.endingTime,
              color: team.find(t => t._id === w.teamId)?.color || "#ffffff"
            })));
          }
        } catch (error) {
          console.error('Error fetching teams:', error);
        }
      }
    };
  
    fetchData();
  }, [user, oneEmployee, team]);
  
  // const initialEvents = work.map(w => {
  //   let color = team.find(t => t._id === w.teamId)?.color || "#ffffff"
  //   return {
  //     id: w._id,
  //     title: w.description,
  //     start: w.beggingTime,
  //     end: w.endingTime, // אם יש שדה תאריך סיום
  //     color: color
  //   }
  // })


  console.log("events", initialEvents)

  function createEventId() {
    return String(eventGuid++)
  }

  const handleWeekendsToggle = () => {
    setWeekendsVisible(!weekendsVisible);
  };



  const handleDateSelect = async (selectInfo) => {

    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (teamId) {
      const newEvent = {
        id: createEventId(),
        title: team.find(t => t._id === teamId)?.teamName || "No Team",
        start: selectInfo.start,
        end: selectInfo.end,
        allDay: selectInfo.allDay,
        color: team.find(t => t._id === teamId)?.color || "#ffffff", // אם הצבע לא נמצא, יש להשתמש בצבע ברירת המחדל
      };


      calendarApi.addEvent(newEvent);

      try {
        const newWork = {
          workDate: newEvent.day,
          beggingTime: newEvent.start,
          endingTime: newEvent.end,
          teamId: teamId,

        }

        const res = await axios.post("http://localhost:4141/work/create", newWork)
          .then((res) => { setWork(work.concat(res.data)) })

      }
      catch {
        console.log("error")
      }
    }
  };



  const handleEventClick = (clickInfo) => {
    // console.log(clickInfo.event.id)
    nav("/works/" + clickInfo.event.id)
    // if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //   clickInfo.event.remove();
    // }
  };

  const handleEvents = (events) => {
    setCurrentEvents(events);
  };

  const renderEventContent = (eventInfo) => (
    <>
      <p style={{ color: "black", fontSize: "0.6rem", lineHeight: "0.5" }}>
        {eventInfo.timeText}
      </p>
      <div style={{ color: "black", fontSize: "0.7rem", overflow: "hidden", lineHeight: "1" }}>
        {eventInfo.event.title}
      </div>
    </>
  );


  const today = new Date();

  const renderSidebarEvent = (event) => (
    <li key={event.id}>
      {/* {formatDate(new Date(event.start), { hour: 'numeric', minute: '2-digit', hour12: false })} */}
      <i>{event.title}</i>
      {work.map(w => (
        <div key={w._id}>
          {w._id === event.id && (
            <div>
              {w.clientName}
              {w.phoneClient}
              {w.address}
            </div>

          )}
        </div>
      ))}
      <hr />
    </li>
  );

  return (
    <div className='demo-app'>
      <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row" }}>
        {user && user.permission === "admin" && (<form>
          <h3>בחר צוות כדי להוסיף לו עבודה:</h3>

          <select name="team" onChange={(e) => setTeamId(e.target.value)}>
            <option value="">--בחר--</option>
            {team.map(t => (
              <option key={t._id} value={t._id}>{t.teamName}</option>
            ))}
          </select>
        </form>)}
        {handlePostpone()}
      </div> <div className='demo-app-main'>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            // center: 'title',
            // right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          initialView='timeGridWeek'
          // now={new Date("2024-02-20T09:44:00.000Z")}

          locale={heLocale}
          nowIndicator={true}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          // initialEvents={initialEvents} // alternatively, use the `events` setting to fetch from a feed
          events={initialEvents}

          slotMinTime="08:00"
          slotMaxTime="24:00"
          height={'90vh'}
          select={handleDateSelect}
          eventContent={renderEventContent} // custom render function
          eventChange={handleEventChange}
          eventClick={handleEventClick}
          eventsSet={handleEvents} // called after events are initialized/added/changed/removed

        />
      </div>
      {renderSidebar()}
    </div>
  );

  async function handleEventChange(event) {

    let newEvent = {
      beggingTime: event.event.start,
      endingTime: event.event.end,
    };

    // console.log("newEvent", newEvent)
    if (user.permission !== "admin") {
      return;
    }
    else {

      try {
        const res = await axios.put(`http://localhost:4141/work/${event.event.id}`, newEvent);
        console.log("Work updated successfully", res);
      } catch (error) {
        console.error("Error updating work:", error);
      }
    }

  }



  function renderSidebar() {
    return (
      <div className='demo-app-sidebar'>
        <div className='demo-app-sidebar-section'>

        </div>
        <div>
          <h2>עבודות היום:</h2>
          <h3>{formatDate(today, { weekday: 'long' })}</h3>
          <h3>{formatDate(today, { month: 'long', day: 'numeric' })}</h3>
          <ul>
            {currentEvents
              .filter(e => new Date(e.start).toDateString() === today.toDateString())
              .sort((a, b) => new Date(a.start) - new Date(b.start)) // מיון לפי התאריך והשעה
              .map(renderSidebarEvent)}
          </ul>

        </div>
      </div>
    );
  }



  function handlePostpone() {
    const postponedEvents = currentEvents
      .filter((e) => {
        const relatedWork = work.find((w) => w._id === e.id);

        // Filter events based on conditions
        return (
          relatedWork &&
          new Date(e.end) < today && // Check if the event end date is before today
          relatedWork.isDone === false // Check if the work is not done
        );
      })
      .sort((a, b) => new Date(a.start) - new Date(b.start)); // Sort by date and time

    return (
      <div>
        {postponedEvents.length > 0 ? <h2 style={{ backgroundColor: "red", borderRadius: "10%", padding: "1%", display: "flex", justifyContent: "center" }} >עבודות שעדיין לא הושלמו</h2> : ""}
        <ul>
          {postponedEvents.map(renderSidebarEvent)}
        </ul>
      </div>
    );
  }



}