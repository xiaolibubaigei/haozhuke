import React from "react";
//导入组件库
// import {Button} from "antd-mobile";
//导入路由组件
import {BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';
//自己的路由组件
import Home from './pages/Home'
import CityList from "./pages/CityList";
import Map from "./pages/Map";

//修改默认路由规则为/home去掉
//把子路由后面的节点去掉，因为他有一个模糊匹配
import './index.css'
import HouseDetail from "./pages/HouseDetail";
import Login from "./pages/Login";
//获取鉴权路由
import AuthRoute from "./components/AuthRoute";

//登录组件


function App() {
    return (

        <Router>
            <div className="App">
                {/*配置路由出口*/}
                <Link to="/home"/>
                {/*默认路由匹配时，跳转到home,实现路由的重定向到首页*/}
                <Route path="/" exact render={() => <Redirect to={"/home"}/>}/>
                {/*配置路由入口*/}
                <Route path="/home" component={Home}/>
                {/*地图找房*/}
                <AuthRoute path="/map" component={Map}/>
                {/*城市列表*/}
                <Route path="/cityList" component={CityList}/>
                {/*房屋详情路由*/}
                <Route path="/detail/:id" component={HouseDetail}/>
                {/*登录路由*/}
                <Route path="/login" component={Login}/>

            </div>
        </Router>
    );
}



export default App;
