import { joiResolver } from "@hookform/resolvers/joi"
import { useForm,useFieldArray } from "react-hook-form"
import joi from "joi"
import {GetTables, UpdateTable} from "../../lib/Options"
import Error from "../../components/Error"
import Loading from "../../components/Loading"
import { useContext } from "react"
import {UserContext} from "../../contexts"
import {motion} from "framer-motion"
import { FadeIn } from "../../animations"
import PaginatedUniversalTable from "../../components/UniversalTable/PaginatedUniversalTable"
import { collection, documentId, where } from "firebase/firestore"
import moment from "moment"
import TablesTable from "../../components/TablesTable"

const AllTables = ({tables})=>{

    return <motion.div  variants={FadeIn()} className="table-container">
        <TablesTable />
    </motion.div>
}   
export default AllTables