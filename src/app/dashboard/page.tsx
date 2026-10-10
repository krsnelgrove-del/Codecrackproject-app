"use client"

import "../globals.css";
import SideBarButton from "@/components/cards/sidebarButton"
import { DashboardCards } from "./(config)/dashboardCards";
import { useEffect } from "react";

export default function Dashboard() {
    const overviewIconURL: string  = "/icons/overview-icon.png";
    const analyticsIconURL: string  = "/icons/analytics-icon.png";
    const logsIconURL: string  = "/icons/logs-icon-1.png";
    
    const panelStyle: string = "rounded-xl bg-zinc-900/60 border border-white/10 overflow-hidden backdrop-blur-sm";
    const sideBarButtonStyle: string = "aspect-square";

    return (
        <div className="w-full h-full grid grid-rows-12 grid-cols-12 gap-0 z-10">
            <div className="absolute w-full h-full bg-dashboard-pattern mask-b-from-2.5 -z-5 bg-cover bg-fixed scale-x-[-1] scale-y-[-1] scale-500"></div>
            
            <div className="col-span-12 row-span-1 grid grid-cols-subgrid bg-linear-to-l from-cyan-500/20 to-cyan-950/10 backdrop-blur-lg gap-2 p-1">
                <div className="row-start-1 row-span-1 ">Logo</div>
                <div className="row-start-1 col-start-2 row-span-1 col-span-8">Title</div>
                <div className="row-start-1 col-start-9 row-span-1 col-span-2">Status</div>
                <div className="row-start-1 col-start-11 row-span-1 col-span-1">Server Info</div>
                <div className="row-start-1 col-start-12 row-span-1 col-span-1">Logout</div>

            </div>
            <div className="row-start-2 row-span-11 flex flex-col bg-linear-to-t from-cyan-500/30 to-blue-950/0 backdrop-blur-lg gap-2 p-1 overflow-hidden">
                <SideBarButton url="../home" iconUrl={overviewIconURL} buttonText="Overview" className={`${sideBarButtonStyle}`}/>
                <SideBarButton url="../home" iconUrl={analyticsIconURL} buttonText="Analytics" className={`${sideBarButtonStyle}`}/>
                <SideBarButton url="../home" iconUrl={logsIconURL} buttonText="Logs" className={`${sideBarButtonStyle}`}/>
                
            </div>
            <div className="row-start-2 col-start-2 col-span-11 bg-linear-to-tr from-cyan-500/20 to-black/50 row-span-11 p-8 border-l border-t border-white/30 rounded-b-none rounded-r-none rounded-l-2xl rounded-t-2xl">
                <div className="w-full h-full grid grid-flow-col grid-cols-3 grid-rows-2 gap-4">
                    {DashboardCards.map((card) => {
                        const CardComponent = card.component;
                        return (
                            <div
                            key={card.id}
                            className={`${panelStyle}) ${card.gridSpan || ""}`}>
                                <CardComponent title={card.title} data={card.initialData}/>
                            </div>
                        );
                    })
                    }
                </div>
            </div>
        </div>
    )
}
