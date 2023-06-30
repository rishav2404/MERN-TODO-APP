import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Context, server } from '../main'
import { toast } from 'react-hot-toast'
import TodoItem from '../components/TodoItem'
import { Navigate } from 'react-router-dom'

const Home = () => {

  const [title,setTitle] = useState("")
  const [description,setDescription] = useState("")
  const [loading,setLoading] = useState(false)
  const [tasks , setTasks] = useState([])
  const [refresh,setRefresh] = useState(false)


  const { isAuthenticated} = useContext(Context)

  const updateHandler = async(id) =>{
    try {
      const {data} = await axios.put(`${server}/tasks/${id}`,{},{
        withCredentials: true,
      })
      toast.success(data.message)
      setRefresh(prev=>!prev)
    } catch (error) {
      toast.error(error.response.data.message)
        setLoading(false)
      }
  }


  const deleteHandler = async(id) =>{
    try {
      const {data} = await axios.delete(`${server}/tasks/${id}`,{
        withCredentials: true,
      })
      toast.success(data.message)
      setRefresh(prev=>!prev)
    } catch (error) {
      toast.error(error.response.data.message)
        setLoading(false)
      }
  }

  const submitHandler = async(e)=>{
    e.preventDefault()
    try {
      setLoading(true)
      const {data} = await axios.post(`${server}/tasks/new`,{
        title,
        description
      },{
        withCredentials: true,
        headers:{
          "Content-Type": "application/json"}
        })
        toast.success(data.message)
        setTitle("")
        setDescription("")
        setLoading(false)
        setRefresh(prev=>!prev)

      } catch (error) {
        toast.error(error.response.data.message)
        setLoading(false)
      }
 }

 useEffect(() => {
  axios.get( `${server}/tasks/my`,{
    withCredentials: true,
  }).then(res => {
    setTasks(res.data.tasks)
  }).catch(e => {
    toast.error(e.response.data.message)
  })

},[refresh])


if (!isAuthenticated) return (<Navigate to={"/login"} />)

  return (
    <div><div className='container'>
      <section >
      <form onSubmit={submitHandler} >
          <input
            type="text"
            required
            placeholder='Title' />
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          <input
            type="text"
            required
            placeholder='Description' />
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          <button disabled={loading} type='submit'>Add Task</button>
        </form>
      </section>
    </div>
    <section className='todosContainer' >
      {tasks.map((i)=>(
        <TodoItem 
        title={i.title}
        description={i.description}
        isCompleted = {i.isCompleted}
        updateHandler = {updateHandler}
        deleteHandler = {deleteHandler}
        id={i._id}
        key={i._id}
        />
      ))
      }
    </section>
    
    </div>
  )}

export default Home
