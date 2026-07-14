'use client';

import { useScroll, useTransform, motion, MotionValue } from 'motion/react';
import React, { useRef, forwardRef } from 'react';

interface SectionProps {
  scrollYProgress: MotionValue<number>;
}

const Section1: React.FC<SectionProps> = ({ scrollYProgress }) => {
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5]);
  return (
    <motion.section
      style={{ scale, rotate }}
      className='sticky font-semibold top-0 h-screen bg-gradient-to-t to-[#dadada] from-[#ebebeb] flex flex-col items-center justify-center text-black'
    >
      <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>

      <h1 className='2xl:text-7xl text-5xl md:text-6xl px-8 font-semibold text-center tracking-tight leading-[120%] relative z-10 text-[#3a081a]'>
        Botanical Masterpieces <br /> Sculpted by Nature
      </h1>
    </motion.section>
  );
};

const Section2: React.FC<SectionProps> = ({ scrollYProgress }) => {
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [5, 0]);

  return (
    <motion.section
      style={{ scale, rotate }}
      className='relative h-screen bg-gradient-to-t to-[#1a1919] from-[#06060e] text-white overflow-hidden'
    >
      <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
      <article className='container mx-auto relative z-10 flex flex-col justify-center h-full px-6'>
        <h1 className='text-4xl md:text-6xl leading-[100%] py-10 font-semibold tracking-tight text-center md:text-left'>
          Meticulously Crafted <br /> Everlasting Elegance
        </h1>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[50vh]'>
          <img
            src='/112.jpg'
            alt='img'
            className='object-cover w-full rounded-md h-full aspect-[3/4]'
          />
          <img
            src='/222.jpeg'
            alt='img'
            className='object-cover w-full rounded-md h-full aspect-[3/4]'
          />
          <img
            src='/2323.jpeg'
            alt='img'
            className='object-cover w-full rounded-md h-full aspect-[3/4]'
          />
          <img
            src='/4343.jpg'
            alt='img'
            className='object-cover w-full rounded-md h-full aspect-[3/4] hidden md:block'
          />
        </div>
      </article>
    </motion.section>
  );
};

const HeroScrollAnimation = forwardRef<HTMLElement>((props, ref) => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  return (
    <>
      <main ref={container} className='relative h-[200vh] bg-black'>
        <Section1 scrollYProgress={scrollYProgress} />
        <Section2 scrollYProgress={scrollYProgress} />
      </main>
    </>
  );
});

HeroScrollAnimation.displayName = 'HeroScrollAnimation';

export default HeroScrollAnimation;
