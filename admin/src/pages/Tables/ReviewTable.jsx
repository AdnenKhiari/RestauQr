import { useNavigate, useParams } from "react-router-dom"
import {GetTableById,DeleteTableById} from "../../lib/TablesDal"
import Loading from "../../components/Loading"
import Error from "../../components/Error"
import * as ROUTES from "../../ROUTES"
import { useContext } from "react"
import { UserContext } from "../../contexts"
import {motion} from "framer-motion"
import { FadeIn } from "../../animations"
import { load } from "mime"
import { formatFbDate } from "../../lib/utils"

const ReviewTable =()=>{
    const {tableid} = useParams()
    const {result : table,loading,error} = GetTableById(tableid)
    const {deleteTable} = DeleteTableById()
    const user = useContext(UserContext)
    const usenav = useNavigate()
    if( error)
        return <Error msg={"Error while retrieving Food information " + tableid} error={error} />
    if( loading)
        return <Loading />
    return  <>
    <motion.div variants={FadeIn()} className="data-review">
        <div className="data-review-header">
            <h1>Table: {table.id}</h1>
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
            <h2>Number Of Places: {table.placesNum}</h2>
            <h2>Disabled: <span>{table.disabled ? "Yes" : "No"}</span></h2>
            <h2>Purshase Time: {formatFbDate(table.time)}</h2>
        </div>
    </motion.div >
    </>
}

export default ReviewTable