// Takes a input component and applies scaling transform on its
// so that it can fit inside a *fixed width* parent component
// TODO : Publish this as a standalone library in npm

// TODO : refactor this and decouple it from Container Dimensions
// This component should take a target container width as prop
// and a render prop, and appropriately scale the render prop
// component so that it fits with the input container width, i.e,
// rendered component's width <= container width

import React, { Component } from 'react';
import ContainerDimensions from 'react-container-dimensions';
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

const makeXScaled = OrigComponent => {
    class XScaledComponent extends Component {
        render() {
            return <ContainerDimensions>
            {
                ({ width }) => (
                    <Inner containerWidth={width} />

                )
            }
            </ContainerDimensions>
        }
    }

    const getScale = (baseWidth, containerWidth) => {
        // computes what is the desired scale that we should use
        // so that element with baseWidth fits inside containerWidth
        if (containerWidth >= baseWidth) {
            return 1;
        }
        return containerWidth / baseWidth;
    }

    class Inner extends Component {
        state = {
            // unscaled width of the input component
            baseWidth: null,
            // current scale factor used in scaling transform
            scale: 1,
            // used to track change in container dimensions
            lastContainerWidth: null
        };

        onResize = ({ bounds }) => {
            // This is fired only basewidth changes
            // but we've written in a way that if this behavior changes
            // in the future we'll be unaffected.
            
            // Basically the job of this method is only the update the base
            // width (along with new scale) whenever it changes and 
            // ignore everything else
            const { width } = bounds;
            const newBaseWidth = width / this.state.scale;
            if (newBaseWidth !== this.state.baseWidth) {
                // base width has updated need to update it along with scale
                this.setState({
                    baseWidth: newBaseWidth,
                    scale: getScale(newBaseWidth, this.props.containerWidth)
                })
            }
        }

        static getDerivedStateFromProps(nextProps, prevState) {
            if ((nextProps.containerWidth === prevState.lastContainerWidth) || 
                (!prevState.baseWidth)) {
                // either containerWidth did not update
                // or we don't know baseWidth yet. 
                // no point in updating the state here
                return null;
            }
            
            const newContainerWidth = nextProps.containerWidth;
            return {
                ...prevState,
                scale: getScale(prevState.baseWidth, newContainerWidth),
                lastContainerWidth: newContainerWidth,
            };
        }

        render() {
            return (
                <div style={{
                    width: this.props.containerWidth,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                }}>
                    <Measure bounds onResize={this.onResize}>
                        {({ measureRef }) =>
                            <div ref={measureRef} style={{
                                display: 'inline-block',
                                transform: `scale(${this.state.scale})`,
                                transformOrigin: '0 0'
                            }}>
                                <OrigComponent />
                            </div>
                        }
                    </Measure>
                </div>);
        }
    }

    return XScaledComponent;
}

export default makeXScaled;
