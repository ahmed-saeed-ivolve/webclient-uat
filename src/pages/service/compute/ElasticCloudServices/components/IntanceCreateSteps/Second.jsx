import React, { PureComponent, Fragment } from 'react';
import {
    Row,
    Col,
    Typography,
    Divider,
    Timeline,
    Tabs,
    Form,
    Input,
    Radio,
    Select,
    Slider,
    InputNumber,
    notification,
} from 'antd';
import ImageDisplayBox from '@/components/InstanceImages/ImageDisplayBox';
import { connect } from 'dva';
import FormRow from '@/pages/service/components/FormRow';
import { timingSafeEqual } from 'crypto';
import { getPageQuery } from '../../../../../../utils/utils';
import { Console } from '@/services/logging';
import { initialFormData } from '@/models/createECS';
import { debounce } from 'lodash';

const { Option } = Select;
const DEFAULT_MIN_DISK = 50;

class Second extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            minVal: undefined,
            maxVal: undefined,
            inputValue: '',
            choice: '',
            disabled: false,
            billingmode: 'on_demand',
            marks: {},
            filteredFlavor: [],
            clearFilters: false,
            category: 'all',
        };
        this.handleChange = this.handleChange.bind(this);
        this.getFlavorBill = this.getFlavorBill.bind(this);
        this.setMode = this.setMode.bind(this);
        this.setMarksForDiskSpace = this.setMarksForDiskSpace.bind(this);
    }

    setMarksForDiskSpace(minDiskForImage = DEFAULT_MIN_DISK) {
        const marks = {};
        minDiskForImage =
            minDiskForImage > 0 ? minDiskForImage : DEFAULT_MIN_DISK;
        if (minDiskForImage === this.state.minVal) {
            return;
        }
        for (let i = 1; i <= 10; i++) {
            const mark = minDiskForImage * i;
            marks[mark] = mark.toString();
        }

        this.setState({
            minVal: minDiskForImage,
            maxVal: minDiskForImage * 10,
            marks,
        });

        this.props.form.setFieldsValue({
            disk_size: minDiskForImage,
        });
    }

    componentDidMount() {
        const imageId = getPageQuery()?.image_id;

        const { dispatch, form, formsData } = this.props;
        if (imageId) {
            this.setState({ imageId });
        }

        this.setMarksForDiskSpace();

        this.setDiskSize(this.state.inputValue);
        const result = {
            evs: formsData.Second.volume_id.name,
            updatedvalue_disk: this.state.inputValue,
        };

        var list = [];
        const filter = this.props.helperData.flavor.map(item => {
            if (
                formsData.Second.billing_mode.value === 'OD' &&
                item.name.toLowerCase().includes('on-demand')
            ) {
                list.push(item);
            }
        });
        this.setState({ filteredFlavor: list });
        // dispatch({
        //     type: 'price/pricingServiceVolume',
        //     payload: { volume: result },
        // });
    }

    componentDidUpdate(prevProps, prevState) {
        const { billingmode } = this.state;
        const { formsData, dispatch, helperData } = this.props;
        if (
            prevProps.formsData.Second.image_id.value !==
            formsData.Second.image_id.value
        ) {
            let minDiskSpace = DEFAULT_MIN_DISK;
            if (formsData.Second.image_id.value) {
                const minDiskForCurrentImage = helperData.ims.find(
                    image => image.id === formsData.Second.image_id.value
                );
                minDiskSpace = minDiskForCurrentImage.min_disk;
            }
            this.setMarksForDiskSpace(minDiskSpace);
        }
        if (
            prevProps.formsData.Second.flavor_id.value !==
                formsData.Second.flavor_id.value ||
            prevProps.formsData.Second.pay_term.value !==
                formsData.Second.pay_term.value ||
            prevProps.formsData.Second.billing_mode.value !==
                formsData.Second.billing_mode.value ||
            prevProps.formsData.Second.duration.value !==
                formsData.Second.duration.value ||
            prevProps.formsData.Second.disk_size.value !==
                formsData.Second.disk_size.value ||
            prevProps.formsData.Second.volume_id.value !==
                formsData.Second.volume_id.value ||
            this.state.category !== prevState?.category
        ) {
            if (
                prevProps.formsData.Second.flavor_id.value !==
                    formsData.Second.flavor_id.value ||
                prevProps.formsData.Second.pay_term.value !==
                    formsData.Second.pay_term.value ||
                prevProps.formsData.Second.billing_mode.value !==
                    formsData.Second.billing_mode.value ||
                prevProps.formsData.Second.duration.value !==
                    formsData.Second.duration.value ||
                this.state.category !== prevState?.category
            ) {
                prevProps.formsData.Second.flavor_id.value = '';
            }
            var list = [];
            const filter = this.props.helperData.flavor.map(item => {
                if (formsData.Second.billing_mode.value === 'OD') {
                    if (
                        this.state.category === 'all' &&
                        item.name.toLowerCase().includes('on-demand')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'General-1' &&
                        item.name.toLowerCase().includes('on-demand') &&
                        item.name.includes('General-1')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'General-2' &&
                        item.name.toLowerCase().includes('on-demand') &&
                        item.name.includes('General-2')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Compute-1' &&
                        item.name.toLowerCase().includes('on-demand') &&
                        item.name.includes('Compute-1')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Compute-2' &&
                        item.name.toLowerCase().includes('on-demand') &&
                        item.name.includes('Compute-2')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Memory-1' &&
                        item.name.toLowerCase().includes('on-demand') &&
                        item.name.includes('Memory-1')
                    ) {
                        list.push(item);
                    }
                } else if (
                    formsData.Second.billing_mode.value ===
                        'reserve_instance' &&
                    formsData.Second.pay_term.value === 'NU' &&
                    formsData.Second.duration.value === '1Y' &&
                    item.name.toLowerCase().includes('1 year no upfront')
                ) {
                    if (this.state.category === 'all') {
                        list.push(item);
                    } else if (
                        this.state.category === 'General-1' &&
                        item.name.includes('General-1')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'General-2' &&
                        item.name.includes('General-2')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Compute-1' &&
                        item.name.includes('Compute-1')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Compute-2' &&
                        item.name.includes('Compute-2')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Memory-1' &&
                        item.name.includes('Memory-1')
                    ) {
                        list.push(item);
                    }
                } else if (
                    formsData.Second.billing_mode.value ===
                        'reserve_instance' &&
                    formsData.Second.pay_term.value === 'NU' &&
                    formsData.Second.duration.value === '2Y' &&
                    item.name.toLowerCase().includes('2 years no upfront')
                ) {
                    if (this.state.category === 'all') {
                        list.push(item);
                    } else if (
                        this.state.category === 'General-1' &&
                        item.name.includes('General-1')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'General-2' &&
                        item.name.includes('General-2')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Compute-1' &&
                        item.name.includes('Compute-1')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Compute-2' &&
                        item.name.includes('Compute-2')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Memory-1' &&
                        item.name.includes('Memory-1')
                    ) {
                        list.push(item);
                    }
                } else if (
                    formsData.Second.billing_mode.value ===
                        'reserve_instance' &&
                    formsData.Second.pay_term.value === 'NU' &&
                    formsData.Second.duration.value === '3Y' &&
                    item.name.toLowerCase().includes('3 years no upfront')
                ) {
                    if (this.state.category === 'all') {
                        list.push(item);
                    } else if (
                        this.state.category === 'General-1' &&
                        item.name.includes('General-1')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'General-2' &&
                        item.name.includes('General-2')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Compute-1' &&
                        item.name.includes('Compute-1')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Compute-2' &&
                        item.name.includes('Compute-2')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Memory-1' &&
                        item.name.includes('Memory-1')
                    ) {
                        list.push(item);
                    }
                } else if (
                    formsData.Second.billing_mode.value ===
                        'reserve_instance' &&
                    formsData.Second.pay_term.value === 'PU' &&
                    formsData.Second.duration.value === '1Y' &&
                    item.name.toLowerCase().includes('1 year partial upfront')
                ) {
                    if (this.state.category === 'all') {
                        list.push(item);
                    } else if (
                        this.state.category === 'General-1' &&
                        item.name.includes('General-1')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'General-2' &&
                        item.name.includes('General-2')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Compute-1' &&
                        item.name.includes('Compute-1')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Compute-2' &&
                        item.name.includes('Compute-2')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Memory-1' &&
                        item.name.includes('Memory-1')
                    ) {
                        list.push(item);
                    }
                } else if (
                    formsData.Second.billing_mode.value ===
                        'reserve_instance' &&
                    formsData.Second.pay_term.value === 'PU' &&
                    formsData.Second.duration.value === '2Y' &&
                    item.name.toLowerCase().includes('2 years partial upfront')
                ) {
                    if (this.state.category === 'all') {
                        list.push(item);
                    } else if (
                        this.state.category === 'General-1' &&
                        item.name.includes('General-1')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'General-2' &&
                        item.name.includes('General-2')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Compute-1' &&
                        item.name.includes('Compute-1')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Compute-2' &&
                        item.name.includes('Compute-2')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Memory-1' &&
                        item.name.includes('Memory-1')
                    ) {
                        list.push(item);
                    }
                } else if (
                    formsData.Second.billing_mode.value ===
                        'reserve_instance' &&
                    formsData.Second.pay_term.value === 'PU' &&
                    formsData.Second.duration.value === '3Y' &&
                    item.name.toLowerCase().includes('3 years partial upfront')
                ) {
                    if (this.state.category === 'all') {
                        list.push(item);
                    } else if (
                        this.state.category === 'General-1' &&
                        item.name.includes('General-1')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'General-2' &&
                        item.name.includes('General-2')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Compute-1' &&
                        item.name.includes('Compute-1')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Compute-2' &&
                        item.name.includes('Compute-2')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Memory-1' &&
                        item.name.includes('Memory-1')
                    ) {
                        list.push(item);
                    }
                } else if (
                    formsData.Second.billing_mode.value ===
                        'reserve_instance' &&
                    formsData.Second.pay_term.value === 'FU' &&
                    formsData.Second.duration.value === '1Y' &&
                    item.name.toLowerCase().includes('1 year full upfront')
                ) {
                    if (this.state.category === 'all') {
                        list.push(item);
                    } else if (
                        this.state.category === 'General-1' &&
                        item.name.includes('General-1')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'General-2' &&
                        item.name.includes('General-2')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Compute-1' &&
                        item.name.includes('Compute-1')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Compute-2' &&
                        item.name.includes('Compute-2')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Memory-1' &&
                        item.name.includes('Memory-1')
                    ) {
                        list.push(item);
                    }
                } else if (
                    formsData.Second.billing_mode.value ===
                        'reserve_instance' &&
                    formsData.Second.pay_term.value === 'FU' &&
                    formsData.Second.duration.value === '2Y' &&
                    item.name.toLowerCase().includes('2 years full upfront')
                ) {
                    if (this.state.category === 'all') {
                        list.push(item);
                    } else if (
                        this.state.category === 'General-1' &&
                        item.name.includes('General-1')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'General-2' &&
                        item.name.includes('General-2')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Compute-1' &&
                        item.name.includes('Compute-1')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Compute-2' &&
                        item.name.includes('Compute-2')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Memory-1' &&
                        item.nameincludes('Memory-1')
                    ) {
                        list.push(item);
                    }
                } else if (
                    formsData.Second.billing_mode.value ===
                        'reserve_instance' &&
                    formsData.Second.pay_term.value === 'FU' &&
                    formsData.Second.duration.value === '3Y' &&
                    item.name.toLowerCase().includes('3 years full upfront')
                ) {
                    if (this.state.category === 'all') {
                        list.push(item);
                    } else if (
                        this.state.category === 'General-1' &&
                        item.name.includes('General-1')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'General-2' &&
                        item.name.includes('General-2')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Compute-1' &&
                        item.name.includes('Compute-1')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Compute-2' &&
                        item.name.includes('Compute-2')
                    ) {
                        list.push(item);
                    } else if (
                        this.state.category === 'Memory-1' &&
                        item.name.includes('Memory-1')
                    ) {
                        list.push(item);
                    }
                }
            });

            const filteredName = this.state.filteredFlavor.filter(
                item => item.id === formsData.Second.flavor_id.value
            )[0]?.name;
            this.setState({ filteredFlavor: list });
            const prevvalue = prevProps.formsData.Second.flavor_id.value;

            const prevvalue_disk = prevProps.formsData.Second.disk_size.value;

            const updatedvalue_disk = formsData.Second.disk_size.value;

            const previousBillingmode =
                prevProps.formsData.Second.billing_mode.value;
            const updatedBillingmode = formsData.Second.billing_mode.value;

            const previousPayterm = prevProps.formsData.Second.pay_term.value;
            const updatedPayterm = formsData.Second.pay_term.value;

            const previousDuration = prevProps.formsData.Second.duration.value;
            const updatedDuration = formsData.Second.duration.value;

            const previousVolumeType =
                prevProps.formsData.Second.volume_id.value;
            const updatedVolumeType = formsData.Second.volume_id.value;
            if (filteredName === undefined) {
                dispatch({
                    type: 'price/clearPricingFlavor',
                });
            }
            if (
                prevvalue !== filteredName ||
                previousBillingmode !== updatedBillingmode ||
                previousPayterm !== updatedPayterm ||
                previousDuration !== updatedDuration
            ) {
                const result = {
                    name: filteredName === undefined ? ' ' : filteredName,
                    updatedDuration: updatedDuration,
                    updatedPayterm: updatedPayterm,
                    updatedBillingmode: updatedBillingmode,
                };

                dispatch({
                    type: 'price/pricingService',
                    payload: { flavor: result },
                });
            }

            if (
                prevvalue_disk !== updatedvalue_disk ||
                previousVolumeType !== updatedVolumeType
            ) {
                if (updatedVolumeType !== '') {
                    const filteredType = this.props.helperData.evs.volumeTypes.filter(
                        item => item.id === updatedVolumeType
                    )[0].name;
                    const result = {
                        evs: filteredType,
                        updatedvalue_disk,
                    };

                    debounce(() => {
                        dispatch({
                            type: 'price/pricingServiceVolume',
                            payload: { volume: result },
                        });
                    }, 250)();
                }
            }
        }
    }

    getFlavorBill(flavor_id) {
        let { dispatch } = this.props;
        dispatch({
            type: `createECS/quote`,
            payload: { flavor_id, method: 'Billing.quote' },
        });
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({ selectedImage: e.target.value });
    }

    onChange(e) {
        this.setState({ category: e.target.value });
    }

    handleChangeFlavor = value => {
        const filteredName = this.props.helperData.flavor.filter(
            item => item.id === value
        )[0]?.name;

        const clearFilter = this.state.filteredFlavor.filter(item => {
            if (!item.name.includes(filteredName)) {
                this.setState({ clearFilters: true });
            }
        });
    };

    setDiskSize = value => {
        this.setState({
            inputValue: value,
        });
    };
    setMode(e) {
        const { dispatch } = this.props;
        const { billingmode } = this.state;
        e.preventDefault();
        this.setState({
            billingmode: e.target.value,
        });

        dispatch({
            type: 'createECS/chanegBillingMode',
            payload: e.target.value,
        });
    }

    render() {
        const { imageId, marks } = this.state;
        const { billingmode } = this.props;
        let { inputValue, disabled } = this.state;
        const filteredImage = Object.keys(this.props.formsData).includes(
            'image_id'
        )
            ? this.props.helperData.ims.filter(
                  items => items.id === this.props.formsData.image_id
              )
            : null;
        const { data } = this.props;

        const getFieldDecorator = this.props.form.getFieldDecorator;

        return (
            <Row>
                <Col lg={16}>
                    <Form>
                        <FormRow
                            style={{ marginBottom: `28px` }}
                            field={
                                <Radio.Group buttonStyle="solid">
                                    <Radio.Button
                                        value="OD"
                                        onChange={this.setMode}
                                    >
                                        On Demand
                                    </Radio.Button>
                                    <Radio.Button
                                        value="reserve_instance"
                                        onChange={this.setMode}
                                    >
                                        Reserve Instance
                                    </Radio.Button>
                                    {billingmode === 'reserve_instance' && (
                                        <Fragment>
                                            <Form.Item
                                                style={{ marginTop: '30px' }}
                                            >
                                                <Typography.Text
                                                    style={{
                                                        marginRight: '20px',
                                                        color: '#2b7797',
                                                        fontSize: '16.7px',
                                                    }}
                                                >
                                                    Pay Term
                                                </Typography.Text>
                                                {getFieldDecorator('pay_term')(
                                                    <Radio.Group buttonStyle="solid">
                                                        <Radio.Button value="NU">
                                                            No Upfront
                                                        </Radio.Button>
                                                        <Radio.Button value="PU">
                                                            Partial Upfront
                                                        </Radio.Button>
                                                        <Radio.Button value="FU">
                                                            Full Upfront
                                                        </Radio.Button>
                                                    </Radio.Group>
                                                )}
                                            </Form.Item>

                                            <Form.Item
                                                style={{ marginTop: '30px' }}
                                            >
                                                <Typography.Text
                                                    style={{
                                                        marginRight: '25px',
                                                        color: '#2b7797',
                                                        fontSize: '16.7px',
                                                    }}
                                                >
                                                    Duration
                                                </Typography.Text>
                                                {getFieldDecorator('duration')(
                                                    <Radio.Group buttonStyle="solid">
                                                        <Radio.Button value="1Y">
                                                            1 Year
                                                        </Radio.Button>

                                                        <Radio.Button value="3Y">
                                                            3 Year
                                                        </Radio.Button>
                                                    </Radio.Group>
                                                )}
                                            </Form.Item>
                                        </Fragment>
                                    )}
                                </Radio.Group>
                            }
                            title={'Billing Mode'}
                            paragraph={''}
                            dataKey="billing_mode"
                            getFieldDecorator={
                                this.props.form.getFieldDecorator
                            }
                        />

                        <Typography.Title
                            style={{
                                fontSize: '1.2em',
                                fontFamily: 'Open Sans',
                                fontWeight: 600,
                                color: '#2C7594',
                            }}
                        >
                            {' '}
                            Select Flavor{' '}
                        </Typography.Title>
                        <Col style={{ paddingTop: '10px' }}>
                            <Radio.Group
                                defaultValue="all"
                                buttonStyle="solid"
                                onChange={this.onChange.bind(this)}
                            >
                                <Radio.Button value="all"> All </Radio.Button>
                                <Radio.Button value="General-1">
                                    {' '}
                                    General 1{' '}
                                </Radio.Button>
                                <Radio.Button value="General-2">
                                    {' '}
                                    General 2{' '}
                                </Radio.Button>
                                <Radio.Button value="Compute-1">
                                    {' '}
                                    Compute 1{' '}
                                </Radio.Button>
                                <Radio.Button value="Compute-2">
                                    {' '}
                                    Compute 2{' '}
                                </Radio.Button>
                                <Radio.Button value="Memory-1">
                                    {' '}
                                    Memory 1{' '}
                                </Radio.Button>
                            </Radio.Group>
                        </Col>

                        <FormRow
                            style={{ marginBottom: `28px` }}
                            field={
                                <Select
                                    style={{ paddingTop: '10px' }}
                                    size="default"
                                    showSearch
                                    optionFilterProp="name"
                                    filterOption={(input, option) =>
                                        option.props.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {this.state?.filteredFlavor.map(item => {
                                        return (
                                            <Option
                                                key={item.name}
                                                value={item.id}
                                            >
                                                {`${item.name} / ${item.ram} MB RAM / ${item.vcpus} VCPUS`.toUpperCase()}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            }
                            dataKey="flavor_id"
                            decorator={{}}
                            getFieldDecorator={
                                this.props.form.getFieldDecorator
                            }
                        />

                        <FormRow
                            style={{ marginBottom: `28px` }}
                            default={
                                filteredImage !== null
                                    ? filteredImage[0].id
                                    : null
                            }
                            field={
                                this.props.marketplace === false ? (
                                    <Select style={{ width: '500px' }}>
                                        <Option key={'0'} value={''}>
                                            Select an image
                                        </Option>
                                        {this.props.helperData.ims.map(item => (
                                            <Option
                                                key={item.name}
                                                value={item.id}
                                            >
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                ) : (
                                    <Select
                                        disabled={
                                            this.props.marketplace
                                                ? true
                                                : false
                                        }
                                        style={{ width: '400px' }}
                                    >
                                        <Option
                                            key={filteredImage[0].name}
                                            value={filteredImage[0].id}
                                        >
                                            {filteredImage[0].name}
                                        </Option>
                                    </Select>
                                )
                            }
                            title={'Select Image'}
                            paragraph={''}
                            dataKey="image_id"
                            decorator={{}}
                            getFieldDecorator={
                                this.props.form.getFieldDecorator
                            }
                        />

                        <FormRow
                            style={{ marginBottom: `28px` }}
                            field={
                                <Select
                                    size="default"
                                    showSearch
                                    optionFilterProp="name"
                                    filterOption={(input, option) =>
                                        option.props.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {this.props.helperData.evs.volumeTypes.map(
                                        item => (
                                            <Option
                                                key={item.name}
                                                value={item.id}
                                            >
                                                {item.name}
                                            </Option>
                                        )
                                    )}
                                </Select>
                            }
                            title={'Select Volume'}
                            dataKey="volume_id"
                            decorator={
                                {
                                    // rules: [{ required: false, message: "you must select a flavor" }],
                                }
                            }
                            getFieldDecorator={
                                this.props.form.getFieldDecorator
                            }
                        />
                        <FormRow
                            disabled={
                                this.props.formsData.image_id ? false : true
                            }
                            style={{ marginBottom: `28px` }}
                            field={
                                <Slider
                                    marks={marks}
                                    min={this.state.minVal}
                                    max={this.state.maxVal}
                                    checked={disabled}
                                />
                            }
                            title={'Disk Size'}
                            dataKey="disk_size"
                            decorator={{}}
                            getFieldDecorator={
                                this.props.form.getFieldDecorator
                            }
                        />
                    </Form>
                </Col>
            </Row>
        );
    }
}

export default connect(({ createECS }) => {
    return {
        ...createECS,
    };
})(
    Form.create({
        onFieldsChange(props, changedFields) {
            const { dispatch } = props;
            dispatch({
                type: `createECS/updateFormData`,
                payload: {
                    formIndex: 'Second',
                    value: {
                        ...changedFields,
                    },
                },
            });
        },
        mapPropsToFields(props) {
            const { formsData } = props;
            return Object.entries(formsData.Second).reduce(
                (inital, values) => ({
                    ...inital,
                    [values[0]]: Form.createFormField({ ...values[1] }),
                }),
                {}
            );
        },
    })(Second)
);
