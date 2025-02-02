import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';
import { useState,useEffect } from 'react';

export function Todo({ title, is_completed, priority, id, updateTodos,deadline }) {
    const [completed, setCompleted] = useState(is_completed);
    const [remainingTime, setRemainingTime] = useState('');
    async function deleteClick() {
        const r = await fetch("http://3.109.211.104:8001/todo/" + id, {
            method: "DELETE"
        })
        const j = await r.json();
        toast.success(j.message);
        updateTodos();
    }
    async function toggleComplete() {
        try {
         
      
          const response = await fetch("http://3.109.211.104:8001/todo/" + id, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              title: title,
              description: 'string', // Replace with actual description if available
              deadline: new Date(deadline), // Convert deadline to ISO string format
              priority: priority,
              is_completed: !completed
            })
          });
      
          const updatedTodo = await response.json();
          setCompleted(updatedTodo.is_completed);
          updateTodos();
        } catch (error) {
          console.error('Failed to update todo', error);
        }
      }

      useEffect(() => {
        const calculateRemainingTime = () => {
          const deadlineDate = new Date(deadline);
          const currentDate = new Date();
          const timeDifference = deadlineDate - currentDate;
    
          if (timeDifference > 0) {
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
            setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
          } else {
            setRemainingTime('Time is up');
          }
        };
    
        calculateRemainingTime();
        const interval = setInterval(calculateRemainingTime, 1000);
    
        return () => clearInterval(interval);
      }, [deadline]);


      const formattedDeadline = (deadline && !isNaN(Date.parse(deadline)))
    ? new Date(deadline).toISOString()
    : "Invalid Date";

    return <div style={{ padding: "20px", margin: "10px", border: "1px solid black", borderRadius: "10px", backgroundColor: priority > 8 ? "rgba(255,0,0,0.3)" : "rgba(0,255,0,0.3)"}}>
        <div style={{fontSize: "30px", textDecoration: is_completed ? "line-through": ""}}>
            {is_completed ? "✅" : "⌛"}
            {title}<br/>
           <p >Priority: {priority}</p> 
        </div>
        <div style={{display:'flex', width:'100%', justifyContent:"end"}}>
        <div style={{ fontSize: "20px", marginRight: "10px" }}>
          {remainingTime}
        </div>
          
        <div onClick={toggleComplete} style={{ fontSize: "20px", cursor: "pointer", marginRight: "10px",backgroundColor:"darkblue", color:"white", padding:"5px", borderRadius:"5px" }}>
              {completed ? "Undo" : "Complete"}
            </div>
            <div onClick={deleteClick} style={{fontSize: "30px", cursor: "pointer"}}>❌</div>
        </div>
    </div>
}