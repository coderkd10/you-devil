import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ErrorIcon from 'react-icons/lib/md/error';
import RepeatIcon from 'react-icons/lib/fa/repeat';

const PermissionErrorDialog = ({ 
    open,
    onRetry,
}) => 
    <Dialog
        open={open}
        title={<h3><ErrorIcon/> Permission to access camera denied</h3>}
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
            This application requires access to your webcam to function.             
            If you have already dismissed the browser's permission dialog, due to the contraints improsed by the browser, we cannot re-request your permission. 
            So you may have to manually grant us permission to access you camera, instructions to which can be found <a href='https://web.archive.org/web/20180506103949/https://letsrabbit.zendesk.com/hc/en-us/articles/115003658728-How-do-I-enable-my-mic-camera-in-my-browser'> in this article</a> (just navigate to section corresponding to your browser and follow the instructions).
            (<b>Note</b> - All data is processed on the client side, and nothing is sen t over the network. So you don't have to worry about misue of your audio-video stream by 3rd parties).

            <p>Once you granted the permission to access audio & video, click on the Retry button below.</p>
        </div>
    </Dialog>;

export default PermissionErrorDialog;
