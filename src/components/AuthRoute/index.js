// 1.在 components 目录中创建 AuthRoute/index,js 文件。
import React from "react";
import {Route, Redirect} from "react-router-dom";
import {isAuth} from "../../utils";


// 2.创建组件 AuthRoute 并导出。
const AuthRoute = ({component: Component, ...rest}) => {
    return (
        <Route
            {...rest}
            render={props => {
                const isLogin = isAuth()
                //判断用户是否登录
                if (isLogin) {
                    //    已登录，将props值传递给组件，获取路由的相关信息
                    return <Component {...props} />
                } else {
                    // 没有登录，没有登录跳转到登录页面
                    return (
                        <Redirect to={{
                            //指定跳转页面
                            pathname: '/login',
                            state: {
                                from: props.location
                            }
                        }}
                        />
                    )

                }
            }}
        />
    )
}

// 导出组件
export default AuthRoute
// 3.在AuthRoute 组件中返回 Route 组件(在 Route 基础上做了一层包装，用于实现自定义功能)
// 4.给 Route 组件，添加render 方法，指定该组件要染的内容(类似于 component 属性)。
// 5.在render 方法中，调用isAuth0 判断是否登录。
// 6.如果登录了，就染当前组件(通过参数 component 获取到要染的组件，需要重命名)。
// 7.如果没有登录，就重定向到登录页面，并且指定登录成功后要跳转到的页面路径
// 8.将AuthRoute 组件接收到的 props 原样传递给 Route 组件(保证与 Route 组件使用方式相同)。
// 9使用AuthRoute 组件配置路由规则，验证能否实现页面的登录访问控制。
