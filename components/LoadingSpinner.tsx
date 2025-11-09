import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-4',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div 
            className={`animate-spin rounded-full border-slate-400 border-t-purple-500 ${sizeClasses[size]}`}
            role="status"
            aria-live="polite"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};
