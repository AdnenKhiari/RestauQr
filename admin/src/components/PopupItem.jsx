import React from "react"

import Popup from "reactjs-popup"
const PopupItem = ({children,open= false,onClose = (e)=>{},onOpen=(e)=>{}})=>{
    return <Popup open={open} closeOnDocumentClick={false} onClose={onClose} onOpen={onOpen} >
        {close => <div className="popup-container">
            <div className="content-container">
                <button className="closecontainer" onClick={(e)=>close()}>Close</button>
                <div className="content">
                    {children(close)}
                </div>
            </div>
        </div>
        }
    </Popup>
}

export default PopupItem