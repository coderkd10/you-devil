// Scale a component so that it fits inside a fixed width container
import React, { Component } from 'react';
import ContainerDimensions from 'react-container-dimensions';
import sizeMe from 'react-sizeme';
import Measure from 'react-measure';


const makeXScaled = OrigComponent => {
    const SizeMeWrapper = ({ size, onGetWidth }) => {
        onGetWidth(size.width);
        return <OrigComponent />;
    }
    const SizeMeComponent = sizeMe()(SizeMeWrapper);


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

        componentWillMount() {
            console.log('--> willmount : T' + this.gt());
        }

        componentDidMount() {
            // console.log('--> component mounted now. w = ', this.w);
            console.log('--> didmount : T' + this.gt());
        }

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
        }

        onResize = (contentRect) => {
            const curWidth = contentRect.bounds.width;
            // alternative way of getting the content width
            // const curWidth = contentRect.entry.width * this.state.scale;
            const containerWidth = this.props.containerWidth;
            const scalingFactor = getScalingFactor(containerWidth, curWidth);
            const newScale = getNewScale(this.state.scale, scalingFactor);
            // onResize will not get trigged when state gets updated with new scale
            // so we'll compute the new width and store it in the state
            const newWidth = curWidth * (newScale / this.state.scale);

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
                        // console.log('-r w: ', contentRect.bounds.width);
                    
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
