import {useEffect, useState} from "react"
import React from 'react'
import SpotifyPlayer from "react-spotify-web-playback"
import axios from "axios"
import { useColor } from 'color-thief-react'
import { SpotifyApi } from "./Dashboard"

export default function SongPage(props){
    const [lyrics, setLyrics] = useState("")
    const [features, setFeatures] = useState({})
    const [firstRender, setFirstRender] = useState(true);
    const [lock, setLock] = useState(false);
    
    let {data, loading, error} = useColor(props.albumUrl, 'hex',{crossOrigin: 'anonymous', quality: '50'})
    data = data +"";
    let red = parseInt(data.substring(1,3), 16);
    let green = parseInt(data.substring(3,5), 16);
    let blue = parseInt(data.substring(5,7), 16);
    let primaryColor = (red*0.299 + green*0.587 + blue*0.114) > 130 ? '#000000' : '#ffffff';
    let oppPrimaryColor = (red*0.299 + green*0.587 + blue*0.114) > 130 ?  '#ffffff' : '#000000';
    let secondaryColor = (red*0.299 + green*0.587 + blue*0.114) > 130 ? '#333' : '#aaaaaa';

    const artist = props.artist.indexOf("(") === -1 ? props.artist : props.artist.substring(0, props.artist.indexOf("("));
    if(firstRender){
        setFirstRender(false);
        axios
            .get('http://localhost:3001/lyrics', {
                params: {
                    track: props.name,
                    artist: artist,
                },
                })
                .then(res => {
                    setLyrics(res.data.lyrics);
                })
        SpotifyApi.getAudioFeaturesForTrack(props.id).then((res) => {setFeatures(res.body)})
    }

    let artIcon;
    let albMargin;
    if(props.artists.length === 1){
        artIcon = <i className="fa-solid fa-user fa-sm userIcon"></i>;
        albMargin = {margin: '0px 8.5px 0px 15px'}
    }
    else{
        artIcon = <i className="fa-solid fa-users fa-sm usersIcon"></i>;
        albMargin = {margin: '0px 11px 0px 15.5px'}
    }
    
    let exp;
    if(props.explicit)
        exp = <span className="explicit inline"><span>E</span></span>;

    let analysisStyle = {color: primaryColor, backgroundColor: oppPrimaryColor+"77"};
    if(lock){
        analysisStyle.height = '280px';
        analysisStyle.width = '350px';
        analysisStyle.visibility = 'visible';
    }
    return(
        <div className='pageTopTop' style={{ background: `linear-gradient(${data} 150px, #191414 400px)`, color: primaryColor}}>
            <div className="pageTop">
                <div className="pageArr inline" onClick={props.backClick}><i className="fa-solid fa-arrow-left fa-2xl inline"></i></div>
                <img className="pageCover inline" src = {props.albumUrl}/>
                <div className="pageNAA inline">
                    <p className="pageName">{props.name}</p>
                    <p className="pageAlbum" style={{color: secondaryColor}}>
                        <i className="fa-solid fa-compact-disc fa-sm albumIcon inline" style = {albMargin}></i>
                        {props.album}
                    </p>
                    <div className="pageArtists" style={{color: secondaryColor}}>{artIcon}{props.artists}</div>
                </div>
                <div className="pageAnalysis inline" style={analysisStyle} onClick={() => {setLock(!lock)}}>
                    <div className="pageAnalysisTop inline"><p>Analysis</p></div>
                    <div className="pageAnalysisBody inline">
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
                </div>
            </div>
            <div className="pageLyrics" style={{whiteSpace: 'pre'}}>
                {lyrics}
            </div>
            <div className="playbackDiv">
                <SpotifyPlayer 
                    token={props.token}
                    play={true}
                    autoPlay={false}
                    uris={props.uri ? [props.uri] : []}
                    styles={{
                        bgColor: '#1d1717',
                        color: '#fff',
                        loaderColor: 'grey',
                        sliderColor: '#1DB954',
                        trackArtistColor: '#a5a5a5',
                        trackNameColor: '#fff',
                        sliderTrackColor: 'grey'
                        }}
                    />
            </div>
        </div>
    )
}