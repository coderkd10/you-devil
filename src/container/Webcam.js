// Inspired from react-webcam
import React, { Component, Fragment } from 'react';
import ErrorDialog from '../presentational/error';

export default class Webcam extends Component {
    state = {
        showErrorDialog: false,
        err: null,
        loading: true,
        stream: null,
    };
    
    getStream() {
        this.setState({ loading: true });
        navigator.mediaDevices.getUserMedia({ audio: false, video: true })
        .then(stream => {
            this.setState({
                showErrorDialog: false,
                err: null,
                loading: false,
                stream
            });
        })
        .catch(err => {
            this.setState({
                showErrorDialog: true,
                err,
                loading: false,
                stream: null
            });
        });
    }

    componentDidMount() {
        this.getStream();
    }

    onRetry = () => {
        this.getStream();
    }

    render() {
        return <Fragment>
            {this.props.children({
                loading: this.state.loading,
                error: this.state.showErrorDialog,
                stream: this.state.stream
            })}
            {this.state.showErrorDialog ? <ErrorDialog 
                open={this.state.showErrorDialog}
                err={this.state.err}
                onRetry={this.onRetry}
            /> : null} 
        </Fragment>
    }
}
