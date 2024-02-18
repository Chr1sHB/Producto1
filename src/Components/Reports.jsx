import { useEffect, useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { Link } from "react-router-dom";
import Task from "./Task";
import { getAuth } from "firebase/auth";
import { QuerySnapshot, collection, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import app from "../firebase/firebaseConfig";
import { addMilliseconds, endOfDay, endOfMonth, format, isWithinInterval, startOfMonth, startOfWeek } from "date-fns";

//Get Auth from User Account
const auth = getAuth(app);
console.log(auth);
//Get DB
const db = getFirestore(app)


function Reports() {

  //States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [thisWeekTotal, setWeekTotal] = useState(0);
  const [thisMonthTotal, setMonthTotal] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  //Fetching the data of the tasks

  useEffect ( () => {
    const fetchData = () => {
      try {
        setLoading(true);
        setError(null);
        //Check if the user has logged in
        if (auth.currentUser){
          console.log("User logged in");
          const q = query(collection(db,"tasks"), where('userId',"==", auth.currentUser.uid));
          //Snapshot 
          const unSuscribe = onSnapshot(q,(querySnapshot)=>{
            if(querySnapshot.docs.length){
              let weekTotal = 0;
              let monthTotal = 0;
              let total = 0;
              const now = new Date();
              const weekStart = startOfWeek(now);
              const weekEnd = endOfDay(now);
              const monthStart = startOfMonth(now);
              const mothEnd = endOfMonth(now);

              querySnapshot.docs.forEach((doc)=>{
                const data = doc.data();
                const taskDate = new Date(data.startTime);
                const taskTime = data.totalTime || 0;
                if (isWithinInterval(taskDate, {start: weekStart, end: weekEnd})){
                  weekTotal +=  taskTime;
                }
                if (isWithinInterval(taskDate,{start: monthStart,end: mothEnd})){
                  monthTotal += taskTime;
                }
                total += taskTime;
              })
              //Update the states
              setWeekTotal(weekTotal);
              setMonthTotal(monthTotal);
              setTotalTime(total);
              setTasks(
                querySnapshot.docs.map((doc)=>{
                  return {
                    ...doc.data(),
                    id: doc.id,
                    date: new Date(doc.data().startTime).toISOString(),
                  }
                })
              );
            }
          });
          return unSubscribe;
        }
        else { 
          setError('Please log into your Account');
          setLoading(false); 
        }

      }
      catch (err) {
        setError(err.message);
        setLoading(false);
        return () => {};
      }
    };

    const unSubscribe = fetchData();

    return () => {
      if (unSubscribe) {
        unSubscribe();
      }
    }
    
  },[]);
  
  //Format Time
  const formatTime = (timeInMillis) => {
    const date = addMilliseconds(new Date(0),timeInMillis);
    return format(date,'HH:mm:ss');
  }

  //Export Tasks
  const exportTasks = () => {
    //Fetch data
    const exportData = tasks.map((task) => {
      return {
        name:task.task,
        date: format(new Date(task.date),'do MMM yyy'),
        status: task.status
      }
    });
    //Export to CSV file
    const csvContent = "data:text/csv;charset=utf-8," + exportData.map((row) => Object.values(row).join(",")).join("\n");
    //Download tasks CSV
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.target = "_blank";
    link.download = "tasks.csv";
    link.click();
  }

  //Log Out Handler
  const logOutHandler = () =>{
    auth.signOut();
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <div className="container mx-auto px-4 py-10">
        <header className="flex justify-between py-6">
          <h1 className="text-4xl font-bold text-white">Time Tracker</h1>
          <button className="text-white" title="Logout">
            <AiOutlineLogout className="text-2xl"  onClick={logOutHandler}/>
          </button>
        </header>
        <div className="bg-white p-4 my-6 rounded-md text-black max-w-md mx-auto">
          <h2 className="text-lg font-semibold mb-2">User Profile</h2>
          <div className="flex items-center">
            <img className="h-16 w-16 rounded-full" src={auth.currentUser.photoURL} alt="profile" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold">{auth.currentUser.displayName || "User Name"}</h3>
              <p className="text-gray-600">{auth.currentUser.email}</p>
              <p className="text-gray-600">Last Login: {auth.currentUser.metadata.lastSignInTime}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-center mb-8">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-md text-white shadow-lg">
            <h2 className="text-lg font-semibold">This Week</h2>
            <p className="text-2xl font-bold">{formatTime(thisWeekTotal)}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-4 rounded-md text-white shadow-lg">
            <h2 className="text-lg font-semibold">This Month</h2>
            <p className="text-2xl font-bold">{formatTime(thisMonthTotal)}</p>
          </div>
          <div className="bg-gradient-to-r from-red-400 to-yellow-500 p-4 rounded-md text-white shadow-lg">
            <h2 className="text-lg font-semibold">Total</h2>
            <p className="text-2xl font-bold">{formatTime(totalTime)}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-400 to-yellow-500 p-4 rounded-md shadow-lg max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between mb-4">
            <Link
              to="/create-task"
              className="w-full sm:w-auto bg-gradient-to-r sm:mr-4 mb-4 sm:mb-0 from-red-500 to-pink-500 p-2 rounded text-white"
            >
              Add New Task
            </Link>
            <button className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded text-white" onClick={exportTasks}>
              Export
            </button>
          </div>

          <div className="space-y-4">
            {tasks.map((task) =>(
              <Task key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;