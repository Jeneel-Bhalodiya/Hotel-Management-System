import { motion } from "framer-motion";

export default function AnimatedBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden">

            <motion.div
                animate={{
                    x:[0,20,0],
                    y:[0,-30,0]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity
                }}
                className="absolute top-20 left-20 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    y:[0,40,0]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity
                }}
                className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
            />

        </div>
    )
}