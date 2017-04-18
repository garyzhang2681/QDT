Ext.define('Kanban.view.SkillScanTransGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.skillscantransgrid',
    store: 'SkillScanTrans',
    columns: [{
        dataIndex: 'applyid', text: '编号<br/>ID', width: 90
    }, {
        dataIndex: 'item', text: '项目/零件号<br/>Item', flex: 3
    }, {
        dataIndex: 'employeeid', text: '工号<br/>Employee ID', width: 70
    }, {
        dataIndex: 'emp_name', text: '姓名<br/>Name', width: 70
    }, {
        dataIndex: 'status', text: '阶段<br/>Stage', flex: 3
    }, {
        dataIndex: 'job', text: '工卡号<br/>Job Order', width: 90
    }, {
        dataIndex: 'serial', text: '序列号<br/>Serial Num', width: 90
    }, {
        dataIndex: 'starttime', text: '开始<br/>Start', width: 80, renderer: Ext.util.Format.dateRenderer('Y-m-d H:i')
    }, {
        dataIndex: 'endtime', text: '结束<br/>End', width: 80, renderer: Ext.util.Format.dateRenderer('Y-m-d H:i')
    }, {
        dataIndex: 'mins', text: '持续（分钟）<br/>Duration', flex: 2
    }],

    initComponent: function () {
        var me = this;
        var s = Ext.StoreMgr.lookup(me.store);

        var win =

        me.tbar = [{
            xtype: 'searchfield',
            name: 'applyid',
            store: s,
            width: 150,
            emptyText: '按编号搜索'
        }, '-', {
            xtype: 'searchfield',
            name: 'employeeid',
            store: s,
            width: 150,
            emptyText: '按工号搜索'
        }, '-', {
            text: '显示扫描窗口',
            iconCls: 'window-16',
            name: 'showscanwin',
            handler: function () {
                var win = Ext.widget('learningscanwin');
                win.show();
            },
            scope: this
        }, '-', {
            text: '结束选中记录',
            iconCls: 'stop-16',
            handler: function () {
                var rec = me.selModel.selected.first();
                if (!rec) {
                    KanBan.util.msg('', '没有记录被选择');
                }
                else if (rec.data.endtime) {
                    KanBan.util.msg('', '当前记录已经结束');
                }
                else {
                    Ext.Msg.confirm('确认', '是否确定要已当前时间结束这条记录？', function (a) {
                        if (a == 'yes') {
                            KanBan.EndSkillScanByRowSpec(rec.data.row_spec, function (res) {
                                if (res.success) {
                                    KanBan.util.msg('', '操作成功');
                                    me.store.load();
                                }
                                else {
                                    KanBan.util.msg('', '操作失败');
                                }
                            });
                        }
                    });
                }
            }
        }];

        me.bbar = {
            xtype: 'slidingpager',
            store: s
        };

        me.callParent();
    }




});