import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import jsonData from './feiyan.json'   // 导入肺炎数据
//import echarts from 'echarts';
import './searchCom';
import './index.css';
import SearchCom from './searchCom';        // 搜索组件

class ChinaMap extends Component{       // 地图组件
    constructor(props){
        super(props);
        this.state = {
            provinceList:null,
        }
    }
    render(){
        return(
            <div>
                <h1>肺炎地理分布情况</h1>
                <div id = 'map'></div>
                <SearchCom data = {this.state.provinceList}></SearchCom>
                <FeiYanForm data = {this.state.provinceList}></FeiYanForm>
            </div>
        )
    }
    componentWillMount(){       // 将要挂载时获取肺炎数据
        this.setState({
            provinceList:this.getData()
        })
    }
    componentDidMount(){        // 页面挂载完毕后，渲染地图
        let dataList = []
        for(let temp of this.state.provinceList){
            dataList.push({
                name:temp.province,
                value:temp.confirm
            })
        }
        var myChart = window.echarts.init(document.getElementById('map'));
        let option = {
            tooltip: {
                    formatter:function(params,ticket, callback){
                        return params.seriesName+'<br />'+params.name+'：'+params.value
                    }//数据格式化
                },
            visualMap: {
                min: 0,
                max: 1500,
                left: 'left',
                top: 'bottom',
                text: ['高','低'],//取值范围的文字
                inRange: {
                    color: ['#FFFFF0', '#CD0000']//取值范围的颜色
                },
                show:true//图注
            },
            geo: {
                map: 'china',
                roam: false,//不开启缩放和平移
                zoom:1.23,//视角缩放比例
                label: {
                    normal: {
                        show: true,
                        fontSize:'10',
                        color: 'rgba(0,0,0,0.7)'
                    }
                },
                itemStyle: {
                    normal:{
                        borderColor: 'rgba(0, 0, 0, 0.2)'
                    },
                    emphasis:{
                        areaColor: '#F3B329',//鼠标选择区域颜色
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        shadowBlur: 20,
                        borderWidth: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            },
            series : [
                {
                    name: '确诊人数',
                    type: 'map',
                    geoIndex: 0,
                    data: dataList,
                }
            ]
        };
        myChart.setOption(option);
        // myChart.on('click', function (params) {
        //     alert(params.name);
        // });
    }
    getData = ()=>{
        let province ={}        // 初步用于保存数据的对象
        jsonData.data.list.forEach((item, index)=>{     // 提取各个省份的数据
            if(province[item.province] === undefined){   // 如果该省份数据未定义
                province[item.province] = {
                    province:item.province,
                    confirm:0,
                    suspect:0,
                    heal:0,
                    dead:0
                }
            }
            item.confirm = (item.confirm == null? 0 : item.confirm);    // 如果该数据为null，则置为0
            item.suspect = (item.suspect == null? 0 : item.suspect);
            item.heal = (item.heal == null? 0: item.heal);
            item.dead = (item.dead == null? 0 :item.dead);
            province[item.province] = {
                province:item.province,
                confirm:province[item.province].confirm + item.confirm,
                suspect:province[item.province].suspect + item.suspect,
                heal:province[item.province].heal + item.heal,
                dead:province[item.province].dead + item.dead
            }
        })
        let provinceList = [];      // 将省份对象数据转化为数组
        for(let key in province){
            provinceList.push(province[key]);
        }
        provinceList.sort((a,b)=>{      // 对省份数据进行排序
            if(a.confirm < b.confirm){
                return 1;
            }
            return -1;
        })
        return provinceList;
    }
}

class FeiYanForm extends Component{     // 表格组件
    constructor(props){
        super(props);
        this.state = {
            showForm:'unvisible',
            showMoreText:'点击查看全部省份数据'
        }
    }
    render(){
        let showArr = this.props.data.map((item, index)=>{       // 列表渲染常规操作
            return(
                    <tr key = {index}>
                        <td>{item.province}</td>
                        <td>{item.confirm}</td>
                        <td>{item.suspect}</td>
                        <td>{item.heal}</td>
                        <td>{item.dead}</td>
                    </tr>
            )
        })
        //console.log(showArr)
        return(
            <div>
                <button className = 'button2' onClick = {this.showMore}>{this.state.showMoreText}</button>
                <div className = {this.state.showForm}>
                <h3>各省市肺炎分布数据</h3>
                <table className = 'table11_7' width = '600' align = 'center'>
                    <tbody>
                        <tr>
                            <th>省份</th>
                            <th>确诊人数</th>
                            <th>疑症人数</th>
                            <th>康复人数</th>
                            <th>死亡人数</th>
                        </tr>
                        {showArr}
                    </tbody>
                </table>
                </div>
            </div>
        )
    }
    showMore = ()=>{
        if(this.state.showForm === 'unvisible'){
            this.setState({
                showForm:'visible',
                showMoreText:'点击收起表格'
            })
        }
        else{
            this.setState({
                showForm:'unvisible',
                showMoreText:'点击查看全部省份数据'
            })
        }
    }
}

ReactDOM.render(<ChinaMap></ChinaMap>, document.getElementById('root'));