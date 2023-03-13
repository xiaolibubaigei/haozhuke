import React from 'react'

// 导入样式
import './index.scss'
import styles from './index.module.css'
import NaveHeader from "../../components/NaveHeader";
import axios from "axios";
import {Link} from "react-router-dom";
import { Toast } from 'antd-mobile';
//
import {BASE_URL} from "../../utils/url";
//到处API配置
import {API} from "../../utils/api";

// 导入BASE_URL

const BMapGL = window.BMapGL
// 覆盖物样式
const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: 'rgb(238,11,11)',
    textAlign: 'center'
}
export default class Map extends React.Component {

    state = {
        // 小区下的房源列表
        housesList: [],
        // 表示是否展示房源列表
        isShowList: false
    }

    componentDidMount() {

        this.initMap()
    }

    //初始化地图
    initMap() {
        //获取到城市定位
        const {label, value} = JSON.parse(localStorage.getItem('hzk_city'))
        // console.log(label, value)
        //创建地址解析器实例
        var myGeo = new BMapGL.Geocoder();
        var scaleCtrl = new BMapGL.ScaleControl();  // 添加比例尺控件
        var zoomCtrl = new BMapGL.ZoomControl();  // 添加缩放控件
        const map = new window.BMapGL.Map("container");
        //让其他方法也能this获取到map
        this.map = map
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(
            label,
            async point => {
                if (point) {
                    //初始化地图
                    map.centerAndZoom(point, 10);
                    map.addControl(scaleCtrl); // 添加比例尺控件
                    map.addControl(new BMapGL.ScaleControl())
                    map.addControl(zoomCtrl);// 添加缩放控件
                    this.renderOverlays(value)
                    //   //获取城市房源信息接口
                    //   const res = await axios.get(`http://localhost:8080/area/map?id=${value}`)
                    //   // console.log("房源信息：",res)
                    //   // 遍历res获取城市房源信息
                    //   res.data.body.forEach(item => {
                    //       //通过经纬度获取当前区域位置，为没一条覆盖物添加数据
                    //       const {coord: {longitude, latitude}, label: areaName, count, value} = item
                    //       //获取房源经纬度
                    //       const areaPoint = new BMapGL.Point(longitude, latitude)
                    //       //创建覆盖物
                    //       const label = new BMapGL.Label('', {
                    //           position: areaPoint,
                    //           offset: new BMapGL.Size(-35, -35) // 设置文本偏移量
                    //       })
                    //       label.id = value
                    //
                    //       label.setContent(`
                    //   <div class="${styles.bubble}">
                    //     <p class="${styles.name}">${areaName}</p>
                    //     <p>${count}</p>
                    //   </div>
                    // `)
                    //       // 设置样式
                    //       label.setStyle(labelStyle)
                    //       // 添加单击事件
                    //       label.addEventListener('click', () => {
                    //           console.log('房源覆盖物被点击了', label.id)
                    //           //点击事件触发后，缩放地图
                    //           map.centerAndZoom(areaPoint, 13);
                    //           //清除地图覆盖物
                    //           map.clearOverlays()
                    //       })
                    //       //    添加覆盖物
                    //       map.addOverlay(label)
                    //   })
                } else {
                    alert('您选择的地址没有解析到结果！');
                }
            }, label)
        // 初始化地图实例
        // 注意：在 react 脚手架中全局对象需要使用 window 来访问，否则，会造成 ESLint 校验错误
    }

    //渲染覆盖物，获取到房源类型通过接受id参数
    async renderOverlays(id) {
        //等待提示功能
        Toast.loading('数据加载中',0,null,false)
        //获取城市房源信息接口
        const res = await API.get(`/area/map?id=${id}`)
        //关闭提示
        Toast.hide()
        // console.log("房源信息：",res)
        // 遍历res获取城市房源信息
        const data = res.data.body
        const {nextZoom, type} = this.getTypeAndZoom()
        //循环data房源数据，
        data.forEach(item => {
            //创建覆盖物
            this.cerateOverlays(item, nextZoom, type)
        })
    }

    //创建覆盖物
    cerateOverlays(data, zoom, type) {
        const {
            coord: {longitude, latitude},
            label: areaName, count, value
        } = data
        // 创建坐标对象
        const areaPoint = new BMapGL.Point(longitude, latitude)
        if (type === 'circle') {
            // 区和镇
            this.createCircle(areaPoint, areaName, count, value, zoom)
        } else {
            // 小区
            this.createRect(areaPoint, areaName, count, value)
        }
    }

    //创建区和镇的方法
    createCircle(point, name, count, id, zoom) {
        const label = new BMapGL.Label('', {
            position: point,
            offset: new BMapGL.Size(-35, -35) // 设置文本偏移量
        })
        // 给labely一个唯一标识
        label.id = id
        //设置房源覆盖物
        label.setContent(`
          <div class="${styles.bubble}">
            <p class="${styles.name}">${name}</p>
            <p>${count}</p>
          </div>
        `)
        //   设置样式
        // label.setStyle(labelStyle)
        // 添加单击事件
        label.addEventListener('click', () => {
            console.log('房源覆盖物被点击了', label.id)
            //获取该区房源数据
            this.renderOverlays(id)
            //点击事件触发后，缩放地图
            this.map.centerAndZoom(point, zoom);
            //清除地图覆盖物
            this.map.clearOverlays()
        })
        //    添加覆盖物
        this.map.addOverlay(label)
    }

    //创建小区方法
    createRect(point, name, count, id) {
        //创建覆盖物
        const label = new BMapGL.Label('', {
            position: point,
            offset: new BMapGL.Size(-35, -35) // 设置文本偏移量
        })
        // 给labely一个唯一标识
        label.id = id
        //设置房源覆盖内容
        label.setContent(`
          <div class="${styles.rect}">
            <span class="${styles.housename}">${name}</span>
            <span class="${styles.housenum}">${count}套</span>
             <i class="${styles.arrow}"></i>
          </div>
        `)
        //   设置样式
        label.setStyle(labelStyle)

        label.addEventListener('click', () => {
            console.log('小区信息被点击了')
            this.getHousesList(id)
        })
        // 添加覆盖物到地图中
        this.map.addOverlay(label)

    }

    //计算地图的缩放级别
    //区  11
    //镇  13
    //小区  15
    getTypeAndZoom() {
        const zoom = this.map.getZoom()
        // console.log('当前地图缩放级别为：',zoom)
        let nextZoom, type
        if (zoom >= 10 && zoom < 12) {
            //显示当前区下的信息
            nextZoom = 13
            //circle表示绘制覆盖物
            type = 'circle'
        } else if (zoom >= 12 && zoom < 14) {
            //代表镇的一个缩放级别
            //显示当前区下的信息
            nextZoom = 15
            //circle表示绘制覆盖物
            type = 'circle'
        } else if (zoom >= 14 && zoom < 16) {
            // 小区缩放级别
            type = 'rect'
        }
        //返回数据
        return {
            nextZoom, type
        }
    }

    //获取小区房源信息方法
    async getHousesList(id) {
        Toast.loading('数据加载中',0,null,false)
        const res = await API.get(`/houses?cityId=${id}`)
        Toast.hide()
        // console.log(res)
        this.setState({
            //把房源信息存储到state
            housesList: res.data.body.list,
            //   展示房源列表
            isShowList: true
        })
    }


    render() {
        return (
            <div className={styles.map}>
                {/*头部导航*/}
                <NaveHeader>地图找房</NaveHeader>
                {/* 地图容器元素 */}
                <div id="container" className={styles.container}/>
                {/* 房源列表 */}
                {/* 添加 styles.show 展示房屋列表 */}

                <div
                    className={[
                        styles.houseList,
                        this.state.isShowList ? styles.show : ''
                    ].join(' ')}
                >
                    <div className={styles.titleWrap}>
                        <h1 className={styles.listTitle}>房屋列表</h1>
                        <Link className={styles.titleMore} to="/home/list">
                            更多房源
                        </Link>
                    </div>

                    <div className={styles.houseItems}>
                        {/* 房屋结构 */}
                        {this.state.housesList.map(item => (
                            <div className={styles.house} key={item.houseCode}>
                                <div className={styles.imgWrap}>
                                    <img
                                        className={styles.img}
                                        src={BASE_URL + item.houseImg}
                                        alt=""
                                    />
                                </div>
                                <div className={styles.content}>
                                    <h3 className={styles.title}>{item.title}</h3>
                                    <div className={styles.desc}>{item.desc}</div>
                                    <div>
                                        {item.tags.map(tag => (
                                            <span
                                                className={[styles.tag, styles.tag1].join(' ')}
                                                key={tag}
                                            >
                                        {tag}
                                      </span>
                                        ))}
                                    </div>
                                    <div className={styles.price}>
                                        <span className={styles.priceNum}>{item.price}</span> 元/月
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        )
    }
}