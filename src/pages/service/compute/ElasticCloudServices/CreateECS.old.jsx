import React, { PureComponent } from 'react';
import StepsForm from '@/components/StepForms';
import First from './components/IntanceCreateSteps/First';
import Second from './components/IntanceCreateSteps/Second';
import Third from './components/IntanceCreateSteps/Third';
import Fourth from './components/IntanceCreateSteps/Fourth';
import { Row, Col, Typography } from 'antd';
import Finalize from '@/components/Finalize';

export default class CreateECS extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      forms: [
        {
          Content: First,
          stepData: {
            title: 'Details',
          },
        },
        {
          Content: Second,
          stepData: {
            title: 'Source',
          },
        },
        {
          Content: Third,
          stepData: {
            title: 'Networking',
          },
        },
        {
          Content: Fourth,
          stepData: {
            title: 'Security',
          },
        },
        {
          Content: Finalize,
          stepData: {
            title: 'Finalize',
          },
        },
      ],
    };
  }

  render() {
    return (
      <div style={{ margin: `20px` }}>
        <Row gutter={20}>
          <Col span={18}>
            <div style={{ padding: `34px`, background: `#fff` }}>
              <Typography.Title
                style={{
                  fontFamily: 'Open Sans',
                  fontWeight: '600',
                  fontSize: `1.3em`,
                  color: `rgba(122, 122, 122, 0.85)`,
                  marginBottom: `34px`,
                }}
                level={3}
              >
                Instance Creation Wizard
              </Typography.Title>

              <StepsForm steps={this.state.forms} />
            </div>
          </Col>

          <Col span={6}>
            <div style={{ padding: `34px`, backgroundColor: `#fff` }}>
              <Typography.Title
                style={{
                  fontFamily: 'Open Sans',
                  fontWeight: '600',
                  fontSize: `1.3em`,
                  color: `rgba(122, 122, 122, 0.85)`,
                  marginBottom: `34px`,
                }}
                level={3}
              >
                Billing Summary
              </Typography.Title>

              <div style={{ height: `100%` }}>
                <Typography.Paragraph style={{ marginBottom: `2.3em`, fontSize: `1.2em` }}>
                  Estimated cost of this instance with selected configuration
                </Typography.Paragraph>

                <div>
                  <div style={{ marginBottom: `30px` }}>
                    <span
                      style={{
                        display: 'block',
                        color: `#0c3446`,
                        fontSize: `1.3em`,
                        paddingBottom: `6px`,
                        borderBottom: `1px solid #e5e5e5`,
                        marginBottom: `10px`,
                      }}
                    >
                      V-CPUs
                    </span>
                    <div style={{}}>
                      <h2 style={{ fontWeight: `600`, color: `red`, marginBottom: `0.4em` }}></h2>
                      <p style={{ margin: `0px`, fontSize: `0.9em` }}>
                        Cost of One V-CPU per hour is SAR
                      </p>
                    </div>
                  </div>

                  <div style={{ marginBottom: `30px` }}>
                    <span
                      style={{
                        display: 'block',
                        color: `#0c3446`,
                        fontSize: `1.3em`,
                        paddingBottom: `6px`,
                        borderBottom: `1px solid #e5e5e5`,
                        marginBottom: `10px`,
                      }}
                    >
                      RAM
                    </span>
                    <div style={{}}>
                      <h2 style={{ fontWeight: `600`, color: `red`, marginBottom: `0.4em` }}>
                        3 x 2 = 4
                      </h2>
                      <p style={{ margin: `0px`, fontSize: `0.9em` }}>
                        Cost of One VCPU per hour is 31.26
                      </p>
                    </div>
                  </div>

                  <div style={{ marginBottom: `30px` }}>
                    <span
                      style={{
                        display: 'block',
                        color: `#0c3446`,
                        fontSize: `1.3em`,
                        paddingBottom: `6px`,
                        borderBottom: `1px solid #e5e5e5`,
                        marginBottom: `10px`,
                      }}
                    >
                      OS
                    </span>
                    <div style={{}}>
                      <h2 style={{ fontWeight: `600`, color: `red`, marginBottom: `0.4em` }}>
                        3 x 2 = 4
                      </h2>
                      <p style={{ margin: `0px`, fontSize: `0.9em` }}>
                        Cost of One VCPU per hour is 31.26
                      </p>
                    </div>
                  </div>

                  <div style={{ marginBottom: `30px` }}>
                    <span
                      style={{
                        display: 'block',
                        color: `#0c3446`,
                        fontSize: `1.3em`,
                        paddingBottom: `6px`,
                        borderBottom: `1px solid #e5e5e5`,
                        marginBottom: `10px`,
                      }}
                    >
                      VOLUME
                    </span>
                    <div style={{}}>
                      <h2 style={{ fontWeight: `600`, color: `red`, marginBottom: `0.4em` }}>
                        3 x 2 = 4
                      </h2>
                      <p style={{ margin: `0px`, fontSize: `0.9em` }}>
                        Cost of One VCPU per hour is 31.26
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
