import React from "react";
import './index.scss'
import {Flex} from "antd-mobile";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";

function SearcHeader({history,cityName,className}) {
    return (
        // 搜索框
        <Flex className={['search-box',className || ''].join(' ')}>
            <Flex className="search">
                <div className="location" onClick={() => history.push('/cityList')}>
                    <span className="name">{cityName}</span>
                    <i className="iconfont icon-arrow"></i>
                </div>
                <div className="from" onClick={() => history.push('/search')}>
                    <i className="iconfont icon-seach">
                        <span className="text">请输入小区或地址</span>
                    </i>
                </div>
            </Flex>
            <i className="iconfont icon-map" onClick={() => history.push('/map')}></i>
        </Flex>
    )
}

//校验属性
SearcHeader.prototype = {
    cityName:PropTypes.string.isRequired,
}
//导出获取路由信息
export default withRouter(SearcHeader)