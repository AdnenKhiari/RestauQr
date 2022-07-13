import {getStorage,uploadBytesResumable,ref,getDownloadURL} from "firebase/storage"
import { useCallback } from "react"
import { useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import mime from "mime"
const UploadFile = ()=>{

    const [url,setUrl] = useState(null)
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(null)
    const [progress,setProgress] = useState(0)
    const [state,setState] = useState(null)
    const store = getStorage()
    const upload = async (blob,type)=>{
        setLoading(true)
        try{
            const ext = mime.getExtension(type)
            const filename = uuidv4()
            const imgref = ref(store,"/"+filename+"."+ext)

            const uploadtask=  uploadBytesResumable(imgref,blob,{contentType: type})

            const upload_promise = ()=> new Promise((resolve,reject)=>{
                uploadtask.on('state_changed',(snap)=>{
                    setState(snap.state)
                    setProgress(uploadtask.snapshot.bytesTransferred * 100.0 / uploadtask.snapshot.totalBytes )
                },
                (err)=>{
                    return reject(err)
                },
                async ()=>{
                    //finally
                    const url = await getDownloadURL(uploadtask.snapshot.ref)
                    setUrl(url)
                    return resolve(url)
                })
            })

            const uri = await upload_promise()
            return uri
        }catch(err){
            setError(err)
            throw err
        }finally{
            setLoading(false)
        }
    }
    return {
        url,
        error,
        loading,
        progress,
        state,
        upload
    }
}
export default UploadFile