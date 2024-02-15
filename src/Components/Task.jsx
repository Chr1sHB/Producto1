import { useEffect, useState } from "react";
import {format} from "date-fns"
import { BsCircleFill } from "react-icons/bs";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineCalendar,
  AiOutlinePlayCircle,
  AiOutlineReload,
  AiOutlinePauseCircle,
} from "react-icons/ai";
import app from "../firebase/firebaseConfig";
import { getFirestore,updateDoc,onSnapshot,doc } from "firebase/firestore";

//Firestore Instance
const db = getFirestore(app);

function Task( { task} ) {

  //Local States
  const [localTask, setLocalTask] = useState(task);
  const [isEditing, setIsEditing] = useState(false);
  const [newTaskDescription, setNewTaskDescription] = useState(localTask.task);
  
  //Editing Handler
  const editHandler = () => {
    setIsEditing(true);
  };
  const cancelEditHandler = () => {
    setIsEditing(false);
    setNewTaskDescription(localTask.task);
  };
  const stopTaskHandler = async() => {
    try {
      const elapsed = localTask.startTime ? Date.now() - localTask.startTime : 0
      const newTotalTime = (localTask.totalTime || 0) + elapsed;
      await updateDoc(doc(db,'tasks',localTask.id),{
        status: "paused",
        endTime: Date.now(),
        totalTime: newTotalTime,
      })
      const taskDoc = doc(db,'tasks',localTask.id);
      onSnapshot(taskDoc, (docSnap) => {
        if (docSnap.exists()){
          setLocalTask({
            ...docSnap.data(),
            date:localTask.date,
            id:localTask.id,
          })
        }
      })
    }
    catch (err) {
      console.log("Error pausing task" + err.message)
    }
  };

  const renderTaskDescription =() => {};
  
  const startHandler = async () => {
    try{
      await updateDoc(doc(db,'tasks',localTask.id),{
        status: 'in_progress',
        startTime: Date.now(),
      });
      const taskDoc = doc(db,'tasks',localTask.id);
      onSnapshot(taskDoc,(docSnap) => {
        if (docSnap.exists()){
          setLocalTask({
            ...docSnap.data(),
            date: localTask.date,
            id: localTask.id
          })
        }
      })
    }
    catch(err){
      console.log("Error starting task: " + err.message)
    }
  };

  const updateHandler = () => {};

  const deleteHandler = () => {};

  const renderButtonsHandler = () => {
    switch (localTask.status) {
      case "unstarted":
        return <AiOutlinePlayCircle className="text-purple-400 text-2xl" onClick={startHandler}/>
      case "in_progress":
        return <AiOutlinePauseCircle className="text-2xl text-green-400" onClick={stopTaskHandler} />
      default:
        return <AiOutlineReload className="text-green-400 text-2xl" onClick={startHandler} />
    }
  };

  return (
    <div className="bg-white p-4 rounded-md text-black shadow-lg flex flex-col md:flex-row md:items-center justify-between">
      <div className="md:space-x-2 space-y-2 md:space-y-0">
        {/* render buttons */}
        <div className="flex items-center space-x-2">
          <AiOutlineCalendar className="text-gray-600" />
          <p className="text-gray-600">{task.task}</p>
          <p className="text-gray-600">
            {
              format(new Date(localTask.date),' do MMM yyyy')
            }
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2 justify-center">
        <BsCircleFill color={
          localTask.status === 'paused' ? 'red' : 
          localTask.status === 'in_progress' ? 'green' : 'yellow'
        } />
        <p>{task.status}</p>
      </div>
      <div className="flex items-center space-x-2 justify-center md:justify-end">
        {renderButtonsHandler()}
        <AiOutlineEdit className="text-2xl text-purple-400" />
        <AiOutlineDelete className="text-2xl text-red-500" />
      </div>
    </div>
  );
}

export default Task;