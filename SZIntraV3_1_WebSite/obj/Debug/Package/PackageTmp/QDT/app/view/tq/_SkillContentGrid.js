Ext.define('Kanban.view.SkillContentGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.skillcontentgrid',
    store: 'SkillContents',
    columns: [{
        xtype: 'rownumberer'
    }, {
        dataIndex: 'content', text: '培训内容<br/>Content', flex: 4
    }, {
        dataIndex: 'type', text: '技能类型<br/>Skill Type'
    }, {
        dataIndex: 'importance', text: '重要性<br/>Importance', flex: 1, renderer: starRating
    }],

    initComponent: function () {
        var me = this;
        var s = Ext.StoreMgr.lookup(me.store);

        me.tbar = [{
            tooltip: '编辑<br/>Edit',
            iconCls: 'edit-16',
            handler: function () {
                var rec = me.selModel.selected.first();
                if (!rec) {
                    Ext.Msg.alert('错误', '没有记录被选择');
                }
                else {
                    var f = Ext.create('Ext.form.Panel', {
                        frame: true,
                        layout: 'fit',
                        items: [{
                            xtype: 'fieldset',
                            title: '培训内容(Training Content)',
                            defaults: {
                                labelWidth: 75
                            },
                            items: [{
                                xtype: 'textarea',
                                name: 'content',
                                anchor: '100% 100%',
                                fieldLabel: '培训内容',
                                value: (rec.data.content).toString().replace(/<br\/>/g, "\r\n")
                            }]
                        }]
                    });
                    var win = Ext.create('Ext.window.Window', {
                        modal: true,
                        width: 450,
                        height: 300,
                        layout: 'fit',
                        items: [f],
                        buttons: [{
                            text: '保存',
                            handler: function () {
                                var content = f.getValues().content;
                                var id = rec.data.id;
                                KanBan.UpdateTrainContent(id, content, function (result) {
                                    if (result.success) {
                                        KanBan.util.msg('', '操作成功');
                                        rec.data.content = content.replace(/\n/g, '<br/>');
                                        rec.commit();
                                    }
                                    else {
                                        KanBan.util.msg('', '操作失败');
                                    }
                                });
                                win.close();
                            }
                        }, {
                            text: '取消',
                            handler: function () {
                                win.close();
                            }
                        }]
                    });

                    win.show();
                }
            }
        }];


        me.callParent();
    }




});