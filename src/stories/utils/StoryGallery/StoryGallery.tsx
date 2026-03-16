import React from 'react';
import styles from './StoryGallery.module.css';

interface StoryGalleryProps {
  children?: React.ReactNode;
  title?: string;
}

/* This component displays multiple Storybook stories side by side */
export const StoryGallery = ({ children, title }: StoryGalleryProps) => {
  return (
    <div className={styles.storyGallery}>
      <p>{title}</p>
      <div className={styles.storyWrapper}>{children}</div>
    </div>
  );
};
