import React, { Component } from 'react';
import EmptyPage from '@/pages/EmptyPage';
import Analysis from './Analysis';

class AnalysisIndex extends Component {
    state = {
        hasNoProject: false,
    };
    componentDidMount() {
        const detasadUserTypeString =
            localStorage.getItem('detasadUserType') || '[]';
        const detasadUserType = JSON.parse(detasadUserTypeString);

        const userString = localStorage.getItem('user') || '';
        const user = JSON.parse(userString);

        if (
            (Array.isArray(detasadUserType) &&
                detasadUserType.includes('domainScope') &&
                !user.project) ||
            user.user.length === 0
        ) {
            this.setState({
                hasNoProject: true,
            });
        }
    }

    render() {
        const { hasNoProject } = this.state;
        if (hasNoProject) {
            return (
                <EmptyPage
                    title="The Admin has no project"
                    buttonText="Go to IAM"
                    link="/service/iam/account"
                />
            );
        }

        return <Analysis />;
    }
}
export default AnalysisIndex;
