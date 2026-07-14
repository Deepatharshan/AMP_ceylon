"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

// CSS bounce animation (can also go into globals.css if preferred)
const bounceStyle = `
@keyframes bounceFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.bounce {
  animation: bounceFloat 3s ease-in-out infinite;
}
`;

interface ShirtParallaxCardProps {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl?: string;
  className?: string;
}

export function ShirtParallaxCard({
  id,
  title,
  description,
  price,
  imageUrl = "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/ruixen_shirt_product.png",
  className,
}: ShirtParallaxCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <>
      <style>{bounceStyle}</style>

      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 0.97, boxShadow: "0px 15px 35px rgba(0,0,0,0.25)" }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className={cn("relative w-full h-[380px] max-w-sm mx-auto cursor-pointer rounded-2xl", className)}
      >
        <Link href={`/product/${id}`} className="block h-full">
          {/* Card */}
          <Card className="relative z-10 h-full rounded-2xl border bg-card p-6 flex flex-col justify-end overflow-hidden border-gray-100 shadow-md">
            
            {/* Background blur/gradient to make text readable over images */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white via-white/80 to-transparent z-0"></div>

            <div className="relative z-10 mt-auto">
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-xl font-bold font-playfair text-[#3a081a] line-clamp-1">{title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-lg font-bold text-[#3a081a]">{price}</p>
                  <Button className="bg-[#3a081a] hover:bg-[#5a0c28] text-white transition-colors">
                    View
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </Link>

        {/* Product image - Adjusted for generic product images instead of specifically shirts */}
        <motion.img
          src={imageUrl}
          alt={title}
          className={cn(
            "absolute top-4 right-1/2 translate-x-1/2 h-[220px] w-auto max-w-[90%] object-contain pointer-events-none z-20 bounce drop-shadow-xl"
          )}
          style={{ translateX: '50%' }}
          whileHover={{
            scale: 1.10,
            y: -10,
            filter: "drop-shadow(0px 25px 30px rgba(0,0,0,0.25))",
          }}
          transition={{ type: "spring", stiffness: 250, damping: 20 }}
        />
      </motion.div>
    </>
  );
}
