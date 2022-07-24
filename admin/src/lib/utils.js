import moment from "moment"

export const map_status_to_priority = (status)=>{
    status = status.toLowerCase()
    if(status === 'accomplished')
        return 3
    else if (status === 'canceled')
        return 4
    else if (status === 'pending')
        return 2
    else if( status === 'waiting')
        return 1
    return 0
}
export const formatFbDate = (dt,dateonly = false)=>{
    if(!dateonly)
        return moment(dt.toDate()).format("YYYY-MM-DD / hh:mm:ss")
    return moment(dt.toDate()).format("YYYY-MM-DD")

}