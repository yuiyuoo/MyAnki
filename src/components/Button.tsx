import type { ButtonHTMLAttributes } from 'react';
import type { Accent } from '../types';
import styles from './Button.module.css';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  accent?: Accent;
}

export function Button({ accent = 'pink', className = '', type = 'button', ...rest }: Props) {
  return <button type={type} className={`${styles.btn} ${styles[accent]} ${className}`} {...rest} />;
}
