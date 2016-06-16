Ext.define('QDT.view.tq.SkillPersonCountGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.tq-skillpersoncountgrid',
    store: 'tq.SkillPersonCounts',

    initComponent: function () {
        var me = this,
            store = Ext.StoreMgr.lookup(me.store);

        Ext.applyIf(me, {
            columns: [{
                dataIndex: 'id', text: '技能代码<br/>Skill Code', flex: 2.5, renderer: criticalSkillCode
            }, {
                dataIndex: 'certify', text: '已认证<br/>Certified', flex: 1, renderer: criticalSkillCode
            }, {
                dataIndex: 'process', text: '培训中<br/>Training', flex: 1, renderer: criticalSkillCode
            }, {
                dataIndex: 'partops', text: '相关工序<br/>Linked OP', flex: 1, renderer: criticalSkillCode
            }, {
                dataIndex: 'critical', text: '关键<br/>Critical', flex: 1, renderer: criticalSkillCode
            }]
        });

        me.features = [{
            ftype: 'grouping',
            groupHeaderTpl: '{name}',
            hideGroupedHeader: true
        }];

        me.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: ['->', {
                //TODO:
                xtype: 'searchfield',
                name: 'search',
                emptyText: '搜索技能代码',
                store: store
            }]
        }];


        //        if (Ext.Array.indexOf(['307004932', '307009509', '307004931', '307009219', '307006303', '307006710'], Ext.util.Cookies.get('user')) >= 0) {
        //            var adminToolbar = {
        //                xtype: 'toolbar',
        //                dock: 'top',
        //                items: [{
        //                    //                    iconCls: 'add_green-16',
        //                    text: '添加技能代码',
        //                    handler: function () {
        //                        var win = Ext.create('Ext.window.Window', {
        //                            title: '技能代码',
        //                            width: 350,
        //                            height: 230,
        //                            layout: 'fit',
        //                            items: [{
        //                                xtype: 'form',
        //                                frame: true,
        //                                layout: 'anchor',
        //                                defaults: {
        //                                    labelWidth: 65
        //                                },
        //                                items: [{
        //                                    name: 'skillcode',
        //                                    fieldLabel: '技能代码',
        //                                    xtype: 'textfield',
        //                                    anchor: '70%',
        //                                    allowBlank: false,
        //                                    blankText: '请输入技能代码<br/>Please Input Skill Code'
        //                                }, {
        //                                    name: 'business',
        //                                    fieldLabel: '部门',
        //                                    xtype: 'alldeptcombo',
        //                                    anchor: '50%',
        //                                    allowBlank: false,
        //                                    blankText: '请选择部门<br/>Please Select Department',
        //                                    listeners: {
        //                                        select: function (c, r) {
        //                                            win.down('[name=type]').store.load();
        //                                            win.down('[name=nom]').store.load();
        //                                        }
        //                                    }
        //                                }, {
        //                                    name: 'type',
        //                                    fieldLabel: '类型',
        //                                    forceSelection: false,
        //                                    xtype: 'searchcombo',
        //                                    anchor: '70%',
        //                                    store: Ext.create('Ext.data.DirectStore', {
        //                                        fields: ['value'],
        //                                        paramOrder: ['query', 'biz'],
        //                                        directFn: KanBan.comboSkillCodeType,
        //                                        root: 'data',
        //                                        listeners: {
        //                                            beforeload: function () {
        //                                                this.getProxy().extraParams.biz = win.down('[name=business]').getValue() || '';
        //                                            }
        //                                        }
        //                                    }),
        //                                    displayField: 'value',
        //                                    valueField: 'value',
        //                                    allowBlank: false,
        //                                    blankText: '请输入技能类型<br/>Please Select Skill Code Type',
        //                                    listeners: {
        //                                        select: function (c, r) {
        //                                            win.down('[name=nom]').store.load();
        //                                        }
        //                                    }
        //                                }, {
        //                                    name: 'nom',
        //                                    fieldLabel: '描述',
        //                                    forceSelection: false,
        //                                    editable: true,
        //                                    xtype: 'remotecombo',
        //                                    anchor: '85%',
        //                                    store: Ext.create('Ext.data.DirectStore', {
        //                                        fields: ['value'],
        //                                        paramOrder: ['type', 'biz'],
        //                                        directFn: KanBan.comboSkillCodeNom,
        //                                        root: 'data',
        //                                        listeners: {
        //                                            beforeload: function () {
        //                                                this.getProxy().extraParams.biz = win.down('[name=business]').getValue() || '';
        //                                                this.getProxy().extraParams.type = win.down('[name=type]').getValue() || '';
        //                                            }
        //                                        }
        //                                    }),
        //                                    displayField: 'value',
        //                                    valueField: 'value'
        //                                }, {
        //                                    name: 'critical',
        //                                    fieldLabel: '关键技能',
        //                                    xtype: 'checkbox'
        //                                }]
        //                            }],
        //                            buttons: [{
        //                                text: '提交',
        //                                handler: function () {
        //                                    var f = win.down('form').getForm();
        //                                    if (f.isValid()) {
        //                                        var data = f.getValues();
        //                                        KanBan.AddSkillCode(data.skillcode, data.nom, data.type, data.business, data.critical, function (result) {
        //                                            if (result.success) {
        //                                                KanBan.util.msg('成功', '技能代码已添加');
        //                                            } else {
        //                                                KanBan.util.msg('失败', result.errorMessage);
        //                                            }
        //                                        });
        //                                    }
        //                                }
        //                            }, {
        //                                text: '取消',
        //                                handler: function () {
        //                                    win.close();
        //                                }
        //                            }]
        //                        });

        //                        win.show();
        //                    }
        //                }, '-', {
        //                    xtype: 'splitbutton',
        //                    text: '取消技能',
        //                    menu: Ext.create('Ext.menu.Menu', {
        //                        items: [{
        //                            text: 'Deactivate SkillCode',
        //                            handler: function () {
        //                                var recs = me.selModel.selected;
        //                                if (recs.length > 0) {
        //                                    var rec = recs.first();
        //                                    var skillcode = rec.data.skillcode;
        //                                    Ext.Msg.confirm('', '是否确定停止使用技能代码' + skillcode + '？', function (r) {
        //                                        if (r === 'yes') {
        //                                        }
        //                                    })
        //                                }
        //                                //                                var win = Ext.create('Ext.window.Window', {
        //                                //                                    title: '取消技能',
        //                                //                                    width: 350,
        //                                //                                    height: 135,
        //                                //                                    layout: 'fit',
        //                                //                                    items: [{
        //                                //                                        xtype: 'form',
        //                                //                                        frame: true,
        //                                //                                        layout: 'anchor',
        //                                //                                        defaults: {
        //                                //                                            labelWidth: 100
        //                                //                                        },
        //                                //                                        items: [{
        //                                //                                            name: 'item',
        //                                //                                            fieldLabel: '件号/技能代码',
        //                                //                                            xtype: 'textfield',
        //                                //                                            anchor: '90%',
        //                                //                                            allowBlank: false,
        //                                //                                            blankText: '请输入件号或技能代码'
        //                                //                                        }, {
        //                                //                                            name: 'op',
        //                                //                                            fieldLabel: '工序号',
        //                                //                                            xtype: 'textfield',
        //                                //                                            anchor: '90%',
        //                                //                                            allowBlank: true,
        //                                //                                            blankText: '多个工序使用+隔开，如果是技能代码留空此栏'
        //                                //                                        }]
        //                                //                                    }],
        //                                //                                    buttons: [{
        //                                //                                        text: '提交',
        //                                //                                        handler: function () {
        //                                //                                            var f = win.down('form').getForm();
        //                                //                                            if (f.isValid()) {
        //                                //                                                var data = f.getValues();
        //                                //                                                KanBan.Deactive(data.item, data.op, function (result) {
        //                                //                                                    if (result.success) {
        //                                //                                                    }
        //                                //                                                });
        //                                //                                            }
        //                                //                                        }
        //                                //                                    }, {
        //                                //                                        text: '取消',
        //                                //                                        handler: function () {
        //                                //                                            win.close();
        //                                //                                        }
        //                                //                                    }]
        //                                //                                });

        //                                //                                win.show();
        //                            }
        //                        }, {
        //                            text: 'Delete Skill',
        //                            handler: function () {
        //                                var rec = me.selModel.selected.first();
        //                                if (rec) {
        //                                    Ext.Msg.confirm('', '确定要删除该技能代码吗？', function (a) {
        //                                        if (a === 'yes') {
        //                                            KanBan.DeleteSkillCode(rec.data.id, function (result) {
        //                                                if (result.success) {
        //                                                    {
        //                                                        KanBan.util.msg('成功', '技能代码已经删除');
        //                                                        me.store.load();
        //                                                    }
        //                                                } else {
        //                                                    KanBan.util.msg('失败', result.errorMessage);
        //                                                }
        //                                            });
        //                                        }
        //                                    });
        //                                }
        //                            }
        //                        }]
        //                    })
        //                }, '-', {
        //                    iconCls: '',
        //                    text: '指定相关工序',
        //                    handler: function () {
        //                        var rec = me.selModel.selected.first();
        //                        if (rec) {
        //                            var b = Ext.create('Ext.data.DirectStore', {
        //                                fields: ['id', 'pn', 'op', 'type', 'nom'],
        //                                directFn: KanBan.PartOpBase,
        //                                paramsAsHash: true,
        //                                root: 'data',
        //                                totalProperty: 'total',
        //                                pageSize: 50,
        //                                listeners: {
        //                                    beforeload: function () {
        //                                        this.getProxy().extraParams.query = a.down('[name=query]').getValue();
        //                                    }
        //                                }
        //                            });
        //                            var c = Ext.create('Ext.data.DirectStore', {
        //                                fields: ['id', 'pn', 'op', 'type', 'nom'],
        //                                directFn: KanBan.CombinedOpCode,
        //                                paramsAsHash: true,
        //                                root: 'data',
        //                                listeners: {
        //                                    beforeload: function () {
        //                                        this.getProxy().extraParams.skillcode = rec.data.id;
        //                                    }
        //                                }
        //                            });
        //                            var a = Ext.create('Ext.window.Window', {
        //                                title: Ext.String.format('技能代码({0})的相关工序', rec.data.id),
        //                                width: 600,
        //                                height: 450,
        //                                layout: 'fit',
        //                                items: [{
        //                                    xtype: 'tabpanel',
        //                                    tabPosition: 'bottom',
        //                                    items: [{
        //                                        xtype: 'gridpanel',
        //                                        title: '添加新的相关工序',
        //                                        itemId: 'newpartops',
        //                                        store: b,
        //                                        selModel: Ext.create('Ext.selection.CheckboxModel'),
        //                                        columns: [{
        //                                            dataIndex: 'pn', text: 'Item', flex: 2.5
        //                                        }, {
        //                                            dataIndex: 'op', text: 'OP', flex: 1
        //                                        }, {
        //                                            dataIndex: 'type', text: 'Type', flex: 1
        //                                        }, {
        //                                            dataIndex: 'nom', text: 'Description', flex: 4
        //                                        }],
        //                                        tbar: [{
        //                                            xtype: 'searchfield',
        //                                            name: 'query',
        //                                            store: b
        //                                        }, '->', {
        //                                            text: 'Add Selected',
        //                                            handler: function () {
        //                                                var recs = a.down('tabpanel').child('#newpartops').selModel.selected;
        //                                                if (recs.length > 0) {
        //                                                    Ext.Array.each(recs.items, function (item) {
        //                                                        KanBan.CombineOpSkillCode(rec.data.id, item.data.id, function (result) {
        //                                                            if (!result.success) {
        //                                                                KanBan.util.msg('', '一条记录失败');
        //                                                            }
        //                                                        })
        //                                                    });
        //                                                }
        //                                            }
        //                                        }],
        //                                        bbar: {
        //                                            xtype: 'slidingpager',
        //                                            store: b
        //                                        }
        //                                    }, {
        //                                        xtype: 'gridpanel',
        //                                        title: '移除相关工序',
        //                                        itemId: 'existedpartops',
        //                                        store: c,
        //                                        selModel: Ext.create('Ext.selection.CheckboxModel'),
        //                                        columns: [{
        //                                            dataIndex: 'pn', text: 'Item', flex: 2.5
        //                                        }, {
        //                                            dataIndex: 'op', text: 'OP', flex: 1
        //                                        }, {
        //                                            dataIndex: 'type', text: 'Type', flex: 1
        //                                        }, {
        //                                            dataIndex: 'nom', text: 'Description', flex: 4
        //                                        }],
        //                                        tbar: [{
        //                                            text: 'Remove Selected',
        //                                            handler: function () {
        //                                                var recs = this.up('gridpanel').selModel.selected;
        //                                                if (recs.length > 0) {
        //                                                    Ext.Array.each(recs.items, function (item) {
        //                                                        KanBan.RemoveOpCode(rec.data.id, item.data.id, function (result) {
        //                                                            if (result.success) {
        //                                                                c.remove(item);
        //                                                            }
        //                                                        });
        //                                                    });
        //                                                }
        //                                            }
        //                                        }]
        //                                    }]
        //                                }]
        //                            });
        //                            a.show();
        //                            b.load();
        //                            c.load();
        //                        }
        //                    }
        //                }]
        //            };
        //            me.dockedItems.push(adminToolbar);
        //        }

        me.bbar = {
            xtype: 'pagingtoolbar',
            store: store
        };

        this.callParent();
    }
})