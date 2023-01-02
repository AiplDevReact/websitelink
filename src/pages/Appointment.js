import React from 'react';
import Scheduler, { Resource, View, Scrolling } from 'devextreme-react/scheduler';
import { useEffect,useState } from 'react';

const Appointment = () => {

  const [data, setData] = useState([]);
  const [event, setEvent] = useState([]);
   
  useEffect(() => {
    const token = "token " + localStorage.getItem('login');
     fetch('http://103.253.15.184:8000/api/empappointmentview/?date=2022-12-24&check=day&page=1&limit=10&search=&type=staff', {
        method:'GET',
        headers: {
            "Authorization" : token
        },
    })
    .then((result) => {
      result.json().then((resp) =>{
        setData(resp.data.dataList)
        setEvent(resp.event)
      })
    })
    
  },[])

  const resource = 
    data.map(item => {
        return({id: item['id'], text: item['staff_name'], color: ''} )
      }
    );

  const appointmentText = 
    event.map(list => {
      return({
        id: list['id'],
        text: list['text'],
        startDate: list['startDate'],
        endDate: list['endDate']
      })
    })

  const getRandomDuration = (durationState) => {
    const durationMin = Math.floor((durationState % 23) / 3 + 5) * 15;
    return durationMin * 60 * 1000;
  }

  const getRandomText = (textIndex) => {
    return (appointmentText.map(i => i.text)[textIndex % appointmentText.length]);
    
  }

  const filterAppointmentsByTime = (appointmentText, startDayHour, endDayHour) => {
    const results = [];
    for (let i = 0; i < appointmentText.length; i += 1) {
      const { startDate } = appointmentText[i];
      const { endDate } = appointmentText[i];
        results.push(appointmentText[i]);
    }
  
    return results;
    
  }
  

  const generateAppointments= (startDay, endDay, startDayHour, endDayHour) => {
    const appointmentText = [];
  
    let textIndex = 0;
    let durationState = 1;
    const durationIncrement = 19;
  
    for (let i = 0; i < resource.length; i += 1) {
      let startDate = startDay;
  
      while (startDate.getTime() < endDay.getTime()) {
        durationState += durationIncrement;
        const endDate = new Date(startDate.getTime() + getRandomDuration(durationState));
        appointmentText.push({
          text: getRandomText(textIndex),
          startDate,
          endDate,
          humanId: resource[i].id,
        });  
        textIndex += 1;  
        durationState += durationIncrement;
        startDate = new Date(endDate.getTime() + getRandomDuration(durationState));
        
      }
    }
    return filterAppointmentsByTime(appointmentText, startDayHour, endDayHour);
  }
    
  const groups = ['humanId'];
  const currentDate = new Date(2021, 1, 2);
  const startDay = new Date(2021, 1, 1);
  const endDay = new Date(2021, 1, 28);
  const startDayHour = 9;  
  const endDayHour = 22;
  const appointment = generateAppointments(startDay, endDay, startDayHour, endDayHour);


  return (
    <>  
      <Scheduler
        dataSource={appointment}
        defaultCurrentView='Timeline'
        defaultCurrentDate={currentDate}
        startDayHour={startDayHour}
        endDayHour={endDayHour}
        showAllDayPanel={false}
        groups={groups}
        >
        
        <View
          type='day'
          groupOrientation='horizontal'
        />

        <View
          type='workWeek'
          groupOrientation='horizontal'
        />
        
        <View
          type='month'
          groupOrientation='horizontal'
        />
        
        <Resource 
          dataSource={resource}
          label='Employee'
          groupOrientation='horizontal'
          fieldExpr='humanId'
          />
          <Scrolling
          mode='virtual'/>
      </Scheduler>
    
    </>
  );
}

export default Appointment;
