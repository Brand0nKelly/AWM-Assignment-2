import React, {useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useCookies} from 'react-cookie'
import APIService from './Api'
import Navbar from './components/Navbar';
import login from './Login'

function Home() {
const navigate = useNavigate();
const user = userToken();

if (!user) {
    navigate('/login')
}
}

return (
<div>
    <Navbar />
<br />

</div>
)