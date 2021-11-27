import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import { getSchedule } from "../../helper/API";

const Calendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    let assignments = [];
    let tests = [];

    getSchedule().then(data => {
      console.log(data)
      data.forEach(course => {
        course.assignments.forEach(asg => {
          assignments.push({ title: asg.title, date: asg.dueDate})
        });
        course.tests.forEach(tst => {
          tests.push({ title: tst.title, start: tst.startTime})
        })
      });

      const newData = assignments.concat(tests);
      console.log(newData);
      setEvents(newData);

    }).catch(err => console.log(err));
  }, []);

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridWeek"
      events={events}
    />
  );
};

export default Calendar;
