import type { HTMLAttributes } from 'react';
import type { Accent } from '../types';
import styles from './Card.module.css';

interface Props extends HTMLAttributes<HTMLDivElement> {
  accent?: Accent;
}

export function Card({ accent, className = '', ...rest }: Props) {
  return <div className={`${styles.card} ${accent ? styles[accent] : ''} ${className}`} {...rest} />;
}
