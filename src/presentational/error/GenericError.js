import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ErrorIcon from 'react-icons/lib/md/error';
import RepeatIcon from 'react-icons/lib/fa/repeat';

const GenericErrorDialog = ({ 
    open,
    onRetry,
    err,
}) => 
    <Dialog
        open={open}
        title={<h3><ErrorIcon/> Error occured while accessing camera</h3>}
        actions={[
            <FlatButton
                label="Retry"
                primary
                icon={<RepeatIcon/>}
                onClick={onRetry}
            />
        ]}
    >
    <div>
        Some unexpected error occured while trying to your video via the camera
        This might be an issue with your hardware peripherals (webcam / camera) or your browser software.
        
        <hr/>
            <details>
                <summary>Technical Details</summary>
                {err.toString()}
            </details>
        </div>
    </Dialog>

export default GenericErrorDialog;
