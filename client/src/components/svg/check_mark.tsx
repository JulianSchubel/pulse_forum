import React from "react";
import {twMerge} from "tailwind-merge";
import classNames from "classnames";

export type CheckMarkProps = {
    width: number;
    height: number;
    animations?: { 
        circle: boolean; 
        check: boolean;
    };
    [key: string]: any;
};

export function CheckMark({
    width,
    height,
    animations={circle:true, check:true},
    ...props
}: CheckMarkProps) {
    const {circle, check} = animations;
    const classes = twMerge(classNames(
        // merge a potential className prop with our own props
        props.className,
        `font-[1.25em] flex fill-none stroke-[var(--green-6)]`
    ));

    const circleClasses = twMerge(classNames(
        {
            "path circle": circle,
        }
    ));

    const checkClasses = twMerge(classNames(
        {
            "path check": check,
        }
    ));
    return (
        <>
            <svg 
                viewBox={`0 0 ${width} ${height}`} 
                className={`font-[1.25em] flex fill-none stroke-[var(--green-6)]`}
                width={width}
                height={height}
                xmlns="http://www.w3.org/2000/svg"
                {...props}
            >
                <circle className={circleClasses} cx={width*0.5} cy={height*0.5} r={width*0.4} strokeWidth={6}>
                </circle>
                <polyline
                    className={checkClasses}
                    points={`${width*0.77},${height*0.31} ${width*0.4},${height*0.68} ${width*0.23},${height*0.52}`}
                    strokeWidth={6}
                >
                    
                </polyline>
            </svg>
        </>
    );
}

