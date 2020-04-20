import React, { Component, Suspense } from 'react';

import { Dispatch } from 'redux';
import { GridContent } from '@ant-design/pro-layout';
import { RadioChangeEvent } from 'antd/es/radio';
import { RangePickerValue } from 'antd/es/date-picker/interface';
import { connect } from 'dva';
import PageLoading from './components/PageLoading';
import { getTimeDistance } from './utils/utils';
import { AnalysisData } from './data';
import styles from './style.less';

const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'));

interface AnalysisProps {
    dashboardAnalysis: AnalysisData;
    dispatch: Dispatch<any>;
    loading: boolean;
}

interface AnalysisState {
    salesType: 'all' | 'online' | 'stores';
    currentTabKey: string;
    rangePickerValue: RangePickerValue;
}

@connect(
    ({
        loading,
        stats,
    }: {
        dashboardAnalysis: any;
        loading: {
            effects: { [key: string]: boolean };
        };
        stats: any;
    }) => ({
        fetchingVolumes: loading.effects['evs/update'],
        stats,
    })
)
class Analysis extends Component<AnalysisProps, AnalysisState> {
    state: AnalysisState = {
        salesType: 'all',
        currentTabKey: '',
        rangePickerValue: getTimeDistance('year'),
    };

    reqRef: number = 0;

    timeoutId: number = 0;

    render() {
        const { loading } = this.props;
        return (
            <div
                style={{
                    padding: `30px`,
                    marginTop: `60px`,
                }}
            >
                <GridContent>
                    <React.Fragment>
                        <Suspense fallback={<PageLoading />}>
                            <IntroduceRow loading={loading} />
                        </Suspense>
                    </React.Fragment>
                </GridContent>
            </div>
        );
    }
}
export default Analysis;
