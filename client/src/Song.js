import React from 'react'
import {useEffect, useState} from "react"
import ReactModal from 'react-modal-resizable-draggable';
import axios from "axios"
import { SpotifyApi } from "./Dashboard"

export default function Song(props){
    const [open, setOpen] = useState(false);
    const [features, setFeatures] = useState({})
    const [firstRender, setFirstRender] = useState(true);

    if(firstRender){
        SpotifyApi.getAudioFeaturesForTrack(props.id).then((res) => {setFeatures(res.body)})
        setFirstRender(false);
    }

    let exp;
    if(props.explicit)
        exp = <span className="explicit inline"><span>E</span></span>;
    let tSec = props.time/1000;
    let sec = Math.trunc(tSec%60);
    sec = sec.toString().length == 1 ? "0"+sec : sec;
    let min = Math.trunc(tSec/60);

    return(
        <div className="song">
            <div className="pageClick inline" onClick={props.mainClick}>
                <img className="songCover inline" src = {props.albumUrl}/>
                <div className="songNA inline">
                    <p className="songName">{props.name}</p>
                    <p className="songArtists">{exp}{props.artists}</p>
                </div>
                <span className="songAlbum inline">{props.album}</span>
                <span className="songPop inline">{props.popularity}  </span>
                <span className="songTime inline">{min}<span>:</span>{sec}</span>
            </div>
            <div className="buttons inline">
                <div className="play inline" title="play" onClick = {props.playClick}><i className="fa-solid fa-play fa-xl playIcon inline" title='Play'></i></div>
                <div className="analysis inline" onClick = {() => setOpen(true)}><i className="fa-solid fa-calculator fa-2xl analIcon inline"></i></div>
            </div>
            <div className='songModal'>
                <ReactModal 
                    initWidth={500} 
                    initHeight={395}
                    top='100px'
                    left='100px'
                    disableResize = 'true'
                    disableKeystroke = 'true'
                    onFocus={() => console.log("Modal is clicked")}
                    className= "modal"
                    isOpen={open}>
                        <div className="songAnalysisTop inline"><p>Analysis</p></div>
                        <div className="songAnalysisBody inline">
                            <span><span>Instrumentalness:</span> {(features.instrumentalness*100).toFixed(2)}</span>
                            <span><span>Acousticness:</span> {(features.acousticness*100).toFixed(2)}</span>
                            <span><span>Danceability:</span> {(features.danceability*100).toFixed(2)}</span>
                            <span><span>Speechiness:</span> {(features.speechiness*100).toFixed(2)}</span>
                            <span><span>Liveness:</span> {(features.liveness*100).toFixed(2)}</span>
                            <span><span>Energy:</span> {(features.energy*100).toFixed(2)}</span>
                            <span><span>Time Signature:</span> {features.time_signature}</span>
                            <span><span>Loudness:</span> {features.loudness}</span>
                            <span><span>Duration:</span> {features.duration_ms}</span>
                            <span><span>Valence:</span> {features.valence}</span>
                            <span><span>Tempo:</span> {features.tempo}</span>
                            <span><span>Key:</span> {features.key}</span>
                        </div>
                        <button className='closeModal' onClick={() => setOpen(false)}>
                            Close
                        </button>
                </ReactModal>
            </div>
        </div>
    );
}