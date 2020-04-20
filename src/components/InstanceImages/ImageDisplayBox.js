import styles from './ImageDisplayBox.less';
import {useState} from 'react'
import PropTypes from 'prop-types';

import { Select } from 'antd'

const { Option } = Select;

const ImageDisplayBox = (props) => {


    const { style = {}, imageSource, type, osVersion, onSelected } = props;

    const innerInlineStyles = {

    }

    return (
        <div style={{ display: `inline-block`, width: `100%` }}>
            <div className={styles[`image-display-box-main`]} style={{ ...innerInlineStyles, ...style }}>
                <div className={styles[`image-display-box-inner`]}>
                    <div className={styles['image-display-box-image']}>
                        <img src={imageSource} />
                    </div>
                    <div className={styles['image-display-box-label']}>{osVersion}</div>
                </div>
                <div style={{ borderTop: `1px solid #e5e5e5` }}>
                    <Select className={'my-select'} placeholder="Select Version" style={{ width: `100%`, padding: `10px`, border: `0` }}>
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>

                    </Select>
                </div>


            </div>
        </div>

    )
}


PropTypes.ImageDisplayBox = {
    imageSource: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    osVersion: PropTypes.string.isRequired,
    onSelected: PropTypes.func
}


export default ImageDisplayBox;