import React from "react";
import {twMerge} from "tailwind-merge";
import classNames from "classnames";

export type CrossMarkProps = {
    width: number;
    height: number;
    animations?: { 
        circle: boolean; 
        cross: boolean;
    };
    [key: string]: any;
};

export function CrossMark({
    width, 
    height,
    animations={circle:true, cross:true},
    ...props}: CrossMarkProps) {
    const {circle, cross} = animations;
    const classes = twMerge(classNames(
        // merge a potential className prop with our own props
        props.className,
        `font-[1.25em] flex fill-none stroke-[var(--red-1)]`
    ));

    const circleClasses = twMerge(classNames(
        {
            "path circle": circle,
        }
    ));

    const crossClasses = twMerge(classNames(
        {
            "path line": cross,
        }
    ));

    return (
        <>
            <svg 
                {...props}
                className={`font-[1.25em] flex fill-none stroke-[var(--red-1)]`}
                width={width}
                height={height}
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 ${width} ${height}`} 
            >
                <circle className={circleClasses} cx={width*0.5} cy={height*0.5} r={width*0.4} strokeWidth={6}>
                </circle>
                <line 
                    className={crossClasses}
                    strokeWidth="6" 
                    strokeLinecap="round" 
                    strokeMiterlimit="10" 
                    x1={width*0.26} y1={width*0.29} 
                    x2={width*0.74} y2={height*0.71}
                />
                <line 
                    className={crossClasses}
                    strokeWidth="6" 
                    strokeLinecap="round" 
                    strokeMiterlimit="10" 
                    x1={width*0.74} y1={height*0.29} 
                    x2={width*0.26} y2={height*0.71}
                />
            </svg>
        </>
    );
}
