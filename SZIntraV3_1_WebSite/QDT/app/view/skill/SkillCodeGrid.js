Ext.define('QDT.view.skill.SkillCodeGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.skill-skillcodegrid',
    requires: [
        'QDT.util.Util'
    ],
    activeRecord: {},

    initComponent: function () {
        var me = this,
            store = Ext.create('QDT.store.skill.SkillCodes');

        Ext.apply(me, {
            store: store,
            columns: {
                items: [{
                    dataIndex: 'id', text: 'Id', width: 45, hidden: true
                }, {
                    dataIndex: 'skill_code', text: Profile.getText('skill_code'), minWidth: 115
                }, {
                    dataIndex: 'description', text: Profile.getText('description'), minWidth: 115
                }, {
                    dataIndex: 'business', text: Profile.getText('business'), renderer: Ext.util.Format.capitalize, width: 120
                }, {
                    dataIndex: 'is_deleted', text: '已删除技能', width: 70, renderer: QDT.util.Renderer.booleanIconRenderer
                }, {
                    xtype: 'booleancolumn', dataIndex: 'critical', text: Profile.getText('critical_skill'), width: 60, renderer: QDT.util.Renderer.booleanIconRenderer
                }]
            },
            dockedItems: [{
                dock: 'top',
                items: [{
                    xtype: 'toolbar',
                    border: false,
                    items: [{
                        xtype: 'businesscombo',
                        name: 'business',
                        labelWidth: 65,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['business', {
                                name: 'business_unit', convert: function (v, record) {
                                    return Ext.String.capitalize(record.data.business);
                                }
                            }],
                            data: [{
                                business: 'actuation'
                            }, {
                                business: 'composite'
                            }, {
                                business: 'machining'
                            }, {
                                business: 'quality'
                            }, {
                                business: 'warehouse'
                            }, {
                                business: 'qa-actuation'
                            }, {
                                business: 'qa-composite'
                            }, {
                                business: 'qa-machining'
                            }, {
                                business: 'all'
                            }]
                        }),
                        stateful: true,
                        stateId: 'tq-skillcodegrid-business',
                        value:'all'
                    }, '->', {
                        xtype: 'searchfield',
                        name: 'query',
                        emptyText: Profile.getText('Search'),
                        width: 200,
                        store: store
                    }]
                }, {
                    xtype: 'toolbar',
                    border: '1 0',
                    hidden: me.hide(),
                    items: [{
                        iconCls: 'add_green',
                        text: Profile.getText('add'),
                        handler: function () {
                            Ext.widget('skill-skillcodeeditor', {
                                saveMode: 'add'
                            });
                        }
                    }, {
                        iconCls: 'edit',
                        itemId: 'edit',
                        text: Profile.getText('Edit'),
                        disabled: true,
                        handler: function () {
                            var editor = Ext.widget('skill-skillcodeeditor', {
                                saveMode: 'edit'
                            }).down('form');
                            editor.loadRecord(me.activeRecord);
                        }
                    }, {
                        iconCls: 'delete',
                        itemId: 'delete',
                        disabled: true,
                        text: Profile.getText('Delete'),
                        handler: me.onDeleteClick,
                        scope: me
                    }, '->', {
                        iconCls: 'excel',
                        hidden: true,
                        itemId: 'export',
                        text: Profile.getText('Export'),
                        handler: function () {
                            var url = 'http://' + window.location.host + '/DpSkill/ExportSkillCodes';
                            window.open(url);
                        }
                    }]
                }]
            }],
            bbar: {
                xtype: 'pagingtoolbar',
                displayInfo: true,
                store: store
            }
        });

        me.callParent();
    },

    onDeleteClick: function () {
        var me = this,
            store = me.store;
        Ext.Msg.confirm(Profile.getText('Confirm'), Profile.getText('txtConfirmDelete'), function (btn) {
            if (btn === 'yes') {
                DpSkill.DeleteSkillCode(me.activeRecord.data.id, function (result) {
                    QDT.util.Util.generalCallbackCRUD(result, 'd');
                    store.load();
                });
            }
        });
    },

    hide: function () {
        var currentUserSso = Profile.getUserSso();
        if (currentUserSso == '212348763'
            || currentUserSso == '307006712'
            || currentUserSso == '307010290'
            || currentUserSso == '307006710'
            ) {
            return false;
        } else {
            return true;
        }
    }



});