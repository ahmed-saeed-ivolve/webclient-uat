(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[35],{Or3j:function(e,t,a){"use strict";var l=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("14J3");var r=l(a("BMrR"));a("jCWc");var u=l(a("kPKH"));a("IzEo");var s=l(a("bx4M"));a("J+/v");var n=l(a("MoRW"));a("+L6B");var o=l(a("2/Rp"));a("/zsF");var d=l(a("PArb"));a("tU7J");var i=l(a("wFql"));a("Pwec");var c=l(a("CtXQ")),f=l(a("2Taf")),p=l(a("vZ4D")),m=l(a("l4Ni")),h=l(a("ujKo")),y=l(a("MhPg"));a("y8nQ");var b=l(a("Vl3Y"));a("5NDa");var g=l(a("5rEg"));a("Znn+");var E,v,x,w=l(a("ZTPi")),q=l(a("q1tI")),F=l(a("rDYY")),P=a("MuoO"),M=w.default.TabPane,k=g.default.TextArea,C=b.default.Item,A=(E=b.default.create(),E((x=function(e){function t(){var e;return(0,f.default)(this,t),e=(0,m.default)(this,(0,h.default)(t).call(this)),e.handleSubmit=function(t){t.preventDefault(),e.props.form.validateFields(function(t,a){t||e.props.dispatch({type:"support/sendMail",payload:a})}),e.props.form.resetFields()},e.state={email:"",query:"",subject:"",showForm:!0},e}return(0,y.default)(t,e),(0,p.default)(t,[{key:"sendAgain",value:function(){this.setState({showForm:!this.state.showForm})}},{key:"render",value:function(){var e=this.state,t=e.query,a=e.showForm,l=this.props.form.getFieldDecorator;return q.default.createElement("div",{style:{backgroundColor:"white",padding:"65px"}},q.default.createElement(r.default,null,q.default.createElement(u.default,null,q.default.createElement(s.default,{className:F.default["support"]},q.default.createElement(w.default,{type:"card"},q.default.createElement(M,{tab:q.default.createElement("span",{style:{fontSize:"20px"}},q.default.createElement(c.default,{type:"phone"}),"Contact Us")},q.default.createElement(i.default,{className:F.default["contact-text"]},"Detecon Al Saudia Co.Ltd. P.O.Box 22135, Riyadh 11495, Kingdom of Saudi Arabia"),q.default.createElement(i.default,{className:F.default["contact-text"]},"For sales related queries , please email at info@detasad.com.sa ",q.default.createElement("br",null)),q.default.createElement(i.default,{className:F.default["contact-text"]},"Phone +922 13713 1564",q.default.createElement("br",null),"Fax +966 11 249 78 87"),q.default.createElement(d.default,null),q.default.createElement(i.default,{className:F.default["contact-text"]},"For further queries you may connect with us"),a?q.default.createElement(b.default,{id:"create-course-form",layout:"horizontal",loading:this.props.sendingMail,onSubmit:this.handleSubmit.bind(this),className:"login-form",style:{width:"550px"}},q.default.createElement("br",null),q.default.createElement(C,null,l("email",{rules:[{type:"email",required:!0,message:"Please enter a valid email !",pattern:/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/}]})(q.default.createElement(g.default,{prefix:q.default.createElement(c.default,{type:"user"}),style:{height:"40px"},placeholder:"Email"}))),q.default.createElement(C,null,l("subject",{rules:[{required:!0,message:"Enter email subject"}]})(q.default.createElement(g.default,{style:{height:"40px"},placeholder:"Subject"}))),q.default.createElement(C,null,l("query",{rules:[{required:!0,message:"Please input your query!"}]})(q.default.createElement(k,{value:t,rows:6,placeholder:"Place your query here"}))),q.default.createElement(o.default,{type:"primary",loading:this.props.sendingMail,htmlType:"submit",className:"login-form-button btn",style:{width:"inherit",height:"40px",backgroundColor:"#0c3446"}},"Send")):q.default.createElement(n.default,{status:"success",subTitle:"Your query has been successfully submitted ,our team will get back to you soon!",extra:[q.default.createElement(o.default,{key:"buy",onClick:this.sendAgain.bind(this)},"Request another")]})))))))}}]),t}(q.default.Component),v=x))||v),N=(0,P.connect)(function(e){var t=e.loading,a=e.support;return{sendingMail:t.effects["support/sendMail"],statusCode:a.statusCode}})(b.default.create()(A));t.default=N},rDYY:function(e,t,a){e.exports={footer:"antd-pro-pages-support-support-footer",support:"antd-pro-pages-support-support-support","contact-text":"antd-pro-pages-support-support-contact-text","support-logo":"antd-pro-pages-support-support-support-logo"}}}]);