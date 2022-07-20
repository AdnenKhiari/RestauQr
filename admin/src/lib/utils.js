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