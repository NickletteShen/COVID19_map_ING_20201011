import React,{Component} from 'react';
class SearchCom extends Component{      // 搜索组件
    constructor(props){
        super(props);
        this.state = {
            value:'',
            searchResult:null
        }
    }
    render(){
        return (
            <div>
                <h1>search something</h1>
                <input placeholder = '请输入你想查询的省份' id = 'inputBox' onKeyDown = {this.keyDown} value = {this.state.value} onChange = {this.change}></input>
                <button id = 'searchButton' onClick = {this.keyDown} className = 'button1'>搜索</button>
                {this.state.searchResult}
            </div>
        )
    }
    keyDown = (e)=>{
        if(e.keyCode === 13 || e.target.id === 'searchButton'){     // 当按下回车键或点击搜索按钮时进行搜索查询
            let showArr = []
            for(let item of this.props.data){
                //console.log(item)
                if(item.province.includes(this.state.value) && this.state.value.length > 0){        // 判断字串，如果满足则添加到数组
                    showArr.push(<tr key = {item.province}>
                                    <td>{item.province}</td>
                                    <td>{item.confirm}</td>
                                    <td>{item.suspect}</td>
                                    <td>{item.heal}</td>
                                    <td>{item.dead}</td>
                                </tr>)
                }
            }
            if(showArr.length > 0){     // 数组非空时进行列表渲染
                this.setState({
                    searchResult:(
                        <div className = 'marginTop'>
                            <table  className = 'table11_7' width = '600' align = 'center'>
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
                    )
                })
            }
            else{
                this.setState({
                    searchResult:null
                })
            }
        }
    }
    change = (e)=>{
        this.setState({
            value:e.target.value
        })
        
    }
}

export default SearchCom