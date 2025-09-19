 export const getAllTasks = async (userId : String) => {
    const res = await fetch(`/api/task?userId=${userId}`);
    // const res = await getTasks()
    const data = await res.json();
    localStorage.setItem("tasks", JSON.stringify(data.tasks));
  };