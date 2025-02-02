import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { Todo } from "./Todo";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { CreateTodoModal } from "./CreateTodoModal";
import toast from 'react-hot-toast';

export function Dashboard() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    const [todolist, setTodoList] = useState([]);
    const [search, setSearch] = useState("");
    const [priorityVal, setPriorityVal] = useState("");
    const [sortCriteria, setSortCriteria] = useState(''); 

    async function getTodos() {
        const r = await fetch("http://3.109.211.104:8001/todos");
        const j = await r.json();
        setTodoList(j);
        console.log(j);
    }

    useEffect(() => {
        if (!username) navigate("/login");
        getTodos();
    }, [])

    function logoutClick() {
        localStorage.removeItem("username");
        toast.success("Logged out successfully");
        navigate("/login");
    }

    function filterTodos() {
        return todolist.filter(todo => {
            const matchesSearch = todo.title.toLowerCase().includes(search.toLowerCase());
            const matchesPriority = priorityVal ? todo.priority === parseInt(priorityVal) : true;
            return matchesSearch && matchesPriority;
        });
    }

    const sortTodos = (todos) => {
        return todos.sort((a, b) => {
            switch (sortCriteria) {
                case 'creationTime':
                    return new Date(a.creationTime) - new Date(b.creationTime);
                case 'deadline':
                    return new Date(a.deadline) - new Date(b.deadline);
                case 'priority':
                    return b.priority - a.priority;
                default:
                    return 0;
            }
        });
    };

    function handleSortChange(event) {
        setSortCriteria(event.target.value);
    }

    const filteredAndSortedTodos = sortTodos(filterTodos()); // First filter, then sort

    return <>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
            <div style={{ width: "500px" }}>
                <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
                    <h1>Welcome, {username}!</h1>
                    <div>
                        <Button variant="outlined" size="large" color="error" onClick={logoutClick}>Logout</Button>
                    </div>
                </div>
                <div style={{ padding: "10px" }}>
                    <TextField fullWidth placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div style={{ padding: "10px" }}>
                    <TextField fullWidth placeholder="Enter priority to search" value={priorityVal} onChange={e => setPriorityVal(e.target.value)} />
                </div>

                <div>
                    <select onChange={handleSortChange} value={sortCriteria}>
                        <option value="creationTime">Sort by Creation Time</option>
                        <option value="deadline">Sort by Deadline</option>
                        <option value="priority">Sort by Priority</option>
                    </select>

                    <div>
                        {filteredAndSortedTodos.map((value) => (
                            <Todo
                                key={value.id}
                                title={value.title}
                                priority={value.priority}
                                is_completed={value.is_completed}
                                id={value.id}
                                updateTodos={getTodos}
                            />
                        ))}
                    </div>
                </div>

                <br />
                <br />
                <CreateTodoModal updateTodos={getTodos} />
            </div>
        </div>
    </>
}
