import ReactDOM from 'react-dom';


//导入组件库样式
import 'antd-mobile/dist/antd-mobile.css'
//导入字体图标库
import './assets/fonts/iconfont.css'
//引入css
import './pages/Home/index.css'
//导入react-virtualized样式
import 'react-virtualized/styles.css'
import './utils/url'

//注意为了防止被自带样式覆盖，把App写到最后面，让他最后去执行加载
import App from './App';

ReactDOM.render(<App/>, document.getElementById('root'))

