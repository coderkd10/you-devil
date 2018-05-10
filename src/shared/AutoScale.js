// Takes a input component and applies scaling transform on its
// so that it can fit inside a fixed height / width parent component
// TODO : Publish this as a standalone library in npm

// This component takes target container width, height as prop
// and a render prop, and appropriately scales the render prop
// component so that it fits with the input container width, height, i.e,
// rendered component's height <= container height and
// rendered component's width <= container width

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Measure from 'react-measure';

// Important point to note about what react-measure does :
// Terminology -> We have a base component, and then apply some
// scaling transform on it. Now we are concerned with two kinds
// of sizes of the element ->

// 1. Base / Unscaled size: this is the size when no scaling
// (i.e scale = 1) is applied to the element.
// 2. Actual / Scaled size: Actual size of the element after scaling has
// been applied. i.e scale size = base size * scale applied

// We might think that react-measure would give the actual / scale size (type 2),
// (because it is what we'll get if we take the actual dom node, and use `getClientBooundRect`
// on it that dimension is what we'll get).
// And indeed this is what react-measure will give us in its `onResize` method (contentRect.bounds) 
// (the value passed as a render prop to the child is a mirror of this value, and its also updates only 
// when onResize gets trigged, and they are guranteed to be in sync).

// So logically we'll think that whenever actual size updates onResize will get called. But
// this is where we get it wrong, and react-measure somehow triggers only when the base size (type 1)
// is updated. Maybe this has something to do without react-measure implements its resize listening
// logic. TODO: Look at the react-measure's source and figure out what exactly causes this behaviour,
// and think about if we can do something so that react-measure can also track changes caused by
// scale changing.
// (But in this case its not tracking the changes caused by scaling changing has made the problem somewhat
// simpler for us).

const getScale = (baseDimension, containerDimension) => {
    // computes what is the desired scale that we should use
    // so that element with base dimension fits inside container dimension
    if (containerDimension >= baseDimension) {
        return 1;
    }
    return containerDimension / baseDimension;
}
const getOverallScale = (baseWidth, baseHeight, containerWidth, containerHeight) => {
    const xScale = getScale(baseWidth, containerWidth);
    const yScale = getScale(baseHeight, containerHeight);
    return Math.min(xScale, yScale);
}

class AutoScale extends Component {
    state = {
        // unscaled dimensions of the input component
        baseWidth: null,
        baseHeight: null,
        // current scale factor used in scaling transform
        scale: 1,
        // used to track change in container dimensions
        lastContainerWidth: null,
        lastContainerHeight: null,
    };

    onResize = ({ bounds }) => {
        // This is fired only base dimensions change
        // but we've written in a way that if this behavior changes
        // in the future we'll be unaffected.
        
        // Basically the job of this method is only the update the base
        // width, height (along with new scale) whenever it changes and
        // ignore everything else
        const { width, height } = bounds;
        
        const newBaseWidth = width / this.state.scale;
        const newBaseHeight = height / this.state.scale;

        if ((newBaseWidth !== this.state.baseWidth) || 
            (newBaseHeight !== this.state.baseHeight)) {
            // base width / height has updated need to update it along with scale
            const newScale = getOverallScale(
                newBaseWidth,
                newBaseHeight,
                this.props.containerWidth,
                this.props.containerHeight);
            this.setState({
                baseWidth: newBaseWidth,
                baseHeight: newBaseHeight,
                scale: newScale,
            });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if ((nextProps.containerWidth === prevState.lastContainerWidth && 
            nextProps.containerHeight === prevState.lastContainerHeight) ||
            !prevState.baseWidth || !prevState.baseHeight) {
            // either container dimensions did not update
            // or we don't know base dimensions yet.
            // no point in updating the state here
            return null;
        }
        
        const newContainerWidth = nextProps.containerWidth;
        const newContainerHeight = nextProps.containerHeight;
        const newScale = getOverallScale(
            prevState.baseWidth,
            prevState.baseHeight,
            newContainerWidth,
            newContainerHeight
        );

        return {
            ...prevState,
            scale: newScale,
            lastContainerWidth: newContainerWidth,
            lastContainerHeight: newContainerHeight,
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if ((this.state.baseWidth !== prevState.baseWidth) || 
            (this.state.baseHeight !== prevState.baseHeight) ||
            (this.state.scale !== prevState.scale)) {
            // compute actual width of the component
            const width = this.state.baseWidth * this.state.scale;
            const height = this.state.baseHeight * this.state.scale;
            this.props.onResize({
                width,
                height,
                scale: this.state.scale
            });
        }
    }

    render() {
        const style = {
            overflow: 'hidden',
            whiteSpace: 'noWrap',
        };
        if (isFinite(this.props.containerWidth)) {
            style.maxWidth = this.props.containerWidth;
        }
        if (isFinite(this.props.containerHeight)) {
            style.maxHeight = this.props.containerHeight;
        }
        return (
            <div style={{ ...style, ...this.props.style }}>
                <Measure bounds onResize={this.onResize}>
                    {({ measureRef }) =>
                        <div ref={measureRef} style={{
                            display: 'inline-block',
                            transform: `scale(${this.state.scale})`,
                            transformOrigin: '0 0'
                        }}>
                            {this.props.render()}
                        </div>
                    }
                </Measure>
            </div>);
    }
}

AutoScale.propTypes = {
    containerWidth: PropTypes.number, // can be infinity if don't want to constrain width
    containerHeight: PropTypes.number, // can be infinity if don't want to constrain height

    render: PropTypes.func.isRequired,
    onResize: PropTypes.func, // this callback gets called whenever inner's size gets updated

    style: PropTypes.object,
};

AutoScale.defaultProps = {
    containerWidth: Infinity,
    containerHeight: Infinity,
    onResize: () => {},
    style: {},
};

export default AutoScale;
