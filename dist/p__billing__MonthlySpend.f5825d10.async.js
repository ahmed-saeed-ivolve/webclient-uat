(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[29],{dkDh:function(t,e,a){"use strict";var n=a("g09b"),l=a("tAuX");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,a("g9YV");var u=n(a("wCAj"));a("7Kak");var r=n(a("9yH6"));a("T2oS");var o=n(a("W9HT"));a("Pwec");var d,f,i=n(a("CtXQ")),c=n(a("2Taf")),s=n(a("vZ4D")),h=n(a("l4Ni")),p=n(a("ujKo")),m=n(a("MhPg")),g=n(a("p0pE")),v=l(a("q1tI")),y=n(a("+JSP")),M=a("MuoO"),b=a("fVDY"),S=n(a("wd/R")),E=[{title:"Month",dataIndex:"month",key:"month",width:150},{title:"Amount Due(SAR)",dataIndex:"rate",key:"rate",width:150,align:"center"}],k=(d=(0,M.connect)(function(t){var e=t.global,a=t.loading;return{isLoadingData:a.effects["global/fetchSpends"],global:(0,g.default)({},e)}}),d(f=function(t){function e(t){var a;return(0,c.default)(this,e),a=(0,h.default)(this,(0,p.default)(e).call(this,t)),a.state={date:null,summary:[]},a}return(0,m.default)(e,t),(0,s.default)(e,[{key:"handleMonthSelect",value:function(t){var e=this.props.dispatch;e({type:"global/fetchSpends",payload:{num_months:t.target.value,groupby:"res_type"}})}},{key:"componentDidMount",value:function(){var t=this.props.dispatch;t({type:"global/fetchSpends",payload:{num_months:3,groupby:"res_type"}})}},{key:"componentDidUpdate",value:function(t){this.props.global.spends.length}},{key:"transformToTabular",value:function(t){var e=null;try{e=t.map(function(t,e,a){var n=t.summary;if(0==n.length){var l=a.length,u=(0,S.default)().subtract(l-1-e,"months").format("MMMM YYYY");return{month:u,rate:"0 SAR"}}var r=n.reduce(function(t,e){return t+Number(e.rate)},0);return{month:(0,S.default)(n[0].begin).format("MMMM YYYY"),rate:"".concat(r," SAR")}})}catch(t){}return e}},{key:"render",value:function(){var t=this;if(this.props.isLoadingData)return v.default.createElement("div",{style:{textAlign:"center",marginTop:"150px"}},v.default.createElement(o.default,{indicator:v.default.createElement(i.default,{type:"loading",style:{fontSize:34},spin:!0})}));var e=this.props.global.spends,a=(0,b.transform)(e),n=[];return e.length>0&&(n=this.transformToTabular(e)),v.default.createElement(v.default.Fragment,null,v.default.createElement("div",{style:{padding:"35px"}},v.default.createElement(r.default.Group,{defaultValue:"3",buttonStyle:"solid"},v.default.createElement(r.default.Button,{value:"3",onChange:function(e){return t.handleMonthSelect(e)}},"Last 3 Months"),v.default.createElement(r.default.Button,{value:"6",onChange:function(e){return t.handleMonthSelect(e)}},"Last 6 Months"),v.default.createElement(r.default.Button,{value:"12",onChange:function(e){return t.handleMonthSelect(e)}},"Last 12 Months")),v.default.createElement(y.default,{dataSource:a}),v.default.createElement(u.default,{dataSource:n,columns:E})))}}]),e}(v.PureComponent))||f);e.default=k}}]);