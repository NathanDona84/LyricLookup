import React from "react"

export function TimeOut(props){
    return(
        <div className="error">
            <p>Your Search Timed Out</p>
            <p>Please Try Again</p>
        </div>
    )
}

export function NoResults(props){
    return(
        <div className="error">
            <p>No Results</p>
            <p>Please Try Again</p>
        </div>
    )
}