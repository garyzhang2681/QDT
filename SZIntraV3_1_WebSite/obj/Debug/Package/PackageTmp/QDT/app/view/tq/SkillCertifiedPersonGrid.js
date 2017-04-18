Ext.define('QDT.view.tq.SkillCertifiedPersonGrid', {
    alias: 'widget.tq-skillcertifiedpersongrid',
    extend: 'Ext.grid.Panel',
    store: 'SkillCertifiedPersons',
    features: [
        Ext.create('Ext.grid.feature.Grouping', {
            groupHeaderTpl: '{name}'
        })
    ],
    viewConfig: {
        plugins: [{
            ptype: 'preview',
            bodyField: 'comment',
            expanded: true
        }]
    },

    initComponent: function () {
        var me = this,
            store = Ext.StoreMgr.lookup(me.store);

        Ext.applyIf(me, {
            columns: [{
                dataIndex: 'person', text: '工号<br/>Emp ID', width: 60
            }, {
                dataIndex: 'emp_name', text: '姓名<br/>Emp Name', width: 80
            }, {
                dataIndex: 'issue_date', text: '认证日期<br/>Qualification Date', flex: 1, renderer: Ext.util.Format.dateRenderer('Y-m-d')
            }, {
                dataIndex: 'refresh_date', text: '上次加工日期<br/>Last Mfg Date', flex: 1, renderer: Ext.util.Format.dateRenderer('Y-m-d')
            }, {
                dataIndex: 'expire_date', text: '过期日期<br/>Expire Date', flex: 1, renderer: Ext.util.DIYFormat.SkillExpireDate
            }, {
                dataIndex: 'status', text: '状态<br/>Status', width: 80, renderer: skillStatus
            }, {
                dataIndex: 'istrainer', text: '是否培训师<br/>Is Trainer', width: 80, xtype: 'booleancolumn', trueText: 'Yes', falseText: 'No'
            }]
        });

//        me.tbar = [{
//            text: '显示所有',
//            iconCls: 'reload_all',
//            pressed: me.displayAll,
//            enableToggle: true,
//            toggleHandler: function (btn, pressed) {
//                me.displayAll = pressed;
//                var skillGrid = Ext.getCmp('opskillmodule').items.getAt(0).activeTab;
//                var rec = skillGrid.selModel.selected.first();
//                if (!rec) {
//                    KanBan.util.msg('', '没有选定技能');
//                }
//                else {
//                    s.load({
//                        params: { item: rec.data.op ? rec.data.item : rec.data.id, op: rec.data.op ? rec.data.op : '', displayAll: pressed }
//                    });
//                }
//            }
//        }];
//        var user = Ext.util.Cookies.get('user');
//        //not good
//        if (user && user === '307004932') {
//            me.on('itemcontextmenu', function (a, rec, item, i, e) {
//                e.stopEvent();
//                var commitChange = function (res, nv) {
//                    if (res.success) {
//                        KanBan.util.ghostSuccess();
//                        rec.data.istrainer = nv.istrainer;
//                        rec.commit();
//                    }
//                    else {
//                        Ext.Msg.alert('Failed', res.errorMessage);
//                    }
//                };

//                var menu = Ext.create('Ext.menu.Menu', {
//                    items: [{
//                        text: '授权为培训师',
//                        handler: function () {
//                            //TODO: add this employee as trainer of the pn-op
//                            var person = rec.data.person;
//                            var skillgrid = cq.query('partopskillgrid')[0].up('tabpanel').activeTab;
//                            var record = skillgrid.selModel.selected.first();
//                            if (!record) {
//                                KanBan.util.msg('错误', '未指定技能');
//                            }
//                            else if (skillgrid.xtype === 'partopskillgrid') {
//                                var item = record.data.item;
//                                var op = record.data.op;
//                                KanBan.QualifyTrainer('partop', item, op, person, function (res) {
//                                    commitChange(res, { istrainer: 1 });
//                                });
//                            }
//                            else {
//                                var id = record.data.id;
//                                KanBan.QualifyTrainer('skillcode', id, '', person, function (res) {
//                                    commitChange(res, { istrainer: 1 });
//                                });
//                            }
//                        }
//                    }, {
//                        text: '取消培训师授权',
//                        handler: function () {
//                            //TODO: remove the qualification
//                            var person = rec.data.person;
//                            var skillgrid = cq.query('partopskillgrid')[0].up('tabpanel').activeTab;
//                            var record = skillgrid.selModel.selected.first();
//                            if (!record) {
//                                KanBan.util.msg('错误', '未指定技能');
//                            }
//                            else if (skillgrid.xtype === 'partopskillgrid') {
//                                var item = record.data.item;
//                                var op = record.data.op;
//                                KanBan.DisqualifyTrainer('partop', item, op, person, function (res) {
//                                    commitChange(res, { istrainer: 0 });
//                                });
//                            }
//                            else {
//                                var id = record.data.id;
//                                KanBan.DisqualifyTrainer('skillcode', id, '', person, function (res) {
//                                    commitChange(res, { istrainer: 0 });
//                                });
//                            }
//                        }
//                    }]
//                });
//                menu.showAt(e.getXY());
//            });
//        }

        me.callParent();
    }

});