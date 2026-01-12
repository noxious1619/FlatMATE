"use client";

import { useState, useEffect, useRef } from "react";

type Props = {
    min: number;
    max: number;
    initialMin?: number;
    initialMax?: number;
    onChange: (min: number, max: number) => void;
};

export default function PriceSlider({ min, max, initialMin, initialMax, onChange }: Props) {
    const [minVal, setMinVal] = useState(initialMin || min);
    const [maxVal, setMaxVal] = useState(initialMax || max);
    const minValRef = useRef(minVal);
    const maxValRef = useRef(maxVal);
    const range = useRef<HTMLDivElement>(null);

    // Convert to percentage
    const getPercent = (value: number) => Math.round(((value - min) / (max - min)) * 100);

    // Update effect hook I (Min)
    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxValRef.current);

        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minVal, min, max]);

    // Update effect hook II (Max)
    useEffect(() => {
        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(maxVal);

        if (range.current) {
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [maxVal, min, max]);

    // Notify parent
    useEffect(() => {
        const handler = setTimeout(() => {
            onChange(minVal, maxVal);
        }, 500);
        return () => clearTimeout(handler);
    }, [minVal, maxVal]); // eslint-disable-line

    return (
        <div className="relative w-full h-12 flex items-center justify-center">
            <input
                type="range"
                min={min}
                max={max}
                value={minVal}
                onChange={(event) => {
                    const value = Math.min(Number(event.target.value), maxVal - 1);
                    setMinVal(value);
                    minValRef.current = value;
                }}
                className="thumb thumb--left"
                style={{ zIndex: minVal > max - 100 ? 5 : undefined }}
            />
            <input
                type="range"
                min={min}
                max={max}
                value={maxVal}
                onChange={(event) => {
                    const value = Math.max(Number(event.target.value), minVal + 1);
                    setMaxVal(value);
                    maxValRef.current = value;
                }}
                className="thumb thumb--right"
            />

            <div className="slider">
                <div className="slider__track" />
                <div ref={range} className="slider__range" />
            </div>

            {/* Values Display */}
            <div className="absolute top-8 left-0 text-xs font-mono font-bold">
                ₹{minVal}
            </div>
            <div className="absolute top-8 right-0 text-xs font-mono font-bold">
                ₹{maxVal}
            </div>

            <style jsx>{`
            .thumb {
                pointer-events: none;
                position: absolute;
                height: 0;
                width: 200px;
                outline: none;
                -webkit-appearance: none;
                width: 100%;
                z-index: 3;
            }
            .thumb::-webkit-slider-thumb {
                -webkit-appearance: none;
                -webkit-tap-highlight-color: transparent;
                background-color: white;
                border: 2px solid black;
                box-shadow: 2px 2px 0px 0px rgba(0,0,0,1);
                cursor: pointer;
                height: 18px;
                width: 18px;
                margin-top: 4px;
                pointer-events: all;
                position: relative;
            }
            .slider {
                position: relative;
                width: 100%;
            }
            .slider__track,
            .slider__range {
                position: absolute;
                border-radius: 3px;
                height: 6px;
            }
            .slider__track {
                background-color: #f1f1f1;
                border: 1px solid #ddd;
                width: 100%;
                z-index: 1;
            }
            .slider__range {
                background-color: #000;
                z-index: 2;
            }
        `}</style>
        </div>
    );
}
