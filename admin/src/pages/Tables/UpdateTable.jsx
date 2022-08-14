import { useParams } from "react-router-dom"
import TableInfo from "../../components/TableInfo"
import { GetTableById } from "../../lib/TablesDal"
import Loading from "../../components/Loading"
import Error from "../../components/Error"
import {formatFbDate} from "../../lib/utils"
import moment from "moment"
const UpdateTable = ()=>{
    const {tableid} = useParams()
    const {result,error,loading} = GetTableById(tableid)
    const format_result = (res)=>{
        return {...res,time: moment(formatFbDate(res.time)).format("YYYY-MM-DD")}
    }

    if(loading)
        return <Loading  />
    if(error)
        return <Error err={error} msg='Invalid Table ID' />
    return <TableInfo defaultVals={format_result(result)} />
}
export default UpdateTable
