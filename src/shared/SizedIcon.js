// HOC Wrapper around react-icons
// which allows to resize icons however you like
// Transforms Icon, to accept two extra props height, width props
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const makeSizeable = OrigIcon => {
    class IconWrapper extends Component {
        render() {
            return <OrigIcon {...this.props} />;
        }
    }

    class SizeableIcon extends Component {
        state = {
            origDimensions: null
        }

        componentDidMount() {
            const node = ReactDOM.findDOMNode(this.ref);
            const boundingRect = node.getBoundingClientRect();
            this.setState({
                origDimensions: {
                    height: boundingRect.height,
                    width: boundingRect.width
                }
            });
        }

        render() {
            let { height, width, ...otherProps } = this.props;

            if (!this.state.origDimensions)
                return <IconWrapper {...otherProps} ref={ref => {this.ref = ref;}}/>;
            
            const {
                height: origHeight,
                width: origWidth
            } = this.state.origDimensions;
            if ( !height && !width ) {
                height = origHeight;
                width = origWidth;
            }
            let scaleX, scaleY;
            if (width) {
                scaleX = width / origWidth;
                if (!height)
                    scaleY = scaleX;
            }
            if (height) {
                scaleY = height / origHeight;
                if (!width)
                    scaleX = scaleY;
            }

            return (
                <div {...otherProps}>
                    <div style={{
                        width: 16,
                        height: 16,
                        position: 'relative',
                        transform: `scaleX(${scaleX}) scaleY(${scaleY})`
                    }}>
                        <OrigIcon 
                            style={{
                                position: 'absolute',
                                top: 0,
                                left:0,
                            }}
                        />
                    </div> 
                </div>
            );
        }
    }

    return SizeableIcon;
}

export default makeSizeable;
