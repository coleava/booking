import React from 'react';
import { Button, Card, Input, Pagination, Table, Modal, Form, Popconfirm } from 'antd'
import { users } from './util';
import _ from 'lodash'

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};
const tailLayout = {
    wrapperCol: { offset: 16, span: 24 },
};
function Users (props) {
    const [form] = Form.useForm();
    React.useEffect(() => {
        if (props.editVisible) {
            form.setFieldsValue({ ...props.editItem })
        }
    }, [props.editVisible])
    return <Card style={{ padding: 15 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '50%' }}>
                <Input placeholder='请输入姓名/手机/邮箱查询' onChange={e => props.search(e.target.value)} style={{ marginRight: 15 }} />
                <Button type="primary" onClick={props.addUser}>添加人员</Button>
            </div>
            <Pagination
                current={props.page}
                pageSize={props.size}
                total={props.total}
                showSizeChanger={false}
                showTotal={total => `共 ${total} 条`}
                onChange={props.paginationChange}
            />
        </div>
        <Table
            columns={[
                {
                    title: '序号',
                    dataIndex: 'key',
                    render: index => index + 1,
                },
                {
                    title: '姓名',
                    dataIndex: 'name',
                },
                {
                    title: '手机号',
                    dataIndex: 'mobile',
                },
                {
                    title: '邮箱',
                    dataIndex: 'email',
                },
                {
                    title: '地址',
                    dataIndex: 'address',
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    render: (item, record) =>
                        <div>
                            <a style={{ marginRight: 15 }} onClick={() => props.edit(record)}>编辑</a>
                            <Popconfirm
                                title='确定要删除此条内容?'
                                onConfirm={() => props.delete(record.key)}
                                okText="确认"
                                cancelText="取消"
                            >
                                <a>删除</a>
                            </Popconfirm>
                        </div>

                },
            ]}
            dataSource={props.users}
            pagination={false}
        />
        <Modal
            title="添加人员"
            okText="确认"
            cancelText="取消"
            destroyOnClose
            footer={null}
            visible={props.visible}
            onCancel={props.onCancel}
        >

            <Form {...layout} form={form} name="control-hooks" onFinish={props.onOk}>
                <Form.Item hidden name="id" label="id" >
                    <Input />
                </Form.Item>
                <Form.Item hidden name="key" label="key" >
                    <Input />
                </Form.Item>
                <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="mobile" label="手机" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="邮箱" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="address" label="地址" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button htmlType="button" onClick={props.onCancel}>取消</Button>
                    <Button style={{ marginLeft: 15 }} type="primary" htmlType="submit">确认</Button>
                </Form.Item>
            </Form>
        </Modal>
    </Card>
}

let hoc = WrappedCompoment => {
    return class EnhancedComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                users: this.mockPagination(1, 20, users),
                page: 1,
                size: 20,
                total: users.length,
                visible: false,
                editItem: null,
                editVisible: false
            }
            this.page = 1
            this.size = 20
            this.total = 0
        }

        // 模拟分页
        mockPagination = (page, pageSize, newUsers) => _.chain(newUsers ? newUsers : users).slice((page - 1) * pageSize, page * pageSize).value()

        search = value => {
            let result = users;
            if (value) {
                result = _.chain(this.mockPagination(this.state.page, this.state.size))
                    .filter(user => _.includes(user.name, value) || _.includes(user.mobile, value) || _.includes(user.email, value))
                    .value();
                this.setState({
                    users: result,
                    page: _.isEmpty(result) ? 1 : this.state.page,
                    size: _.isEmpty(result) ? 20 : this.state.size,
                    total: _.isEmpty(result) ? 0 : this.state.total
                })
            } else {// 查询条件为空时  还原原本的数据
                this.setState({
                    page: this.page,
                    size: this.size,
                    total: users.length,
                    users: this.mockPagination(this.page, this.size, _.cloneDeep(users))
                })
            }
        }
        paginationChange = (page, pageSize) => {
            this.page = page
            this.size = pageSize
            this.setState({
                page,
                pageSize,
                users: this.mockPagination(page, pageSize, _.cloneDeep(users))
            })
        }

        addUser = () => {
            this.setState({ visible: true, editVisible: false });
        }
        edit = editItem => {
            this.setState({ visible: true, editVisible: true, editItem });
        }

        delete = index => {
            users.splice(index, 1)
            this.setState({ users: this.mockPagination(this.page, this.size, users), total: users.length })
        }
        onOk = values => {
            let result = users
            if (this.state.editVisible) { // 编辑
                result = _.chain(result).map((user) => values.id === user.id ? user = values : user).value()
            } else {
                let item = {
                    ...values,
                    key: users.length
                };
                result.push(item)
            }

            this.setState({
                users: this.mockPagination(this.page, this.size, result),
                total: users.length,
                visible: false,
                editVisible: false,
                page: this.page,
                size: this.size
            })
        }
        render () {
            return <WrappedCompoment
                {...this.state}
                search={this.search}
                addUser={this.addUser}
                visible={this.state.visible}
                onOk={this.onOk}
                edit={this.edit}
                delete={this.delete}
                onCancel={() => this.setState({ visible: false, editVisible: false })}
                paginationChange={this.paginationChange}
            />
        }
    }
}

export default hoc(Users)