import React from 'react';
import { motion } from 'motion/react';
import { AvatarExpression } from '../types';

interface AvatarProps {
  emoji: string;
  expression: AvatarExpression;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  emoji, 
  expression, 
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-2xl w-12 h-12',
    md: 'text-4xl w-20 h-20',
    lg: 'text-6xl w-32 h-32',
    xl: 'text-8xl w-48 h-48'
  };

  const getAnimation = () => {
    switch (expression) {
      case AvatarExpression.HAPPY:
        return {
          y: [0, -15, 0],
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1]
        };
      case AvatarExpression.ENCOURAGING:
        return {
          scale: [1, 1.05, 1],
          rotate: [0, 2, -2, 0]
        };
      default:
        return {
          y: [0, -5, 0]
        };
    }
  };

  return (
    <motion.div
      animate={getAnimation()}
      transition={{ 
        duration: expression === AvatarExpression.HAPPY ? 0.5 : 2, 
        repeat: expression === AvatarExpression.NEUTRAL ? Infinity : 0,
        ease: "easeInOut"
      }}
      className={`flex items-center justify-center bg-white rounded-[2rem] shadow-sm border border-stone-100 ${sizeClasses[size]} ${className}`}
    >
      {emoji}
    </motion.div>
  );
};

export default Avatar;
