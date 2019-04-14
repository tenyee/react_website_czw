import React from 'react';
require('./mystyle.css')
import {
    Table, Input, Button, Icon, Form, Modal,Tooltip,Popover,
    Checkbox
} from 'antd';

var toUpperCase = function (str) {
    if (str && str.toUpperCase) {
        return str.toUpperCase();
    }
    return '';
};
var toLowerCase = function (str) {
    if (str && str.toLowerCase) {
        return str.toLowerCase();
    }
    return '';
};

//输入框
class NormalLoginForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                    {getFieldDecorator('sysname', {
                        rules: [{ required: true, message: 'sysname' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="sysname" />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('desc', {
                        rules: [{ required: false, message: 'description' }],
                    })(
                        <Input prefix={<Icon type="info" style={{ color: 'rgba(0,0,0,.25)' }} />} type="desc" placeholder="备注信息" />
                    )}
                </Form.Item>
            </Form>
        );
    }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);


//Modal弹窗
class ModalDemo extends React.Component {
    constructor(props) {
        super(props);
        this.record = props.record;
        this.name = props.name;
        this.url = props.url
    }

    state = { visible: false }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e, b, c) => {
        console.log(this.refs.button_test);
        console.log('e');
        console.log(e);
        this.setState({
            visible: false,
        });
        console.log(this.url)
        let btn = this.refs.button_test.buttonNode
        btn.disabled = true

        console.log('button:')
        console.log(btn)
        console.log(btn.disabled)
        debugger
        let demo = this.refs.getFormVlaue;//通过refs属性可以获得对话框内form对象
        demo.validateFields((err, values) => {
            if (!err) {
                console.log(values.sysname);//这里可以拿到表单中的数据
                console.log(this.record.name);//这里可以合到所在行的数据
                let postData = [];
                var sysname = {};
                var desc = {};
                var ip = {};

                sysname.sysname = values.sysname;
                desc.desc = values.desc;
                ip.dev_ip = this.record.dev_ip;
                postData.push(sysname);
                postData.push(desc);
                postData.push(ip);
                let a = JSON.stringify(postData);
               
                //请求后台
                fetch(this.url, {
                    method: 'POST',
                    mode: 'cors',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: JSON.stringify(postData)
                }).then((response) => {
                    return response.json();
                }).then((data) => {
                    console.log(data);
                })
            }
        });
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    render() {
        return (
            <div>
                <Button ref='button_test' type="primary" onClick={this.showModal} >
                    {this.props.name}
                </Button>
                <Modal
                    title="Basic Modal"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >

                    <WrappedNormalLoginForm ref='getFormVlaue' > </WrappedNormalLoginForm>

                </Modal>
            </div>
        );
    }
}
//table
class MyTable extends React.Component {
    constructor(props) {
        super(props);
        this.url = props.url;
        this.state = {}
    }

    componentDidMount() {
        var self = this;
        fetch(this.url, {
            method: 'GET'
        }).then((response) => {
            return response.json();
        }).then((data) => {
            self.setState({
                dataSource: data.dataSource,
                columns: data.columns
            });
            console.log(data);
        })
    }

    sorter(a, b) {
        var stringA = toUpperCase(a.name); // ignore upper and lowercase
        var stringB = toUpperCase(b.name); // ignore upper and lowercase
        if (stringA < stringB) {
            return -1;
        }
        if (stringA > stringB) {
            return 1;
        }
        // names must be equal
        return 0;
    }

    setSorter(columns) {
        var self = this;
        if (columns) {
            columns = columns.map(function (column) {
                column.sorter = self.sorter;
                return column;
            });
        }
    }

    state = {
        searchText: '',
    };

    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys, selectedKeys, confirm, clearFilters,
        }) => (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={node => { this.searchInput = node; }}
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm)}
                        icon="search"
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                    >
                        Search
                            </Button>
                    <Button
                        onClick={() => this.handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </div>
            ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => toLowerCase(record[dataIndex].toString()).includes(toLowerCase(value)),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        }
    })

    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    }

    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
    }

    setSearch(columns) {
        var self = this;

        if (columns) {
            columns = columns.map(function (column) {
                var map = self.getColumnSearchProps(column.key);
                for (var key in map) {
                    column[key] = map[key];
                }
                return column;
            });
        }
    }

    getContent(record) {
        return <p className="mydiv">
                  {record.address}
               </p>
    }

    render() {
        var self = this;
        var dataSource = this.state.dataSource;
        var columns = this.state.columns;
        console.log('url:' + self.url)
        if (columns && columns[0].key != 'xuhao' && self.url) {
            columns.unshift(
                {
                    title: "住址",
                    width:200,
                    dataIndex: "address",
                    className:"resultColumnsDiv", 
                    key: "address",
                    render: (text, record, index) => ( 
                        <Popover placement="topLeft" content = {this.getContent(record)} trigger = "hover">
                            {record.address}
                        </Popover>
                        )
                }
            );
            
            columns.unshift(
                {
                    title: "姓名",
                    width:'50px',
                    dataIndex: "name",
                    key: "name",
                    render: (text, record, index) => ( 
                        <Popover placement="top" content = {record.name}
                                 trigger = "hover">
                                 {record.name}
                        </Popover>
                        )
                },
            );

            columns.unshift(
                {
                    title: '序号',
                    width: '30px',
                    key: 'xuhao',
                    render: (text, record, index) => `${index + 1}`,
                    
                }
            );

            columns.push(
                {
                    title: '操作',
                    key: 'operation',
                    width:200,
                    render: (text, record) => (  //塞入内容
                        <div>
                            <span id='take' style={{float:'left', width:70, height:30}}>
                                <ModalDemo url={self.url} record={record} name="占用" ></ModalDemo>
                            </span>
                            <span>
                                <ModalDemo url={self.url} record={record} name="释放"></ModalDemo>
                            </span>
                            
                        </div>
                        
                    )
                }
            )
        }

        self.setSorter(columns);
        self.setSearch(columns);

        return <Table dataSource={dataSource} columns={columns} />;
        
    }
}

export { MyTable };
