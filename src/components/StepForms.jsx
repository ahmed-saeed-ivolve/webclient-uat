import React, { PureComponent } from 'react';
import { Steps, Button, message, Row } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';
import Finalize from './Finalize';

import FinalizeEcs from './FinalizeEcs';
import ConsoleExtraActions from '@/pages/service/compute/ElasticCloudServices/components/ConsoleExtraActions';
import Second from '@/pages/service/compute/ElasticCloudServices/components/IntanceCreateSteps/Second';

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
        title: 'Third',
        content: 'Third-content',
    },
    {
        title: 'Fourth',
        content: 'Fourth-content',
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
            type: `ecs/create`,
            payload: this.props.createECS.formsData,
        });
        dispatch({
            type: 'createECS/resetMetaData',
            payload: {
                reset_metastate: [],
                counter: 0,
            },
        });
    }

    setInnerFormsRef(formNumber, ref) {
        this[formNumber] = ref;
    }

    render() {
        const { current } = this.state;
        const steps = this.props.steps ? this.props.steps : stepsProto;
        const { helperData } = this.props;
        const CurrentStep = steps[current]?.Content;

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
                        {steps.map(item => (
                            <Step
                                key={item.stepData.title}
                                title={item.stepData.title}
                            />
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
                            <CurrentStep helperData={{ ...helperData }} />
                        </div>
                    ) : window.location.href.includes(
                          'elastic-cloud-services'
                      ) ? (
                        <React.Fragment>
                            <FinalizeEcs
                                dataSource={{
                                    ...this.props.createECS.formsData,
                                    estimated_price: this.props.createECS
                                        .estimated_price,
                                }}
                            />
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Finalize
                                dataSource={{
                                    ...this.props.createECS.formsData,
                                    estimated_price: this.props.createECS
                                        .estimated_price,
                                }}
                            />
                        </React.Fragment>
                    )}
                </Row>

                <div style={{ textAlign: 'right', marginTop: `24px` }}>
                    {current > 0 && (
                        <Button
                            disabled={this.props.creatingECS}
                            size="large"
                            style={{ width: '200px', marginRight: `24px` }}
                            onClick={() => this.prev()}
                        >
                            Previous
                        </Button>
                    )}
                    {current < steps.length && (
                        <Button
                            size="large"
                            style={{ width: '200px' }}
                            type="primary"
                            onClick={() => {
                                let shouldProceed = true;

                                if (this.state.current === 0) {
                                    const { formsData } = this.props.createECS;
                                    const { First } = formsData;
                                    const { dispatch } = this.props;
                                    const formValues = Object.values(First);

                                    for (
                                        let i = 0;
                                        i < formValues.length;
                                        i++
                                    ) {
                                        const { value } = formValues[i];

                                        if (
                                            this.props.helperData.quotaInstances
                                                .quota_set.instances -
                                                this.props.helperData.ecs
                                                    .length ===
                                            0
                                        ) {
                                            shouldProceed = false;
                                            message.error(
                                                'Your Quota has exceeded, so you can not proceed further'
                                            );
                                            break;
                                        }

                                        if (!value) {
                                            shouldProceed = false;
                                            message.error(
                                                'All Values Are Required'
                                            );
                                            break;
                                        }
                                    }
                                } else if (this.state.current === 1) {
                                    const { formsData } = this.props.createECS;
                                    const { Second } = formsData;
                                    const { dispatch } = this.props;
                                    const formValues = Object.values(Second);

                                    for (
                                        let i = 0;
                                        i < formValues.length;
                                        i++
                                    ) {
                                        const { value } = formValues[i];
                                        if (!value) {
                                            shouldProceed = false;
                                            message.error(
                                                'All Values Are Required'
                                            );
                                            break;
                                        }
                                    }
                                } else if (this.state.current === 2) {
                                    const { formsData } = this.props.createECS;
                                    const { Third } = formsData;
                                    const { dispatch } = this.props;
                                    const formValues = Object.values(Third);

                                    for (
                                        let i = 0;
                                        i < formValues.length;
                                        i++
                                    ) {
                                        const { value } = formValues[i];
                                        if (
                                            !value ||
                                            (Array.isArray(value) &&
                                                value.length === 0)
                                        ) {
                                            shouldProceed = false;
                                            message.error(
                                                'All Values Are Required'
                                            );
                                            break;
                                        }
                                    }
                                }

                                if (shouldProceed) {
                                    this.next();
                                }
                            }}
                        >
                            Next
                        </Button>
                    )}
                    {current === steps.length && (
                        <Button
                            size="large"
                            style={{ width: '200px' }}
                            type="primary"
                            loading={this.props.creatingECS}
                            onClick={() => {
                                this.handleSubmit();
                                message.info(
                                    'VM Creation in process. This process might take sometime'
                                );
                            }}
                        >
                            Done
                        </Button>
                    )}
                </div>
            </div>
        );
    }
}
export default connect(({ createECS, global, loading }) => ({
    createECS,
    creatingECS: loading.effects['ecs/create'],
    global,
}))(StepsForms);
