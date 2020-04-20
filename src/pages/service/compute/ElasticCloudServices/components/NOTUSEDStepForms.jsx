import React, { PureComponent } from 'react';
import { Steps, Button, message, Row } from 'antd';
import { connect } from 'dva';
import Finalize from '@/components/Finalize';

const { Step } = Steps;

const stepsProto = [
    {
        title: 'First Step',
        content: 'First-content',
    },
    {
        title: 'Second',
        content: 'Second-content',
    },
    {
        title: 'Last',
        content: 'Last-content',
    },
    {
        title: 'Last',
        content: 'Last-content',
    },
    {
        title: 'Last',
        content: 'Last-content',
    },
    {
        title: 'Last',
        content: 'Last-content',
    },
    {
        title: 'Last',
        content: 'Last-content',
    },
];

class StepsForms extends PureComponent {
    constructor(props) {
        super(props);
        this.stepForms = [];

        this.state = {
            current: 0,
        };
    }
    componentDidMount() {

    }

    next() {

        let proceed = true;
       
       
       
       
       
       
        if (proceed) {
            const current = this.state.current + 1;
            this.setState({ current });
        }
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }

    handleSubmit(e) {

        const { dispatch } = this.props;

        dispatch({
            type: `createECS/create`,
            payload:
                this.props.createECS.formsData
        })

    }

    render() {
        const { current } = this.state;
        const steps = this.props.steps ? this.props.steps : stepsProto;

        return (
            <div>
                <Row
                    style={{
                        
                        margiTop: `50px`,
                        padding: `32px`,
                        border: `1px solid #e5e5e5`,
                        borderBottom: 0,
                        
                        background: `#fbfbfb`,
                       
                        paddingRight: `55px`,
                        paddingBottom: `20px`,
                    }}
                >
                    <Steps current={current}>
                        {steps.map((item, index) => (
                            <Step key={item.stepData.title} title={item.stepData.title} number={index+1} />
                        ))}
                        <Step key={'Finalize'} title={'Finalize'} />
                    </Steps>
                </Row>
                <Row
                    style={{
                        padding: `40px`,
                        border: `1px solid #e5e5e5`,
                    }}
                >
                    {current <= steps.length - 1 ? (
                        <div className="steps-content">
                            {React.createElement(steps[current].Content, {
                                formIndex: current
                            })}
                        </div>
                    ) : (
                            <React.Fragment>
                                <Finalize dataSource={this.props.createECS.formsData} />
                            </React.Fragment>
                           
                        )}
                </Row>

                <div style={{ textAlign: 'right', marginTop: `24px` }}>
                    {current > 0 && (
                        <Button
                            size="large"
                            style={{ width: '300px', marginRight: `24px` }}
                            onClick={() => this.prev()}
                        >
                            Previous
            </Button>
                    )}
                    {current < steps.length && (
                        <Button
                            size="large"
                            style={{ width: '300px' }}
                            type="primary"
                            onClick={() => this.next()}
                        >
                            Next
            </Button>
                    )}
                    {current === steps.length && (
                        <Button
                            size="large"
                            style={{ width: '300px' }}
                            type="primary"
                            onClick={() => { this.handleSubmit(); message.success('Processing complete!') }}
                        >
                            Done
            </Button>
                    )}
                </div>
            </div>
        );
    }
}
export default connect(({ createECS, global }) => ({
    createECS,
    global
}))(StepsForms);
