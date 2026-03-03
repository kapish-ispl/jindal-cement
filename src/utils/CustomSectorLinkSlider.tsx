"use client";

import React, { ReactNode, useMemo } from "react";

const CustomSectorLinkSlider = ({ data }: { data: (ReactNode | string)[] }) => {
    const slides = useMemo(() => {
        return data
            .filter(
                (item): item is React.ReactElement =>
                    React.isValidElement(item)
            )
            .map((item, index) => (
                <React.Fragment key={index}>{item}</React.Fragment>
            ));
    }, [data]);
    return (
        <>
            <div className="c-sector">
                {slides.length > 0 && slides.map((item: ReactNode, index: number) => (
                    <React.Fragment key={index}>
                        {item}
                    </React.Fragment>
                ))}
            </div>
        </>
    )
}

export default CustomSectorLinkSlider