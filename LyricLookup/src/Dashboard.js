import {useEffect, useState} from "react"
import React from 'react'
import useAuth from './useAuth'
import SpotifyWebApi from "spotify-web-api-node"
import axios from "axios"
import "./Dashboard.css"
import { useColor } from 'color-thief-react'



const SpotifyApi = new SpotifyWebApi({
    clientId: '9e4da4d22c754a95860f01b0d9423ead'
});

export default function Dashboard(props) {
    const accessToken = useAuth(props.code);
    const [input, setInput] = useState("");
    const [result, setResult] = useState([]);
    const [selected, setSelected] = useState(undefined);
    const [next, setNext] = useState("");
    const [page, setPage] = useState(1);
    const [stop, setStop] = useState(false);


    useEffect(() => {
        if(!accessToken) return;
        SpotifyApi.setAccessToken(accessToken);
    }, [accessToken]);

    useEffect(() =>{
        if(!input) return setResult([]);
        if(!accessToken) return;

        let cancel = false;
        SpotifyApi.searchTracks(input).then((res) => {
            if(cancel) return;
            setNext(res.body.tracks.next);
            console.log(res.body);
            if(res.body.tracks.items.length === 0)
                    setResult([<NoResults/>])
            else{
                setResult(res.body.tracks.items.map((item) => {
                    const image = item.album.images.reduce((acc, elem) => {
                        if(elem.height < acc.height)
                            return elem;
                        return acc;
                    }, item.album.images[0]);
                    const imageBig = item.album.images.reduce((acc, elem) => {
                        if(elem.height > acc.height)
                            return elem;
                        return acc;
                    }, item.album.images[0]);
                    return(
                        <li key = {item.id} className="songElement">
                            <Song key = {item.id}
                            name = {item.name}
                            album = {item.album.name}
                            artists = {item.artists.map((elem, i, arr) => {return i==arr.length-1 ? (<span>{elem.name}</span>) : (<span>{elem.name}, </span>)})}
                            uri = {item.uri}
                            albumUrl = {image.url}
                            popularity = {item.popularity}
                            time = {item.duration_ms}
                            explicit = {item.explicit}
                            mainClick = {() => {
                                setSelected(
                                    <SongPage 
                                        name = {item.name}
                                        album = {item.album.name}
                                        artists = {item.artists.map((elem, i, arr) => {return i==arr.length-1 ? (<span>{elem.name}</span>) : (<span>{elem.name}, </span>)})}
                                        uri = {item.uri}
                                        albumUrl = {imageBig.url}
                                        popularity = {item.popularity}
                                        time = {item.duration_ms}
                                        explicit = {item.explicit}
                                        backClick = {() => {setSelected(undefined)}}
                                    />
                                )}
                            }
                            />
                        </li>
                    );
                }))
            };
        })
        setStop(true);
        setPage(1);
        return () => cancel = true;
    }, [input, accessToken]);

    useEffect(() =>{setStop(false);}, [stop])

    useEffect(() => {
        if(!accessToken) return;
        if(stop){
            return;
        }
        const auth = {
            headers: {
                Authorization: "Bearer "+accessToken
            },
            timeout: 5000
        };
        let cancel = false;
        let timeout = true;
        let url = "";
        url += next.substring(0, next.length-11);
        url += (page-1) * 20;
        url += next.substring(next.length-9, next.length);
        axios
            .get(url, auth)
            .then(res => {
                timeout = false;
                if(cancel) return;
                console.log(res.data)
                if(res.data.tracks.items.length === 0)
                    setResult([<NoResults/>])
                else{
                    setResult(res.data.tracks.items.map((item) => {
                        const image = item.album.images.reduce((acc, elem) => {
                            if(elem.height < acc.height)
                                return elem;
                            return acc;
                        }, item.album.images[0]);
                        const imageBig = item.album.images.reduce((acc, elem) => {
                            if(elem.height > acc.height)
                                return elem;
                            return acc;
                        }, item.album.images[0]);
                        return(
                            <li key = {item.id} className="songElement">
                                <Song key = {item.id}
                                name = {item.name}
                                album = {item.album.name}
                                artists = {item.artists.map((elem, i, arr) => {return i==arr.length-1 ? (<span>{elem.name}</span>) : (<span>{elem.name}, </span>)})}
                                uri = {item.uri}
                                albumUrl = {image.url}
                                popularity = {item.popularity}
                                time = {item.duration_ms}
                                explicit = {item.explicit}
                                mainClick = {() => {
                                    setSelected(
                                        <SongPage 
                                            name = {item.name}
                                            album = {item.album.name}
                                            artists = {item.artists.map((elem, i, arr) => {return i==arr.length-1 ? (<span>{elem.name}</span>) : (<span>{elem.name}, </span>)})}
                                            uri = {item.uri}
                                            albumUrl = {imageBig.url}
                                            popularity = {item.popularity}
                                            time = {item.duration_ms}
                                            explicit = {item.explicit}
                                            backClick = {() => {setSelected(undefined)}}
                                        />
                                    )}
                                }
                                />
                            </li>
                        );
                    }))
                };
        }).finally(() => {
            if(timeout && !cancel)
                setResult([<TimeOut/>])
        })
        return () => cancel = true;
    }, [page]);

    let invisible = {}
    let invisible2 = {}
    if(result.length < 2){
        invisible = {
            display: 'none'
        }
        invisible2 = {
            display: 'none'
        }
    }
    if(result.length === 1 && page!=1){
        invisible2={}
    }
    if(selected){
        return (
            <div>
                {selected}
            </div>
            )
    }
    let pages = [];
    if(page<11){
        for(let i=1; i<11; i++){
            let temp = {}
            if(i === page)
                temp = {color: '#1DB954', fontSize: '20px'}
            pages.push(<span className="pages inline" style={temp} onClick={() => setPage(i)}>{i}</span>)
        }
    }
    else{
        pages.push(<span className="pages inline" onClick={() => setPage(1)}>1</span>);
        pages.push(<span className="pagesDots inline" >...</span>);
        let index = Math.trunc(page/10);
        if(page%10 === 0)
            index--;
        index = index + "1";
        index = parseInt(index);
        for(let i=index; i<index+10; i++){
            let temp = {}
            if(i === page)
                temp = {color: '#1DB954', fontSize: '20px'}
            pages.push(<span className="pages inline" style={temp} onClick={() => setPage(i)}>{i}</span>)
        }
        pages.push(<span className="pagesDots inline" >...</span>);
        pages.push(<span className="pages inline" onClick={() => setPage(index+19)}>{index+19}</span>);
    }
    return(
    <div>
        <div className="dashTop">
            <p className="dashTitle">Lyric Lookup</p>
        </div>
        <div className="dashSearch">
            <div className="search">
                <i className="fa-solid fa-magnifying-glass fa-lg searchIcon"></i>
                <input 
                className="input"
                type="search" 
                placeholder="Search Songs..." 
                value={input} 
                onChange={(event) => {setInput(event.target.value);}}/>
            </div>
            <div className="searchBlock" style={invisible}></div>
            <div className="listCats" style={invisible}>
                <span className="catTitle inline">Title</span>
                <span className="catAlbum inline">Album</span>
                <span className="catPop inline">Popularity Score</span>
                <i className="fa-solid fa-clock catTime inline"></i>      
            </div>
            <div className="catBreak" style={invisible}></div>
            <ul className="songList">
                {result}
            </ul>
            <div className="dashBottom">
                <button className="dashNP prev inline" style={invisible2} onClick ={() => {if(page>1) setPage(page-1)}}>Prev</button>
                <span className="dashPage inline" style={invisible2}>{pages}</span>
                <button className="dashNP next inline" style={invisible2} onClick={() => {setPage(page+1)}}>Next</button>
            </div>
        </div>
    </div>
    )
}

function Song(props){
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
                    <p className="songName">{props.name.indexOf("(") === -1 ? props.name : props.name.substring(0, props.name.indexOf("("))}</p>
                    <p className="songArtists">{exp}{props.artists}</p>
                </div>
                <span className="songAlbum inline">{props.album.indexOf("(") === -1 ? props.album : props.album.substring(0, props.album.indexOf("("))}</span>
                <span className="songPop inline">{props.popularity}  </span>
                <span className="songTime inline">{min}<span>:</span>{sec}</span>
            </div>
            <div className="buttons inline">
                <i onClick = {() => {console.log("hey")}} className="fa-solid fa-play fa-xl playIcon inline"></i>
                <div onClick = {() => {console.log("hey")}} className="play inline"></div>
                <div className="analysis inline"><i className="fa-solid fa-calculator fa-2xl analIcon inline"></i></div>
            </div>
        </div>
    );
}

function SongPage(props){
    let {data, loading, error} = useColor(props.albumUrl, 'hex',{crossOrigin: 'anonymous', quality: '50'})
    data = data +"";
    let red = parseInt(data.substring(1,3), 16);
    let green = parseInt(data.substring(3,5), 16);
    let blue = parseInt(data.substring(5,7), 16);
    let primaryColor = (red*0.299 + green*0.587 + blue*0.114) > 130 ? '#000000' : '#ffffff';
    let secondaryColor = (red*0.299 + green*0.587 + blue*0.114) > 130 ? '#333' : '#aaaaaa';

    let artIcon;
    let albMargin;
    if(props.artists.length === 1){
        artIcon = <i class="fa-solid fa-user fa-sm userIcon"></i>;
        albMargin = {margin: '0px 8.5px 0px 15px'}
    }
    else{
        artIcon = <i class="fa-solid fa-users fa-sm usersIcon"></i>;
        albMargin = {margin: '0px 11px 0px 15.5px'}
    }
    
    let exp;
    if(props.explicit)
        exp = <span className="explicit inline"><span>E</span></span>;
    let tSec = props.time/1000;
    let sec = Math.trunc(tSec%60);
    sec = sec.toString().length == 1 ? "0"+sec : sec;
    let min = Math.trunc(tSec/60);
    return(
        <div className='pageTopTop' style={{ background: `linear-gradient(${data} 280px, #191414 450px)`, color: primaryColor}}>
            <div className="pageTop" style={{background: data}}>
                <div className="pageArr inline" onClick={props.backClick}><i className="fa-solid fa-arrow-left fa-2xl inline"></i></div>
                <img className="pageCover inline" src = {props.albumUrl}/>
                <div className="pageNAA inline">
                    <p className="pageName">{props.name.indexOf("(") === -1 ? props.name : props.name.substring(0, props.name.indexOf("("))}</p>
                    <p className="pageAlbum" style={{color: secondaryColor}}>
                        <i className="fa-solid fa-compact-disc fa-sm albumIcon inline" style = {albMargin}></i>
                        {props.album.indexOf("(") === -1 ? props.album : props.album.substring(0, props.album.indexOf("("))}
                    </p>
                    <div className="pageArtists" style={{color: secondaryColor}}>{artIcon}{props.artists}</div>
                </div>
            </div>
            <div className="pageLyrics">

            </div>
        </div>
    )
}

function TimeOut(props){
    return(
        <div className="error">
            <p>Your Search Timed Out</p>
            <p>Please Try Again</p>
        </div>
    )
}

function NoResults(props){
    return(
        <div className="error">
            <p>No Results</p>
            <p>Please Try Again</p>
        </div>
    )
}