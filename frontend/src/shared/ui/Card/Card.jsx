import styles from './Card.module.css';

export const Card = ({ title, extra, children, className = "" }) => {
  return (
    <div className={`${styles.card} ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-lg font-medium">{title}</h3>
        {extra && <div>{extra}</div>}
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};