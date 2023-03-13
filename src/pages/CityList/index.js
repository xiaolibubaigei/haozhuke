import React from "react";
//第一步把组件导入进来
import {NavBar, Toast} from 'antd-mobile';
//导入自己的css
import './index.scss'
//导入axios组件
import axios from "axios";
//导入定位城市
import '../../utils/index'
//react-virtualized组件
import {List, AutoSizer} from 'react-virtualized';
//获取当前定位方法
import {getCurrenCity} from "../../utils";
import NaveHeader from "../../components/NaveHeader";

//定义有房源的城市信息
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']
//处理数据
const formatCityData = (list) => {
    //集合
    const cityList = {}
    //数组

    //1.遍历拿到的城市数据
    list.forEach(item => {
        //2.获取每个城市的首字母,截取第一个字母
        const first = item.short.substr(0, 1)
        // 3.判断cityList当中有没有这个分类
        if (cityList[first]) {
            //  4.如果有的话直接往该分类中添加数据
            cityList[first].push(item)
        } else {
            // 5.如果没有，就先创建一个素组然后把城市的信息添加进去
            cityList[first] = [item]
        }

    })
    //获取索引数据,给其进行排序
    const cityIndex = Object.keys(cityList).sort()

    //返回结果
    return {
        cityList, cityIndex
    }
}

//数据源
// const list = Array(200).fill('hello')

//封装处理字母索引
const formatCityIndex = letter => {
    //使用switch流程控制语句
    switch (letter) {
        case '#':
            return '当前定位'
        case 'hot':
            return '热门城市'
        default:
            //把所有字母转换成大写  toUpperCase转换大写
            return letter.toUpperCase()
    }
}

//设置索引的高度
const TITLE_HEIGHT = 36
//每个城市的高度
const NAME_HEIGHT = 50
//暴露出去
export default class CityList extends React.Component {
    constructor(props) {
        super(props);
        //1.将获取到的cityList，cityIndex添加到start里面去
        this.state = {
            cityList: {},
            cityIndex: [],
            // 指定右侧字母索引列表高亮
            activeIndex: 0
        }
        this.cityListComponent = React.createRef()
    }


    //获取数据方法
    async componentDidMount() {
        //城市列表
        await this.getCityList()
        this.cityListComponent.current.measureAllRows()
    }

    //获取城市列表数据
    async getCityList() {
        const res = await axios.get("http://localhost:8080/area/city?level=1")
        //处理数据方法
        const {cityList, cityIndex} = formatCityData(res.data.body)

        /*
        * 获取热门城市数据
        * 把数据添加到cityList中
        * 将索引添加到cityIndex中
        * */
        const hotRes = await axios.get("http://localhost:8080/area/hot")
        // console.log('热门城市数据：', hotRes)
        //把热门城市添加到cityList中去
        cityList['hot'] = hotRes.data.body
        //讲hot添加索引里面去
        cityIndex.unshift('hot')
        //获取当前定位城市
        const curCity = await getCurrenCity()
        // 将当前定位城市数据添加到citylist中
        cityList['#'] = [curCity]
        //将他的索引添加到cityindex
        cityIndex.unshift('#')
        //2.把数据添加到state里面
        this.setState({
            cityList,
            cityIndex
        })
        console.log(cityList, cityIndex, curCity)
    }

    // 切换城市
    changeCity({label, value}) {
        // console.log(curCity)
        //判断我们当前点击城市是否有房源信息，没有给出提示
        if (HOUSE_CITY.indexOf(label) > -1) {
        //大于-1就说明该城市有房源
        //把当前点击城市信息保存到缓存中
            localStorage.setItem('hzk_city',JSON.stringify({label,value}))
            this.props.history.go(-1)
        }else{
            Toast.info('该城市没有房源信息',1,null)
        }
        //否则则给出提示没有
    }

    //数据处理
    rowRenderer = ({
                       key, // 唯一值
                       index, // 索引号
                       isScrolling, //当前时候在滚动
                       isVisible, // 当前list是否可见
                       style, // 重点属性：指定在那一行
                   }) => {
        //获取城市数据索引
        const {cityIndex, cityList} = this.state
        //传递到索引号里面
        const letter = cityIndex[index]
        // console.log('索引号', letter)

        return (
            <div key={key} style={style} className="city">
                {/*定位索引号*/}
                <div className="title">{formatCityIndex(letter)}</div>
                {
                    //遍历索引获取城市信息数据
                    cityList[letter].map(item =>
                        <div className="name"
                             key={item.value}
                             onClick={() => this.changeCity(item)}>{item.label}</div>)
                }
            </div>
        );
    }

    //获取list组件渲染的信息
    onRowRendered = ({startIndex}) => {
        // console.log('123',startIndex)
        if (this.state.activeIndex !== startIndex) {
            this.setState({
                activeIndex: startIndex
            })
        }
    }

    //1.创建一个方法，用来渲染右边索引
    //获取右侧索引方法

    renderCityIndex() {
        //1.给索引绑定一个点击事件
        //2.调用List组件里面的Scrmlltorow让List组件滚动指定那那一行
        const {activeIndex} = this.state
        //2.获取到索引，并遍历
        return this.state.cityIndex.map((item, index) => (
            <li className="city-index-item" key={item} onClick={() => {
                // console.log(index)
                //把当前点击的索引值传递到scrollToRow方法里面
                this.cityListComponent.current.scrollToRow(index)
            }}>
                <span
                    className={activeIndex === index ? 'index-active' : ''}>{item === 'hot' ? '热' : item.toUpperCase()}</span>
            </li>
        ))
    }

    //动态计算它每一行高度
    getRowHeight = ({index}) => {
        //索引标题高度+城市数量*城市的高度，就可以算出每个字母索引下的城市有多少个以及高度
        //    获取城市和索引
        const {cityList, cityIndex} = this.state
        //根据每个索引下有多少个城市去获取他的一个高度是多少
        return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
    }

    render() {
        return (<div className="cityList">
            {/*<NavBar*/}
            {/*    className="navbar"*/}
            {/*    // 模式*/}
            {/*    mode="light"*/}
            {/*    // 图标*/}
            {/*    icon={<i className="iconfont icon-back"></i>}*/}
            {/*    // 点击事件,返回上一层*/}
            {/*    onLeftClick={() => this.props.history.go(-1)}*/}
            {/*>城市列表</NavBar>*/}
            <NaveHeader>城市列表</NaveHeader>
            {/*数据渲染*/}
            {/*<List*/}
            {/*    width={300}*/}
            {/*    height={300}*/}
            {/*    rowCount={list.length}*/}
            {/*    rowHeight={20}*/}
            {/*    rowRenderer={rowRenderer}*/}
            {/*/>,*/}
            {/*通过AutoSizer高阶组件控制显示范围大小*/}
            <AutoSizer>
                {({height, width}) => (
                    <List
                        ref={this.cityListComponent}
                        height={height}
                        // 数据长度
                        rowCount={this.state.cityIndex.length}
                        // 每个索引和他对应下面的城市数量去决定他的高度
                        rowHeight={this.getRowHeight}
                        rowRenderer={this.rowRenderer}
                        onRowsRendered={this.onRowRendered}
                        //获取当前选中列
                        scrollToAlignment="start"
                        width={width}

                    />
                )}
            </AutoSizer>,
            {/*右侧索引*/}
            <ul className="city-index">
                {this.renderCityIndex()}
            </ul>
        </div>)
    }
}