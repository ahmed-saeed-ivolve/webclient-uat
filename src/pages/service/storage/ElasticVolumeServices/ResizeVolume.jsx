import {
	Drawer,
	Form,
	Button,
	Col,
	Row,
	Input,
	Select,
	DatePicker,
	Icon,
	Slider,
	InputNumber,
	Typography,
	Radio,
	Tooltip
} from 'antd';
import ReactDOM from 'react-dom';
import React from 'react';
import { connect } from 'dva';
import FormRow from '@/pages/service/components/FormRow';

const { Option } = Select;
const marks = {
	5: '5',
	50: '50',
	100: '100',
	150: '150',
	200: '200',
	250: '250',
	300: '300',
	350: '350',
	400: '400',
	450: '450',
	500: '500'
};

class CreateEVS extends React.Component {
	state = {
		minVal: 5,
		maxVal: 500,
		inputValue: 5,
		choice: '',
		disabled: false
	};
	onClose = () => {
		this.props.whenCloseCalled(false);
	};

	onChange = (value) => {
		this.setState({
			inputValue: value
		});
	};

	handleVolumeSource(value) {
		this.setState({ choice: value });
	}

	handleSubmit = (e) => {
		e.preventDefault();

		this.props.form.validateFields((err, values) => {
			if (!err) {
				const { keys, names } = values;
				values['volume_id'] = this.props.mountedData.id;
				values['size'] = this.state.inputValue;
				this.props.dispatch({
					type: 'evs/resize',
					payload: values
				});
			}
		});
	};

	componentDidMount() {
		var selectedVolume = this.props.evs.list.find((item) => item.id === this.props.mountedData.id);
		this.setState({
			minVal: selectedVolume.size,
			inputValue: selectedVolume.size
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		let { inputValue, disabled } = this.state;
		var selectedVolume = this.props.evs.list.find((item) => item.id === this.props.mountedData.id);
		return (
			<div
				style={{
					marginBottom: `0`,
					backgroundColor: `#fff`,
					padding: this.props.type !== 'modal' ? `34px` : `0px`
				}}
			>
				<Form onSubmit={this.handleSubmit} layout="vertical" hideRequiredMark>
					<Row gutter={16} style={{ paddingBottom: '30px' }}>
						<Col span={24}>
							<Typography.Title
								level={4}
								style={{
									fontSize: ` 1.2em`,

									fontFamily: 'Open Sans',
									fontWeight: 600,
									color: `#2b7797`
								}}
							>
								Name/Id
							</Typography.Title>
							<Typography.Paragraph
								style={{
									color: `#747373`,
									fontSize: `1.1em`,
									marginBottom: `0.3em`
								}}
							/>
							<Typography>
								{' '}
								{selectedVolume.name === '' ? selectedVolume.id : selectedVolume.name}{' '}
							</Typography>
						</Col>
					</Row>

					<Row gutter={16} style={{ paddingBottom: '30px' }}>
						<Col span={24}>
							<Typography.Title
								level={4}
								style={{
									fontSize: ` 1.2em`,

									fontFamily: 'Open Sans',
									fontWeight: 600,
									color: `#2b7797`
								}}
							>
								Current Size
							</Typography.Title>
							<Typography.Paragraph
								style={{
									color: `#747373`,
									fontSize: `1.1em`,
									marginBottom: `0.3em`
								}}
							/>
							<Typography> {selectedVolume.size + ' GB'} </Typography>
						</Col>
					</Row>

					<Row style={{ paddingBottom: '30px' }}>
						<Col span={24}>
							<Typography.Title
								level={4}
								style={{
									fontSize: ` 1.2em`,

									fontFamily: 'Open Sans',
									fontWeight: 600,
									color: `#2b7797`
								}}
							>
								New Size{' '}
								<Tooltip title="New Size should be greater than Current Size">
									<Icon
										style={{
											color: 'black',
											marginLeft: '8px'
										}}
										type="question-circle"
									/>
								</Tooltip>
							</Typography.Title>
							<Typography.Paragraph
								style={{
									color: `#747373`,
									fontSize: `1.1em`,
									marginBottom: `0.3em`
								}}
							/>
							<Form.Item style={{ width: '800px' }}>
								{getFieldDecorator('size')(
									<Col span={14}>
										<Slider
											marks={marks}
											min={5}
											defaultValue={[ 5, this.state.minVal ]}
											max={500}
											onChange={this.onChange}
											checked={disabled}
											value={typeof inputValue === 'number' ? inputValue : this.state.inputValue}
										/>
										{this.state.inputValue < parseInt(selectedVolume.size) ? (
											<Typography style={{ color: 'red' }}>
												Volume size cannot be decreased
											</Typography>
										) : null}
										{this.state.inputValue % 1 !== 0 ? (
											<Typography style={{ color: 'red' }}>
												Volume size must be integer
											</Typography>
										) : null}
									</Col>
								)}
								<Col span={4}>
									<InputNumber
										size="default"
										style={{
											marginLeft: '25px',
											marginTop: '7px'
										}}
										min={5}
										max={500}
										onChange={this.onChange}
										value={inputValue}
									/>
								</Col>
							</Form.Item>
						</Col>
					</Row>

					<Form.Item>
						<Button
							disabled={
								this.state.inputValue <= parseInt(selectedVolume.size) ||
								this.state.inputValue % 1 !== 0
							}
							loading={this.props.resizingVM}
							style={{ width: '30%', height: '45px' }}
							type="primary"
							htmlType="submit"
						>
							Submit
						</Button>
					</Form.Item>
				</Form>
			</div>
		);
	}
}

export default connect((state) => {
	return {
		resizingVM: state.loading.effects['evs/resize'],

		evs: state.evs
	};
})(Form.create()(CreateEVS));
