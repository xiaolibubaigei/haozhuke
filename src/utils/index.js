import axios from "axios";

//导入定位城市的函数
export const getCurrenCity = () => {
    //获取城市数据
    const LocalCity = JSON.parse(localStorage.getItem('hzk_city'))
    //判断lacaCityList中否有我们当前定位城市
    if (!LocalCity) {
        //  如果没有就是用首页当中获取的定位城市代码来获取
        return new Promise((resolve, reject) => {
            //获取定位城市
            const curCity = new window.BMapGL.LocalCity
            //获取后台接口
            curCity.get(async res => {
                //try{}catch()用来捕获异常
                try {
                    //获取当前城市名
                        const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)

                    //    存储到本地存储中
                    localStorage.setItem('hzk_city', JSON.stringify(result.data.body))
                    //    返回该城市数据
                    resolve(result.data.body)
                } catch (e) {
                    //获取定位失败打印错误信息
                    reject(e)

                }
            })

        })

    }

    //如果有直接返回本地数据到存储中
    return Promise.resolve(LocalCity)
}

export {API} from './api'
export {BASE_URL} from './url'
export  * from  './auth'
export  * from  './city'