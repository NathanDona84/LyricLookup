import {useEffect, useState} from "react"
import React from 'react'
import SpotifyWebApi from "spotify-web-api-node"
import axios from "axios"
import SpotifyPlayer from "react-spotify-web-playback"
import "./Dashboard.css"
import useAuth from './useAuth'
import Song from './Song'
import SongPage from "./SongPage"
import  {NoResults} from "./Errors"
import  {TimeOut}  from "./Errors"



export const SpotifyApi = new SpotifyWebApi({
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
    const [playback, setPlayback] = useState(undefined);


    useEffect(() => {
        if(!accessToken) return;
        SpotifyApi.setAccessToken(accessToken);
    }, [accessToken]);

    useEffect(() =>{
        setPlayback(undefined)
        if(!input) return setResult([]);
        if(!accessToken) return;

        let cancel = false;
        SpotifyApi.searchTracks(input).then((res) => {
            if(cancel) return;
            setNext(res.body.tracks.next);
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
                    const name = item.name.indexOf("(") === -1 ? item.name : item.name.substring(0, item.name.indexOf("("));
                    const album = item.album.name.indexOf("(") === -1 ? item.album.name : item.album.name.substring(0, item.album.name.indexOf("("));
                    const artists = item.artists.map((elem, i, arr) => {return i==arr.length-1 ? (<span>{elem.name}</span>) : (<span>{elem.name}, </span>)});
                    return(
                        <li key = {item.id} className="songElement">
                            <Song key = {item.id}
                            name = {name}
                            album = {album}
                            id = {item.id}
                            artists = {artists}
                            uri = {item.uri}
                            albumUrl = {image.url}
                            popularity = {item.popularity}
                            time = {item.duration_ms}
                            explicit = {item.explicit}
                            playClick = {() => {
                                setPlayback(<SpotifyPlayer 
                                                token={accessToken}
                                                play={true}
                                                autoPlay={true}
                                                uris={item.uri ? [item.uri] : []}
                                                styles={{
                                                    bgColor: '#1d1717',
                                                    color: '#fff',
                                                    loaderColor: 'grey',
                                                    sliderColor: '#1DB954',
                                                    trackArtistColor: '#a5a5a5',
                                                    trackNameColor: '#fff',
                                                    sliderTrackColor: 'grey'
                                                  }}
                                            />)
                            }}
                            mainClick = {() => {
                                setPlayback(undefined);
                                setSelected(
                                    <SongPage 
                                        name = {name}
                                        album = {album}
                                        artists = {artists}
                                        accessToken = {accessToken}
                                        artist = {item.artists[0].name}
                                        uri = {item.uri}
                                        albumUrl = {imageBig.url}
                                        popularity = {item.popularity}
                                        time = {item.duration_ms}
                                        explicit = {item.explicit}
                                        token = {accessToken}
                                        id = {item.id}
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
        setPlayback(undefined)
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

                        const name = item.name.indexOf("(") === -1 ? item.name : item.name.substring(0, item.name.indexOf("("));
                        const album = item.album.name.indexOf("(") === -1 ? item.album.name : item.album.name.substring(0, item.album.name.indexOf("("));
                        const artists = item.artists.map((elem, i, arr) => {return i==arr.length-1 ? (<span>{elem.name}</span>) : (<span>{elem.name}, </span>)});
                        
                        
                        return(
                            <li key = {item.id} className="songElement">
                                <Song key = {item.id}
                                name = {name}
                                album = {album}
                                artists = {artists}
                                id = {item.id}
                                uri = {item.uri}
                                albumUrl = {image.url}
                                popularity = {item.popularity}
                                time = {item.duration_ms}
                                explicit = {item.explicit}
                                playClick = {() => {
                                    setPlayback(<SpotifyPlayer 
                                                    token={accessToken}
                                                    play={true}
                                                    autoPlay={true}
                                                    uris={item.uri ? [item.uri] : []}
                                                    styles={{
                                                        bgColor: '#1d1717',
                                                        color: '#fff',
                                                        loaderColor: 'grey',
                                                        sliderColor: '#1DB954',
                                                        trackArtistColor: '#a5a5a5',
                                                        trackNameColor: '#fff',
                                                        sliderTrackColor: 'grey'
                                                      }}
                                                />)
                                }}
                                mainClick = {() => {
                                    setPlayback(undefined);
                                    setSelected(
                                        <SongPage 
                                            name = {name}
                                            album = {album}
                                            artists = {artists}
                                            accessToken = {accessToken}
                                            artist = {item.artists[0].name}
                                            uri = {item.uri}
                                            albumUrl = {imageBig.url}
                                            popularity = {item.popularity}
                                            time = {item.duration_ms}
                                            explicit = {item.explicit}
                                            token = {accessToken}
                                            id = {item.id}
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


    let bottomMargin={}
    let noDisplay = {}
    if(playback)
        bottomMargin = {marginBottom: '50px'}
    else
        noDisplay = {display: 'none'}


    if(selected){
        window.scrollTo(0, 0);
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
            <div className="dashBottom" style={bottomMargin}>
                <button className="dashNP prev inline" style={invisible2} onClick ={() => {if(page>1) setPage(page-1)}}>Prev</button>
                <span className="dashPage inline" style={invisible2}>{pages}</span>
                <button className="dashNP next inline" style={invisible2} onClick={() => {setPage(page+1)}}>Next</button>
            </div>
            <div className="playbackDiv" style={noDisplay}>
                {playback}
            </div>
        </div>
    </div>
    )
}





