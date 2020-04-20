import { Statistic, Row, Col, Icon } from 'antd';


export default () => {
    return (
        <Row gutter={16}>
            <Col span={5}>
                <div style={{ }}>
                    <Statistic title="Total Instances" value={1128} />
                </div>

            </Col>
            <Col span={5}>
                <div style={{ }}>
                    <Statistic title="Switched on" value={93} suffix="/ 100" />
                </div>
            </Col>
        </Row>
    )
}


