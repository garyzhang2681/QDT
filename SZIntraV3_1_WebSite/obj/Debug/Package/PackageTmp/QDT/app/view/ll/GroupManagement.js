Ext.define('QDT.view.ll.GroupManagement', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.ll-groupmanagement',
    activeRecord: {},

    initComponent: function () {
        var me = this,
            groupGrid,
            employeeNotInGroupGrid,
            employeeInGroupGrid;

        var emp_columns = [
            {
                text: Profile.getText('EmployeeName'),
                width: 90,
                dataIndex: 'name_cn'
            }, {
                text: Profile.getText('EmployeeName'),
                width: 90,
                dataIndex: 'name_en'
            }, {
                text: Profile.getText('sso'),
                width: 90,
                dataIndex: 'sso'
            }, {
                text: 'Employee Id', //todo language
                width: 90,
                dataIndex: 'employee_id',
                hidden: true
            }
        ];


        groupGrid = Ext.widget('grid', {
            itemId: 'group-grid',
            height: 300,
            flex: 1,
            plugins: [{
                ptype: 'rowediting',
                clicksToEdit: 2,
                pluginId: 'row-edit',
                listeners: {
                    beforeedit: function (editor, context) {
                    },
                    validateedit: function (editor, context) {
                        var record = context.record;
                    },
                    canceledit: function (editor, context) {
                        me.down('#add').setDisabled(false);
                        var record = context.record,
                            store = groupGrid.getStore();
                        if (record.data.working_group_id === '') {
                            store.remove(record);
                        }
                    },
                    edit: function (editor, context) {
                        var record = context.record;
                        if (record.data.working_group_id === '') {
                            DpHr.CreateGroup(record.data['working_group'], function (result) {
                                me.onGroupModified(result, record, true);
                            });
                        } else {
                            DpHr.UpdateGroup(record.data, function (result) {
                                me.onGroupModified(result, record, true);
                            });

                        }
                    }
                }
            }],
            store: Ext.create('QDT.store.ll.WorkingGroups', {
                autoDestroy: true,
                autoLoad: true
            }),
            columns: [{
                dataIndex: 'working_group_id', text: 'ID', width: 80
            }, {
                dataIndex: 'working_group', text: Profile.getText('working_group'), minWidth: 150, flex: 1, editor: {
                    itemId: 'group-editor',
                    xtype: 'textfield',
                    allowBlank: false
                }
            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                defaults: {
                    scope: me
                },
                items: [{
                    iconCls: 'add',
                    itemId: 'add',
                    handler: me.addGroup
                }, {
                    iconCls: 'delete',
                    itemId: 'delete',
                    handler: me.deleteGroup,
                    disabled: true
                }, '->', {
                    iconCls: 'refresh',
                    itemId: 'refresh',
                    handler: function () {
                        groupGrid.getStore().load();
                    }
                }]
            }]
        });


        employeeInGroupGrid = Ext.create('Asz.ux.LiveSearchGridPanel', {
            title: Profile.getText('GroupMembers'),
            itemId: 'employee-in-group-grid',
            height: 300,
            flex: 2,
            multiSelect: true,
            store: Ext.create('Ext.data.Store', {
                model: 'Asz.model.hr.Employee'
            }),
            columns: emp_columns,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop'
                },
                listeners: {
                    drop: function (node, data, dropRec, dropPosition) {

                        var record = me.activeRecord;
                        var employees = QDT.util.Util.getRecordsData(data.records);
                    
                        DpHr.AddGroupMember(record.data.working_group_id, employees, function (result) {
                            if (result.success) {
                                //TODO  show drap success message     
                            } else {
                                My.Msg.warning(result.errorMessage);
                            }
                        });
                    }
                }
            }
        });

        employeeNotInGroupGrid = Ext.create('Asz.ux.LiveSearchGridPanel', {
            title: Profile.getText('AllEmployees'),
            itemId: 'employee-not-in-group-grid',
            height: 300,
            flex: 2,
            multiSelect: true,
            store: Ext.create('Ext.data.Store', {
                model: 'Asz.model.hr.Employee'
            }),
            columns: emp_columns,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop'
                },
                listeners: {
                    drop: function (node, data, dropRec, dropPosition) {

                        var record = me.activeRecord;
                        var employees = QDT.util.Util.getRecordsData(data.records);
                     
                        DpHr.DeleteGroupMember(record.data.working_group_id, employees, function (result) {
                            if (result.success) {
                                //TODO  show drap success message     
                            } else {
                                My.Msg.warning(result.errorMessage);
                            }
                        });
                    }
                }
            }
        });

        Ext.apply(me, {
            title: Profile.getText('GroupManagement'),
            frame: true,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                groupGrid,
                employeeNotInGroupGrid,
                employeeInGroupGrid
            ]
        });

        me.callParent();

        groupGrid.on({
            selectionChange: me.onSelectionChange,
            scope: me
        });
    },

    getRowEditing: function () {
        var me = this;
        return me.down('#group-grid').getPlugin('row-edit');
    },

    startEditing: function (record, index) {
        var me = this,
            editor = me.getRowEditing();

        editor.startEdit(record, index);
        //TODO:select text
        //        Ext.defer(editor.editor.getComponent('group-editor').selectText, 200);
    },

    addGroup: function () {
        var me = this,
            editor = me.getRowEditing(),
            store = me.down('#group-grid').getStore(),
            record = Ext.create('QDT.model.ll.WorkingGroup', {
                working_group_id: '',
                working_group: Profile.getText('txtNewGroup')
            });
        editor.cancelEdit();

        me.down('#add').setDisabled(true);
        store.insert(0, record);
        me.startEditing(record, 0);
    },

    deleteGroup: function () {
        var me = this,
            record = me.activeRecord;
        if (record.data.working_group_id === '') {
            me.down('#group-grid').getStore().remove(record);
        } else {
            Ext.Msg.confirm(Profile.getText('Confirm'), Profile.getText('txtConfirmDelete'), function (btn) {
                if (btn === 'yes') {
                    DpHr.DeleteGroup(record.data.working_group_id, function (result) {
                        me.onGroupModified(result, record, false);
                    });
                }
            });
        }
    },

    onGroupModified: function (result, record, reeditOnFailure) {
        var me = this,
            store = me.down('#group-grid').getStore();

        me.down('#add').setDisabled(false);
        if (result.success) {
            store.load();
        } else {
            if (reeditOnFailure) {
                me.startEditing(record, 0);
            }
            Ext.Msg.alert(Profile.getText('Error'), result.errorMessage);
        }
    },

    onSelectionChange: function (selModel, selected) {
        var me = this;
        me.activeRecord = selected[0] || null;

        if (me.activeRecord != null) {
            me.down('#add').setDisabled(false);
            me.down('#delete').setDisabled(selected.length === 0);

            var groups = [];
            groups.push(me.activeRecord.data['working_group_id'])

            DpHr.GetEmployeesInWorkingGroups(groups, function (result) {
                if (result.success) {
                    me.down('[itemId=employee-in-group-grid]').store.loadData(result.data);
                } else {
                    My.Msg.warning(result.errorMessage);
                }
            });
            DpHr.GetEmployeesNotInWorkingGroups(groups, function (result) {
                if (result.success) {
                    me.down('[itemId=employee-not-in-group-grid]').store.loadData(result.data);
                } else {
                    My.Msg.warning(result.errorMessage);
                }
            });
        }
        else {
            me.down('[itemId=employee-in-group-grid]').store.removeAll();
            me.down('[itemId=employee-not-in-group-grid]').store.removeAll();
        }


    }
});