import React from 'react';
import PermissionErrorDialog from './PermissionError';
import GenericErrorDialog from './PermissionError';

const ErrorDialog = ({
    open,
    onRetry,
    err
}) => {
    if (
        err.name === 'PermissionDeniedError' || 
        err.message === 'Permission denied' ||
        err.name === 'NotAllowedError'
    ) {
        return <PermissionErrorDialog open={open} onRetry={onRetry} />;
    }
    return <GenericErrorDialog open={open} onRetry={onRetry} err={err} />;
}

export default ErrorDialog;
