"use client"
import SideBarButton from "@/components/cards/sidebarButton"
import { Component } from "react";
import { DashboardCards } from "./(config)/dashboardCards";

export default function Dashboard() {
    return (
        <div className="w-full h-full grid grid-rows-12 grid-cols-12 gap-2 z-10">
            
            <div className="col-span-12 row-span-1 grid grid-cols-subgrid gap-2 p-1">
                <div className="row-start-1 row-span-1 bg-fuchsia-500">Logo</div>
                <div className="row-start-1 col-start-2 row-span-1 col-span-8 bg-fuchsia-500">Title</div>
                <div className="row-start-1 col-start-9 row-span-1 col-span-2 bg-fuchsia-500">Status</div>
                <div className="row-start-1 col-start-11 row-span-1 col-span-1 bg-fuchsia-500">Server Info</div>
                <div className="row-start-1 col-start-12 row-span-1 col-span-1 bg-fuchsia-500">Logout</div>

            </div>
            <div className="row-start-2 row-span-11 flex flex-col gap-2 p-1 overflow-hidden">
                <SideBarButton url="../home" buttonText="Overview" className="aspect-square"/>
                <SideBarButton url="../home" buttonText="Analytics" className= "aspect-square"/>
                <SideBarButton url="../home" buttonText="Logs" className="aspect-square"/>
                
            </div>
            <div className="row-start-2 col-start-2 col-span-11 row-span-11 p-8 rounded-b-none rounded-r-none rounded-l-2xl rounded-t-2xl bg-amber-100">
                <div className="w-full h-full grid grid-flow-col grid-cols-3 grid-rows-2 gap-4 bg-amber-900">
                    {DashboardCards.map((card) => {
                        const CardComponent = card.component;
                        return (
                            <div
                            key={card.id}
                            className={`rounded-xl bg-zinc-900 border border-white/10 overflow-hidden ${card.gridSpan || ""}`}>
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