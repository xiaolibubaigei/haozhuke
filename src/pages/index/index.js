import React from "react";
//暴露出去

/*
* 1.安装axios 组件， "axios": "^0.19.0",
* 2.在首页index导入axios组件
* 3.在state中添加轮播图
* 4.新建一个getSwipers,更新swipers方法
* 5.在函数中调用getSwipers方法
* 6.使用获取到的数据渲染轮播图
*
* */


//引入图片
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

//导入flex布局
import {Flex, Grid, WingBlank} from 'antd-mobile';

//轮播图组件
import {Carousel} from 'antd-mobile';
// 1.导入axios 组件,
import axios from 'axios'
//引入css
import './index.scss'
import {getCurrenCity} from "../../utils";

//重构导航组件
const navs = [
    {
        id: 1,
        img: Nav1,
        title: '整租',
        path: '/home/list'
    },
    {
        id: 2,
        img: Nav2,
        title: '合租',
        path: '/home/list'
    },
    {
        id: 3,
        img: Nav3,
        title: '地图找房',
        path: '/map'
    },
    {
        id: 4,
        img: Nav4,
        title: '出租',
        path: '/rent'
    },
]

/*
* 1.在Start中添加租房小组的数据：Groups
* 2.新建一个getGroups方法并更新状态
* 3.在componentDidMount调用方法或取数据
* 4.渲染到页面上
* */

const data = Array.from(new Array(4)).map((_val, i) => ({
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
    text: `name${i}`,
}));


export default class index extends React.Component {
    state = {
        //轮播图状态数据
        swipers: [1, 2, 3],
        // 图片高度
        imgHeight: 176,
        groups: [],
        // 最新资讯
        news: [],
        curCityName: []
    }

    //获取轮播图数据方法
    async getSwipers() {
        //从后台数据库获取数据
        const res = await axios.get("http://localhost:8080/home/swiper")
        // console.log("轮播图数据为", res)
        // 修改start状态
        this.setState({
            swipers: res.data.body
        })
    }


    //渲染图片轮播图结构
    rederSwipers() {
        return this.state.swipers.map(item => (
            <a
                key={item.id}
                href="#"
                style={{display: 'inline-block', width: '100%', height: this.state.imgHeight}}
            >
                <img
                    src={`http://localhost:8080${item.imgSrc}`}
                    alt=""
                    style={{width: '100%', verticalAlign: 'top'}}
                />
            </a>
        ))
    }

    //获取租房小组数据
    async getGroups() {
        //从后台获取数据
        const res = await axios.get("http://localhost:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0")
        //修改start里面的数据
        this.setState({
            groups: res.data.body
        })
    }

    //图标导航
    renderNavs() {
        return navs.map(item => (
            <Flex.Item key={item.id} onClick={() => this.props.history.push(item.path)}>
                <img src={item.img} alt=""/>
                <h2>{item.title}</h2>
            </Flex.Item>
        ))
    }

    //获取最新资讯数据
    async getNews() {
        const res = await axios.get("http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0")
        // console.log(res)
        //   修改start里面数据
        this.setState({
            news: res.data.body
        })
    }

    //获取最资讯方法
    renderNews() {
        return this.state.news.map(item => (
            <div className="news-item" key={item.id}>
                <div className="imgwrap">
                    <img className="img" src={`http://localhost:8080${item.imgSrc}`} alt=""/>
                </div>
                <Flex className="content" direction="column" justify="between">
                    <h3 className="title">{item.title}</h3>
                    <Flex className="info" justify="between">
                        <span>{item.from}</span>
                        <span>{item.date}</span>
                    </Flex>
                </Flex>
            </div>
        ))
    }

    componentDidMount() {
        // 调用轮播图数据
        this.getSwipers()
        //调用租房小组数据
        this.getGroups()
        //调用最新资讯接口
        this.getNews()

        //通过ip定位获取当前城市位置
        const curCity = new window.BMapGL.LocalCity

        curCity.get(async res => {
            // console.log('当前城市位置', res, curCity)
            const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`

            )
            //把数据修改到start里面去
            const  curCity =await  getCurrenCity()
            this.setState({
                curCityName:curCity.label
            })
        })
    }

    render() {
        return (
            <div>
                <div className="swiper">
                    <Carousel autoplay={true} infinite>
                        {/*渲染轮播图*/}
                        {this.rederSwipers()}
                    </Carousel>

                    {/*搜索框*/}
                    <Flex className="search-box">
                        <Flex className="search">
                            <div className="location" onClick={() => this.props.history.push('/cityList')}>
                                <span className="name">{this.state.curCityName}</span>
                                <i className="iconfont icon-arrow"></i>
                            </div>
                            <div className="from" onClick={() => this.props.history.push('/search')}>
                                <i className="iconfont icon-seach">
                                    <span className="text">请输入小区或地址</span>
                                </i>
                            </div>
                        </Flex>
                        <i className="iconfont icon-map" onClick={() => this.props.history.push('/map')}></i>
                    </Flex>
                </div>
                {/* 图标导航*/}
                <Flex className="nav">
                    {/*渲染*/}
                    {this.renderNavs()}
                </Flex>
                {/* 租房小组*/}
                <div className="group">
                    <h3 className="group-title">租房小组 <span className="more">更多</span></h3>
                    <Grid
                        data={this.state.groups} activeStyle={false}
                        columnNum={2}
                        square={false}
                        hasLine={false}
                        renderItem={item => (
                            <Flex className="group-item" justify="around" key={item.id}>
                                <div className="desc">
                                    <p className="title">{item.title}</p>
                                    <span className="info">{item.desc}</span>
                                </div>
                                <img src={`http://localhost:8080${item.imgSrc}`} alt=""/>
                            </Flex>
                        )}
                    />
                </div>
                {/* 最新资讯*/}
                <div className="news">
                    <h3 className="group-title">最新资讯</h3>
                    <WingBlank size="md">{this.renderNews()}</WingBlank>
                </div>
            </div>
        );
    }
}