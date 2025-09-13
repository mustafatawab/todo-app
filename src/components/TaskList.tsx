'use client'
import React, { useEffect, useState } from 'react'
import Task from './Task'
import { TaskType } from '@/types/Task'

const TaskList = ({userId} : {userId : String}) => {
    const [tasks, setTasks] = useState<TaskType[]>([])

    useEffect(() => {
        const getTasks = async () => {
            const res = await fetch(`/api/task?userId=${userId}`)
            const data = await res.json()
            console.log(data)
            setTasks(data.tasks)
        }

        getTasks()
    }, [])

  return (
    <div>

        {tasks && tasks.map((task: TaskType , index : number) => <>
            <Task title={task.title} description={task.description} tags={task.tags} createdAt={task.createdAt}/>
        </>)}
    </div>
  )
}

export default TaskList