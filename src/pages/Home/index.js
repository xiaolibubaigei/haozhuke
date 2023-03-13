import React from "react";
//TabBar组件
import {TabBar} from 'antd-mobile';
import {Route} from "react-router-dom";
//引入外部路由
import News from '../News'
import Index from '../index'
import HomeList from '../HouseList'
import Profile from '../Profile'
//暴露出去


//建立数组
const batItem = [
    {
        title:'首页',
        icon:'icon-ind',
        path:'/home'
    },
    {
        title:'找房',
        icon:'icon-findHouse',
        path:'/home/list'
    },
    {
        title:'资讯',
        icon:'icon-infom',
        path:'/home/News'
    },
    {
        title:'我的',
        icon:'icon-my',
        path:'/home/Profile'
    }
]
export default class Home extends React.Component {
    state = {
        selectedTab: this.props.location.pathname,
        //控制是否隐藏
        // hidden: false,
        //控制是否在底部
        fullScreen: true,
        // 组件接收到新的props（此处，实际上是路由信息）就会触发该钩子函数
        componentDidUpdate(prevProps) {
            // prevProps 上一次的props，此处也就是上一次的路由信息
            // this.props 当前最新的props，此处也就是最新的路由信息
            // 注意：在该钩子函数中更新状态时，一定要在 条件判断 中进行，否则会造成递归更新的问题
            if (prevProps.location.pathname !== this.props.location.pathname) {
                // 此时，就说明路由发生切换了
                this.setState({
                    selectedTab: this.props.location.pathname
                })
            }
        }
    };
    // 渲染导航
    renderTabBarItem() {
        //使用循环数组
        return batItem.map(item =>
            <TabBar.Item
                icon={
                    <i className={`iconfont ${item.icon}`}></i>
                }
                selectedIcon={
                    <i className={`iconfont ${item.icon}`}></i>
                }
                title={item.title}
                key={item.title}
                selected={this.state.selectedTab === item.path}
                onPress={() => {
                    this.setState({
                        selectedTab: item.path,
                    });
                    // 路由跳转
                    this.props.history.push(item.path)
                }}
            >
            </TabBar.Item>
        )
    }
    render() {
        //查看默认在哪个页面
        return (
            <div>
                {/*渲染子路由*/}
                <Route path="/home/news" component={News}/>
                <Route exact path="/home" component={Index}/>
                <Route path="/home/list" component={HomeList}/>
                <Route path="/home/profile" component={Profile}/>
                {/*TabBar*/}

                    <TabBar
                        unselectedTintColor="#949494"
                        // 选中的颜色
                        tintColor="#21b97a"
                        barTintColor="white"
                        noRenderContent={true}
                    >
                        {/*把路由方法渲染*/}
                        {this.renderTabBarItem()}
                    </TabBar>
                </div>

        )
    }
}