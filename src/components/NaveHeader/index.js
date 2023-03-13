//引入react
import React from "react";
//引入antd-mobile组件
import {NavBar} from "antd-mobile";
//引入css
import './index.scss'
//导入withRouter路由组件
import {withRouter} from "react-router-dom";

function NaveHeader({children, history, onLeftClick}) {
    //默认点击行为回到上一级页面内
    const defaylt = () => history.go(-1)
    return (
        <NavBar
            className="navbar"
            // 模式
            mode="light"
            // 图标
            icon={<i className="iconfont icon-back"></i>}
            // 点击事件,返回上一层,一种默认跳转上一级页面，第二章让他跳转到指定页面
            onLeftClick={onLeftClick || defaylt}
        >{children}</NavBar>
    )
}

//暴露出组件
export default withRouter(NaveHeader)