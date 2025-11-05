import classNames from "classnames";
import { ReactSVG } from "react-svg";
import { twMerge } from "tailwind-merge";

export type InlineSvgProps = {
    src: string;
    width?: number;
    height?: number;
    colour?: string;
    [key: string]: any;
};

export default function InlineSvg({
    src,
    width,
    height,
    colour,
    fluid = false,
    ...props
}: InlineSvgProps) {
    const classes = twMerge(classNames(
        //props.className, 
        `width: ${width}px; height: ${height}px`,
        {
            "width: 100%; height: auto;": fluid,
            [`fill-${colour ? colour : "none"}`]: colour,
        }
    ));
    return (
        <ReactSVG
            src={src}
            beforeInjection={(svg) => {
                svg.classList.add(props.className);
                svg.setAttribute("style", `${classes}`);
            }}
            {...props}
        />
    );
}

