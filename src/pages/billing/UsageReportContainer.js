import React, { Component } from 'react';
import { connect } from 'dva';
import UsageReport from './UsageReport';
import {
    Row,
    Col,
    DatePicker,
    Button,
    Menu,
    Dropdown,
    Divider,
    notification,
} from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import moment from 'moment';
import download from '@/utils/download';
import { getUsageReportFileName } from './utils';
import jsonexport from 'jsonexport';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';

const startingDate = moment().startOf('month');

class UsageReportContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numPages: null,
            pageNumber: 1,
            from: startingDate,
            to: moment(),
        };
    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    };

    fetchUsageReport(from, to) {
        const { getUsageReportForInstance } = this.props;
        const fromDate = moment(from).toString();
        const toDate = moment(to).toString();

        getUsageReportForInstance(fromDate, toDate);
    }

    componentDidMount() {
        const { from, to } = this.state;
        this.fetchUsageReport(from, to);
    }

    getFromDate(e) {
        this.setState({ from: e ? e : null });
    }

    getToDate(e) {
        this.setState({ to: e ? e : null });
    }

    downloadPDFReport() {
        html2canvas(document.getElementById('usage-report-wrapper')).then(
            canvas => {
                const data = canvas.toDataURL();
                const pdfExportSetting = {
                    content: [
                        {
                            image: data,
                            width: 500,
                        },
                    ],
                };
                const fileName = getUsageReportFileName('pdf');
                pdfMake.createPdf(pdfExportSetting).download(fileName);
            }
        );
    }

    generateReport() {
        const { usageReport } = this.props;

        if (!usageReport || usageReport.length === 0) {
            notification.error({
                message: 'Usage Report',
                description: 'Sorry! Usage Report is not available.',
            });
            return;
        }

        var options = {
            rename: [
                'Name',
                'Flavor Name',
                'Active',
                'Paused',
                'Stopped',
                'Shelved',
            ],
        };

        jsonexport(usageReport, options, function(err, csv) {
            const fileName = getUsageReportFileName('csv');
            download(csv, fileName, 'application/json');
        });
    }

    searchReport() {
        const { from, to } = this.state;
        this.fetchUsageReport(from, to);
    }

    render() {
        const { from, to } = this.state;
        const { usageReport } = this.props;

        const section = (
            <div id="usage-report-wrapper">
                <UsageReport usageReport={usageReport} />
            </div>
        );
        const menu = (
            <Menu>
                <Menu.Item>
                    <Button
                        style={{ backgroundColor: '#f3f6f9' }}
                        onClick={() => this.generateReport()}
                    >
                        {' '}
                        Export in CSV{' '}
                    </Button>
                </Menu.Item>
                <Menu.Item>
                    <Button
                        style={{ backgroundColor: '#f3f6f9' }}
                        onClick={() => this.downloadPDFReport()}
                    >
                        {' '}
                        Export in PDF{' '}
                    </Button>
                    <div></div>
                </Menu.Item>
            </Menu>
        );
        return (
            <div style={{ padding: '35px' }}>
                <Row gutter={14}>
                    <Col span={4}>
                        <DatePicker
                            placeholder="Starting Date"
                            value={from}
                            format={'DD-MM-YYYY'}
                            allowClear={true}
                            onChange={this.getFromDate.bind(this)}
                        />
                    </Col>

                    <Col span={4}>
                        <DatePicker
                            placeholder="Ending Date"
                            value={to}
                            format={'DD-MM-YYYY'}
                            onChange={this.getToDate.bind(this)}
                        />
                    </Col>

                    <Col span={2}>
                        <Button
                            style={{ backgroundColor: '#f3f6f9' }}
                            onClick={() => this.searchReport()}
                            disabled={!this.state.from || !this.state.to}
                        >
                            {' '}
                            Search{' '}
                        </Button>
                    </Col>
                    <Col span={2}>
                        <Dropdown overlay={menu} placement="bottomLeft">
                            <Button>Export</Button>
                        </Dropdown>
                    </Col>

                    <Col span={12}>
                        <Button
                            style={{ float: 'right' }}
                            icon="redo"
                            onClick={() => this.searchReport()}
                            disabled={!this.state.from || !this.state.to}
                        >
                            {' '}
                            Refresh{' '}
                        </Button>
                    </Col>
                </Row>

                <Divider width="200px" />
                {section}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { usageReport } = state.report;
    return {
        usageReport,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getUsageReportForInstance: (from, to) =>
            dispatch({
                type: 'report/usageReportForInstances',
                payload: { from, to },
            }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UsageReportContainer);
