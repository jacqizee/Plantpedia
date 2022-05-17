import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useNavigate, useParams } from 'react-router-dom'

const Home = () => {


  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get('/api/plants/') // * <-- replace with your endpoint
      console.log(data)
    }
    getData()
  })

  return (
    <>
      <h1>Home!</h1>
      <Link to="/">Back to home</Link>
    </>
  )
}

export default Home