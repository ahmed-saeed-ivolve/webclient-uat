import React, { PureComponent } from 'react';
import Link from 'umi/link';
import { Button, Typography } from 'antd';
const { Title } = Typography;

class EmptyPage extends PureComponent {
    render() {
        const { title, buttonText } = this.props;
        return (
            <div
                style={{
                    textAlign: 'center',
                    marginLeft: 'auto',
                    marginLeft: 'auto',
                    transform: 'translateY(80%)',
                    height: '50vh',
                }}
            >
                <Title level={2}>{title}</Title>
                <Button type="primary">
                    <Link to="/service/iam/account">{buttonText}</Link>
                </Button>
            </div>
        );
    }
}

export default EmptyPage;
