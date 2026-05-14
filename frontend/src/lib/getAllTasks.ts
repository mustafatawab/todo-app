 export const getAllTasks = async (userId : String) => {
    const res = await fetch(`/api/task?userId=${userId}`);
    const data = await res.json();
    localStorage.setItem("tasks", JSON.stringify(data.tasks));
    return data;
  };