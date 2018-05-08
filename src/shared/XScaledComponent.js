// Takes a input component and applies scaling transform on its
// so that it can fit inside a *fixed width* parent component

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
        state = {
            scale: 1,
            isScaleFound: false,
        }

        constructor(props) {
            super(props);
            const t0 = performance.now();
            this.gt = () => performance.now() - t0;
        }

        // onGetWidth = (containerWidth, componentWidth) => {
        //     if (componentWidth <= containerWidth) {
        //         this.setState({ isScaleFound: true, scale: 1 });
        //     } else {
        //         const scale = containerWidth / componentWidth;
        //         this.setState({ isScaleFound: true, scale });
        //     }
        // }

        // componentWillMount() {
        //     console.log('--> willmount : T' + this.gt());
        // }

        // componentDidMount() {
        //     // console.log('--> component mounted now. w = ', this.w);
        //     console.log('--> didmount : T' + this.gt());
        // }

        // onResize = ({ bounds }) => {

        // }

        render() {
            return <ContainerDimensions>
            {
                ({ width }) => (
                    // <div style={{
                    //     width,
                    //     overflowX: 'hidden',
                    //     whiteSpace: 'nowrap'
                    // }}>
                    //     <div style={{
                    //         display: 'inline-block',
                    //         ...(this.state.isScaleFound ? {
                    //             transform: `scaleX(${this.state.scale})`,
                    //             transformOrigin: '0 0'
                    //         } : {
                    //             // visibility: 'hidden'
                    //         })
                    //     }}>
                    //         {/* <SizeMeComponent 
                    //             onGetWidth={compWidth => this.onGetWidth(width, compWidth)}
                    //         /> */}
                    //         {/* <OrigComponent /> */}
                    //         {/* <SizeMeComponent onGetWidth={w => {
                    //             console.log(`--> T${this.gt()} `, w);
                    //         }} /> */}

                    //         <Measure bounds
                    //             onResize={this.onResize}
                    //         >
                    //         {
                    //             ({ measureRef, contentRect }) =>
                    //                 <div ref={measureRef}>
                    //                     {/* // { console.log(`--> T${this.gt()} `, contentRect) } */}
                    //                     <OrigComponent />
                    //                 </div>
                    //         }
                    //         </Measure>
                    //     </div>
                    // </div>
                    <Inner containerWidth={width} />

                )
            }
            </ContainerDimensions>
        }
    }

    const getScalingFactor = (targetContainerWidth, elementWidth) => {
        if (elementWidth === 0)
            return 1;
        const ratio = targetContainerWidth / elementWidth;
        return ratio;
    }
    const getNewScale = (prevScale, scalingFactor) => {
        const newScale = prevScale * scalingFactor;
        return Math.min(newScale, 1);
    }

    // const pcr = (contentRect, state) => {
    //     const bw = contentRect.bounds.width;
    //     const ew = contentRect.entry.width;
    //     const s = state.scale;
    //     const cow = bw / s;
    //     return { bw, ew, cow, s };
    // }

    class Inner extends Component {
        constructor(props) {
            super(props);
            this.state = {
                scale: 1,
                elementWidth: null,
                lastContainerWidth: props.containerWidth,
                // slack scale & container width are used to when container width changes
                // due to window resize, coz then element resize isn't trigger
                // and we are stuck with old values
                // So the invariant that we are working with is ->
                // elementWidth does not always represent the width of the contained component
                // But, it does represent the width of the component *when* container width
                // was equal to slackContainerWidth (slackSlack represents the scale at that point)
                // Now if the current container width is equal to the slack container width
                // the element does indeed represent the correct inner width
                slackScale: 1,                
                slackContainerWidth: props.containerWidth,
            };

            // const gcr = () => pcr(this.ccr, this.state);
            // window.gcr = gcr;
        }

        onResize = (contentRect) => {
            // console.log(pcr(contentRect, this.state));

            const curWidth = contentRect.bounds.width;
            // alternative way of getting the content width
            // const curWidth = contentRect.entry.width * this.state.scale;
            const containerWidth = this.props.containerWidth;
            const scalingFactor = getScalingFactor(containerWidth, curWidth);
            const newScale = getNewScale(this.state.scale, scalingFactor);
            // onResize will not get trigged when state gets updated with new scale
            // so we'll compute the new width and store it in the state
            const newWidth = curWidth * (newScale / this.state.scale);

            // console.log("--> updated scale to - ", newScale);

            this.setState({
                scale: newScale,
                slackScale: newScale,
                elementWidth: newWidth,
                lastContainerWidth: this.props.containerWidth,
                slackContainerWidth: this.props.containerWidth,
            });            
        }

        static getDerivedStateFromProps(nextProps, prevState) {
            if ((nextProps.containerWidth === prevState.lastContainerWidth) ||
                (!prevState.elementWidth)) {
                // either we don't have any change in container width
                // or we haven't computed the initialsize yet
                return null;
            }

            const newContainerWidth = nextProps.containerWidth;
            if (prevState.slackScale === 1) {
                // at the time when container was of width slackContainerWidth
                // our element was still smaller than the slackContainerWidth
                // => we don't have to consider the slackContainerWidth anymore
                // just try to fit the element with width elementWidth into the current container
                const scalingFactor = getScalingFactor(newContainerWidth, prevState.elementWidth);
                const newScale = getNewScale(1, scalingFactor);
                return {
                    ...prevState,
                    scale: newScale,
                    lastContainerWidth: newContainerWidth
                };
            }


            const scalingFactor = newContainerWidth / prevState.slackContainerWidth;
            const newScale = getNewScale(prevState.slackScale, scalingFactor);

            return {
                scale: newScale,
                slackScale: prevState.slackScale,

                elementWidth: prevState.elementWidth,
                lastContainerWidth: newContainerWidth,
                slackContainerWidth: prevState.slackContainerWidth
            };
        }

        render() {
            return (
            <div style={{
                width: this.props.containerWidth,
                overflowX: 'hidden',
                whiteSpace: 'nowrap'
            }}>
                <Measure bounds onResize={this.onResize}>
                    {({ measureRef, contentRect }) =>
            
                    {
                        // this.ccr = contentRect;
                        // console.log(`ccr - `, pcr(contentRect, this.state));
                        
                    return <div ref={measureRef} style={{
                        display: 'inline-block',
                        ...(this.state.initialSizeFound || true ? {
                            transform: `scale(${this.state.scale})`,
                            // transform: `scaleX(${this.getScale()})`,
                            transformOrigin: '0 0'
                        } : {
                            // visibility: 'hidden'
                        })
                    }}>
                        <OrigComponent />
                    </div>}
                }
                </Measure>
            </div>);
        }
    }


    return XScaledComponent;
}

export default makeXScaled;
