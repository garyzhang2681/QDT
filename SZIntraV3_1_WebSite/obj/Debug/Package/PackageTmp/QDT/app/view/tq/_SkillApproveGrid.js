Ext.define('Kanban.view.SkillApproveGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.skillapprovegrid',
    store: Ext.create('Ext.data.DirectStore', {
        fields: ['id', 'applyid', 'employeeid', 'skill', 'emp_name', 'starttime', 'movetime', 'status', 'attachment'],
        directFn: KanBan.ApplyToApprove,
        paramOrder: ['query', 'kbuser'],
        root: 'data',
        listeners: {
            beforeload: function () {
                var kbuser = Ext.util.Cookies.get('user');
                var query = cq.query('skillapprovegrid')[0].down('[name=query]').getValue();
                this.getProxy().extraParams.kbuser = kbuser;
                this.getProxy().extraParams.query = (query == null) ? '' : query;
            },
            datachanged: function () {
                var cmp = cq.query('#skillapprovemodule gridpanel')[1];
                cmp.store.removeAll();
            }
        }

    }),
    columns: [{
        dataIndex: 'applyid', text: '编号<br/>ID', flex: 1
    }, {
        dataIndex: 'employeeid', text: '工号<br/>Emp ID', flex: 1
    }, {
        dataIndex: 'emp_name', text: '姓名<br/>Name', flex: 1
    }, {
        dataIndex: 'skill', text: '技能<br/>Skill', flex: 2.5
    }, {
        dataIndex: 'status', text: '状态<br/>Status', flex: 1
    }, {
        dataIndex: 'starttime', text: '开始时间<br/>Start Time', flex: 1, renderer: Ext.util.Format.dateRenderer('Y-m-d H:i')
    }, {
        dataIndex: 'movetime', text: '上一步骤批准时间<br/>Last Approval Time', flex: 1, renderer: Ext.util.Format.dateRenderer('Y-m-d H:i')
    }, {
        dataIndex: 'attachment', text: '附件<br/>Attachment', flex: 1, renderer: attachmentRender
    }],

    initComponent: function () {
        var me = this;
        var s = Ext.StoreMgr.lookup(me.store);
        me.tbar = [{
            iconCls: 'symbol_check-16',
            text: '批准',
            handler: function () {
                var rec = me.selModel.selected.first();
                if (!rec) {
                    KanBan.util.msg('', '请选择要批准的条目');
                }
                else {
                    Ext.Msg.confirm('Confirm', '确认要批准当前步骤并将培训移动到下一步骤吗？', function (res) {
                        if (res == 'yes') {
                            var applyid = rec.data.id;
                            KanBan.ForwardSkillProcess(applyid, function (result) {
                                if (result.success) {
                                    KanBan.util.msg('', '已批准');
                                    s.load();
                                }
                                else {
                                    KanBan.util.msg('', result.errMsg);
                                }
                            });
                        }
                    });

                }
            }
        }, {
            iconCls: 'attachment',
            text: '上传培训清单',
            handler: function () {
                var rec = me.selModel.selected.first();
                if (!rec) {
                    KanBan.util.msg('', '请先选择培训编号');
                    return false;
                }
                else {
                    var a = Ext.create('Ext.window.Window', {
                        height: 100,
                        width: 400,
                        title: '上传培训项目清单...',
                        layout: 'fit',
                        items: [{
                            xtype: 'form',
                            api: { submit: KanBan.UploadSkillItemList },
                            frame: true,
                            items: [{
                                xtype: 'fileuploadfield',
                                buttonText: '选择文件...',
                                anchor: '100%',
                                allowBlank: false
                            }]
                        }],
                        buttons: [{
                            text: '上传',
                            handler: function () {
                                var form = a.down('form').getForm();
                                if (form.isValid()) {
                                    form.submit({
                                        params: { applyid: rec.data.applyid },
                                        success: function (fp) {
                                            KanBan.util.msg('', '文件已成功上传');
                                            a.close();
                                            me.store.load();
                                        },
                                        failure: function (fp) {
                                            console.log(fp);
                                        }
                                    });
                                }
                            }
                        }, {
                            text: '取消',
                            handler: function () {
                                a.close();
                            }
                        }]
                    });
                    a.show();
                }
            }
        }, {
            iconCls: 'backward',
            text: '回退到上一步骤',
            handler: function () {
                var rec = me.selModel.selected.first();
                if (rec) {
                    Ext.Msg.prompt('是否确认将培训移动到上一步骤？', '原因：', function (a, b) {
                        if (a == 'ok') {
                            var user = Ext.util.Cookies.get('user');
                            KanBan.BackwardSkillApply(rec.data.id, b, user, function (result) {
                                if (result.success) {
                                    KanBan.util.msg('', '成功');
                                    me.store.load();
                                }
                                else {
                                    KanBan.util.msg('', result.errMsg);

                                }
                            });
                        }
                    });
                }
                else {
                    KanBan.util.msg('', '请先选择一条记录');
                }
            }
        },
        '->', {
            xtype: 'searchfield',
            name: 'query',
            emptyText: '搜索编号/工号',
            store: s,
            width: 150
        }];


        me.callParent();
    }




});