import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
export function LoadingSpinner(props: { message: string }) {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px',
            }}
        >
            <ProgressSpinner
                style={{ width: '50px', height: '50px', margin: 0 }}
                strokeWidth="8"
                fill="var(--surface-ground)"
                animationDuration=".5s"
            />
            {props.message}
        </div>
    );
}
