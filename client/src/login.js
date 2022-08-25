import React from "react";
import "./login.css";

const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=9e4da4d22c754a95860f01b0d9423ead&response_type=code&redirect_uri=http://localhost:3000&scope=playlist-read-private%20playlist-read-collaborative%20streaming%20user-read-email%20user-read-private%20user-read-playback-state%20user-modify-playback-state"
export default function Login(){
   return(
    <div className="parent">
        <i><p className="title">Lyric Lookup</p></i>
        <a href={AUTH_URL}><button className="auth"><i className="fa-brands fa-spotify fa-lg spotify"></i>Log in with Spotify</button></a>
    </div>
   ); 
}