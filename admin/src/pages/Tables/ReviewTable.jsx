import { useNavigate, useParams } from "react-router-dom"
import {GetTableById,DeleteTableById} from "../../lib/TablesDal"
import Loading from "../../components/Loading"
import Error from "../../components/Error"
import * as ROUTES from "../../ROUTES"
import { useContext } from "react"
import { UserContext } from "../../contexts"
import {createDomMotionComponent, motion} from "framer-motion"
import { FadeIn } from "../../animations"
import { load } from "mime"
import { formatFbDate } from "../../lib/utils"
import qr from "qrcode"
import { useState } from "react"

const ReviewTable =()=>{
    const {tableid} = useParams()
    const {result : table,loading,error} = GetTableById(tableid)
    const {deleteTable} = DeleteTableById()
    const user = useContext(UserContext)
    const usenav = useNavigate()
    const [qrImg,setQrImg] = useState(undefined)
    if( error)
        return <Error msg={"Error while retrieving Food information " + tableid} error={error} />
    if( loading)
        return <Loading />
    return  <>
    <motion.div variants={FadeIn()} className="data-review">
        <div className="data-review-header">
            <h1><span>Table: </span>{table.id}</h1>
            <div>
                {user.profile.permissions.tables.manage && <><button onClick={(e)=>{
                    usenav(ROUTES.TABLES.GET_UPDATE(table.id))
                }}>Update</button>
                <button onClick={(e)=>{
                    try{
                        deleteTable(table.id)
                        usenav(ROUTES.TABLES.ALL)
                    }catch(err){
                        console.log(err)
                    }
                }}>Delete</button></>}
            </div>
        </div>
        <div className="data-review-body">
            <h2><span>Number Of Places:</span> {table.placesNum}</h2>
            <h2><span>Disabled:</span> {table.disabled ? "Yes" : "No"}</h2>
            <h2><span>Purshase Time:</span> {formatFbDate(table.time)}</h2>
            <button onClick={(e)=>{
                qr.toDataURL(`http://localhost:3000/${tableid}`,{type: "image/png",scale: 20,quality: 1,errorCorrectionLevel: 'H'},(err,res)=> {
                    if(err)
                        console.log(err)
                    setQrImg(res)
                    console.log(res)
                    /**                const op = window.open()
                    const img = op.document.createElement('img')
                    img.set('src', res)
                    img.setAttribute('width', "800px")
                    img.setAttribute('height', "800px")

                    op.document.body.appendChild(img)

                    op.print()
                    op.close() */
                })

            }}>Generate Qr Code</button>
            {qrImg && <img style={{objectFit: "contain"}} src={qrImg || undefined} alt="" />}
        </div>
    </motion.div >
    </>
}

export default ReviewTable