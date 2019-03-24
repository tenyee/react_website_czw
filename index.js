import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { DatePicker } from 'antd';
import { Table } from 'antd';
import { MyTable } from "./js/MyTable.js";
import { GCDate } from "./js/MyTable.js";
import { Tabs } from 'antd';
import { Carousel } from 'antd';
import { Card, Col, Row } from 'antd';

const TabPane = Tabs.TabPane;


function App() {
    const tabPanes = urlList.map(function (item) {
        var tab = null;
        if (item.type == 'table') {
            tab = (
                < MyTable url={item.url} />
            );
        } else if (item.type == 'image') {
            var rows = item.list.map(function (imageItem) {
                return (
                    <Row style={{ padding: '10px 20px' }}>
                        <Card title={imageItem.name}><img src={imageItem.url} alt={imageItem.name + ' : ' + imageItem.url} /></Card>
                    </Row>
                );
            });
            tab = (
                <div style={{ background: '#ECECEC' }}>
                    {rows}
                </div>
            );
        }
        return (
            <TabPane tab={item.name} key={item.name}> {tab}</TabPane>
        );

    });

    return (
        <div>
            <Tabs>
                {tabPanes}
            </Tabs>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
