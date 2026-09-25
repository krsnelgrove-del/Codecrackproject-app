import React from 'react';
import { Button } from 'react-aria-components';
import { cn } from "@/lib/utils"; 
import Link from 'next/link';

interface SideBarButtonProps {
    buttonText?: string;
    url?: string;
    className?: string;
    children?: React.ReactNode;
}

export default function SideBarButton({
    buttonText, 
    url, 
    className,
    children
}: SideBarButtonProps) {
    /* Weird conditional variable creation. always bugs me...*/
    const content = children || buttonText;

    if (url) {
        return (
            <Link 
                href={url} 
                className={cn(
                    "flex items-center justify-center rounded-lg bg-amber-500 hover:bg-amber-600 transition-colors p-2 text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-400", 
                    className
                )}
            >
                {content}
            </Link>
        );
    }
    return (
        <Button 
            className={cn(
                "flex items-center justify-center rounded-lg bg-amber-500 hover:bg-amber-600 transition-colors p-2 text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-400", 
                className
            )}
        >
            {content}
        </Button>
    );
}