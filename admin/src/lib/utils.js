import moment from "moment"

export const getLevel = (scope: string)=>{
    if(scope === "none")
        return -1000
    if(scope === "read")
        return 0
    if(scope === "manage")
        return 1000
    return - 100000
}
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
export const map_order_status_to_priority = (status)=>{
    status = status.toLowerCase()
    if (status === 'paid')
        return 4
    else if (status === 'canceled')
        return 2
    else if( status === 'unpaid')
        return 1
    return 0
}

export const getTodayDate = ()=>{
    return moment(new Date()).format("DD.MM.YYYY")
}
export const getDateFromN = (N)=>{
    return moment(new Date() - N).format("DD.MM.YYYY")
}

export const getOptionsList = (fd,last = "")=>{
    const arr =[]
    if(!fd)
        return []
    fd.options && fd.options.forEach((opt)=>{
        if(opt.value){
            const optname = typeof(opt.value) === "string" ? opt.name + " : " + opt.value : opt.name
            const nm = last ? last+"/"+optname : optname
            arr.push(nm)
            arr.push(...getOptionsList(opt.ingredients,nm))
        }
    })
    return arr
}

export const formatFbDate = (dt,dateonly = false,inp = false)=>{
    const new_date = dt && dt._seconds ? new Date(dt._seconds*1000 + dt._nanoseconds / 1000) : dt
    if(!dt)
        return ""
    if(inp)
        return moment(new_date).format("YYYY-MM-DDThh:mm")
    if(!dateonly)
        return moment(new_date).format("YYYY-MM-DD / hh:mm:ss")
    return moment(new_date).format("YYYY-MM-DD")

}
export const getInsTime = ()=>{
    const dt = Date.now()
    const unit = 1000 * 3600 * 24 * 7
    const ml = Math.floor(dt/unit) * unit
    return `${ml}`
}

export const ingredientsUsage = (fd)=>{
     
}