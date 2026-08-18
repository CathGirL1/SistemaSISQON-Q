import { useEffect, useState } from "react";

import type { Dashboard } from "../interfaces/Dashboard";

import { obtenerDashboard } from "../services/DashboardService";

export default function useDashboard(){

    const [dashboard,setDashboard]=useState<Dashboard>();

    const [loading,setLoading]=useState(true);

    useEffect(()=>{

        cargarDashboard();

    },[]);

    async function cargarDashboard(){

        try{

            const datos=await obtenerDashboard();

            setDashboard(datos);

        }

        catch(error){

            console.error(error);

        }

        finally{

            setLoading(false);

        }

    }

    return{

        dashboard,

        loading

    }

}