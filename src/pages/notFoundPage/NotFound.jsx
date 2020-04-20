import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button} from 'antd';
import router from 'umi/router';
import styles from '../notFoundPage/NotfoundCss/style.less';

class NotFound extends React.Component{

    render(){
        return(
        	<div id={styles["notfound"]}>
		   <div class={styles["notfound"]}>
			<div class={styles["notfound-bg"]}>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<h1>oops!</h1>
			<h2>Error 404 : Page Not Found</h2>
			<Button type="primary" onClick={() => window.history.back()}>
        Back 
      </Button>
		</div>
	</div>
        ) 
    }
}
export default NotFound;