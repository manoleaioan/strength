import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, useInView } from "framer-motion";

export const MotionNumber = ({ value, direction = "up", init, disabled = false, inView = true, duration }) => {
    const ref = useRef(null);
    const motionValue = useMotionValue(direction === "down" ? value : 0);
    const springConfig = duration
        ? { duration}
        : {
            damping: 40,
            stiffness: 140,
        };

    const springValue = useSpring(motionValue, springConfig);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (!disabled) {
            if (inView && isInView) {
                motionValue.set(direction === "down" ? 0 : value);
            } else if (!inView) {
                motionValue.set(direction === "down" ? 0 : value);
            }
        }
    }, [motionValue, isInView, value, direction, disabled]);


    useEffect(() => {
        if (init) {
            init.current = false;
        }
        ref.current.textContent = disabled ? value : 0;
    }, [])

    useEffect(
        () =>
            springValue.on("change", (latest) => {
                if (ref.current) {
                    ref.current.textContent = Intl.NumberFormat("en-US").format(
                        latest.toFixed(0)
                    );
                }
            }),
        [springValue]
    );

    return <div ref={ref} />;
};