Ext.define('Kanban.view.LearningScanWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.learningscanwin',
    modal: true,
    width: 500,
    height: 300,
    title: '培训扫描',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    defaults: {
        margin: '10 5 10 5',
        layout: 'fit',
        flex: 1
    },

    initComponent: function () {
        var me = this;
        var f1Valid = false;
        var f2Valid = false;
        var f1 = Ext.create('Ext.form.Panel', {
            frame: true,
            api: {
                load: KanBan.GetSkillApplyInfo
            },
            paramOrder: ['applyid'],
            defaults: {
                labelAlign: 'left',
                labelWidth: 40,
                margin: '10 5 10 5'
            },
            defaultType: 'displayfield',
            items: [{
                xtype: 'textfield',
                fieldLabel: '编号',
                name: 'applyid',
                allowBlank: false,
                listeners: {
                    change: function () {
                        me.down('button[text=提交]').setDisabled(true);
                    },
                    blur: function (f) {
                        f1.getForm().load({
                            params: { applyid: f.getValue() },
                            success: function () {
                                f1Valid = true;
                                var curStage = f1.down('[name=status]').getValue();
                                if (curStage == '基础理论') {
                                    f2.down('[name=job]').setDisabled(true);
                                    f2.down('[name=suffix]').setDisabled(true);
                                    f2.load({
                                        params: { job: '', applyid: f.getValue() }
                                    });
                                    f2Valid = true;
                                }
                                if (f1Valid && f2Valid)
                                { me.down('button[text=提交]').setDisabled(false); }
                            },
                            failure: function (form, act) {
                                KanBan.util.msg('错误', act.result.errorMessage);
                            }
                        });
                    }
                }
            }, {
                name: 'emp',
                fieldLabel: '员工'
            }, {
                name: 'item',
                fieldLabel: '项目'
            }, {
                name: 'op',
                fieldLabel: '工序'
            }, {
                name: 'type',
                fieldLabel: '类型'
            }, {
                name: 'status',
                fieldLabel: '阶段'
            }]
        });
        var f2 = Ext.widget('form', {
            frame: true,
            api: {
                load: KanBan.GetJobOrderInfo
            },
            paramOrder: ['job', 'applyid'],
            defaults: {
                anchor: '100%',
                labelAlign: 'left',
                labelWidth: 50,
                margin: '10 5 10 5'
            },
            defaultType: 'displayfield',
            items: [{
                xtype: 'fieldcontainer',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'textfield',
                    labelWidth: 50,
                    flex: 4,
                    name: 'job',
                    fieldLabel: '工卡号',
                    allowBlank: false,
                    listeners: {
                        change: function () {
                            me.down('button[text=提交]').setDisabled(true);
                        },
                        blur: function (f) {
                            var applyid = f1.getForm().getValues().applyid;
                            if (applyid.length == 0) {
                                KanBan.util.msg('提示', '请在左边输入培训编号');
                                return false;
                            }
                            f2.getForm().load({
                                params: { job: f.getValue(), applyid: applyid },
                                success: function () {
                                    f2Valid = true;
                                    if (f1Valid && f2Valid) {
                                        me.down('button[text=提交]').setDisabled(false);
                                    }
                                },
                                failure: function (form, act) {
                                    KanBan.util.msg('错误', act.result.errorMessage);
                                }
                            });
                        }
                    }
                }, {
                    xtype: 'displayfield',
                    value: ' - '
                }, {
                    flex: 1,
                    xtype: 'textfield',
                    readOnly: true,
                    name: 'suffix'
                }]
            }, {
                name: 'serial',
                fieldLabel: '序列号'
            }, {
                name: 'item',
                fieldLabel: '零件号'
            }, {
                name: 'tutor',
                fieldLabel: '指导'
            }, {
                name: 'trans_type',
                fieldLabel: '操作'
            }, {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                border: '1 0 0 0',
                defaults: {
                    flex: 1,
                    labelWidth: 30,
                    renderer: function (v, field) {
                        if (!v) {
                            return '';
                        } else {
                            return Ext.Date.format(new Date(Date.parse(v)), 'H:i');
                        }
                    }
                },
                defaultType: 'displayfield',
                items: [{
                    name: 'starttime',
                    fieldLabel: '开始'
                }, {
                    name: 'endtime',
                    fieldLabel: '结束'
                }]
            }]
        });
        me.items = [f1, f2];
        me.buttons = [{
            text: '重置',
            handler: function () {
                f1.getForm().reset();
                f2.getForm().reset();
            }
        }, {
            text: '提交',
            disabled: true,
            handler: function () {
                var job = f2.getValues().job;
                var applyid = f1.getValues().applyid;

                var a = f1.down('[name=status]').getValue();
                if (a == '主管确认' || a == '扫描归档' || a == '质量部确认') {
                    KanBan.util.msg('错误', '培训当前不处于实操阶段，不需要扫描');
                    return false;
                }

                if (f1Valid && f2Valid) {
                    KanBan.LearnScan(job ? job : '', applyid, function (res) {
                        if (res.success) {
                            KanBan.util.msg('', '提交成功');
                            me.close();
                            cq.query('skillscantransgrid')[0].store.load();
                        }
                        else {
                            KanBan.util.msg('错误', '提交未成功');
                        }
                    });
                    f2.getForm().reset();
                }
            }
        }]

        me.on('close', function (a) {
        });
        me.callParent();
    }
});