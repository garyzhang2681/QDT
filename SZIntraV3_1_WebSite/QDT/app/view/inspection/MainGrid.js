Ext.define('QDT.view.inspection.MainGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.inspection-maingrid',
    store: 'inspection.InspectionRecords',
    requires: [
        'Ext.grid.feature.Grouping',
        'Ext.ux.PreviewPlugin',
        'QDT.util.Renderer'
    ],
    features: [{
        ftype: 'grouping',
        groupHeaderTpl: '{columnName}: {name}({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})'
    }],
    plugins: [{
        ptype: 'preview',
        bodyField: 'comments',
        previewExpanded: true
    }],
    selType: 'checkboxmodel',
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },
    activeRecords: [],

    initComponent: function () {
        var me = this,
            store = Ext.StoreMgr.lookup(me.store);

        Ext.applyIf(me, {
            columns: [{
                text: 'Id',
                dataIndex: 'id',
                width: 45
            }, {
                text: Profile.getText('inspection_type'),
                dataIndex: 'type',
                width: 100
            }, {
                text: Profile.getText('part_num'),
                dataIndex: 'item',
                minWidth: 120,
                flex: 2
            }, {
                text: Profile.getText('serial'),
                dataIndex: 'serial',
                minWidth: 80,
                flex: 2
            }, {
                text: Profile.getText('oper_num'),
                dataIndex: 'oper_num',
                width: 60
            }, {
                text: Profile.getText('job'),
                dataIndex: 'wo',
                minWidth: 80,
                flex: 2
            }, {
                text: Profile.getText('suffix'),
                dataIndex: 'suffix',
                minWidth: 80,
                width: 15,
                hidden: true
            }, {
                text: Profile.getText('Project'),
                dataIndex: 'project',
                minWidth: 100,
                flex: 2
            }, {
                text: Profile.getText('create_date'),
                dataIndex: 'create_date',
                width: 110,
                renderer: QDT.util.Renderer.dateTimeRenderer
            }, {
                text: Profile.getText('start_time'),
                dataIndex: 'start_time',
                width: 110,
                renderer: QDT.util.Renderer.dateTimeRenderer
            }, {
                text: Profile.getText('end_time'),
                dataIndex: 'end_time',
                width: 110,
                renderer: QDT.util.Renderer.dateTimeRenderer
            }, {
                text: Profile.getText('quantity'),
                dataIndex: 'quantity',
                width: 45
            }, {
                text: Profile.getText('priority'),
                dataIndex: 'priority',
                width: 45
            }, {
                text: Profile.getText('create_by'),
                dataIndex: 'create_by',
                width: 60
            }, {
                hidden: true,
                text: Profile.getText('create_by_sso'),
                dataIndex: 'create_by_sso',
                flex: 1
            }, {
                text: Profile.getText('Inspector'),
                dataIndex: 'inspector',
                width: 60
            }, {
                hidden: true,
                text: Profile.getText('InspectorSSO'),
                dataIndex: 'inspector_sso',
                flex: 1
            }]
        });

        var locationStore = Ext.create('QDT.store.inspection.InspectionLocations').load({
            params: {
                language: Profile.getLang(),
                view_all: true
            }
        });

        me.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            defaults: {
                scope: me
            },
            items: [{
                iconCls: 'add',
                xtype: 'button',
                text: Profile.getText('SendInspection'),
                handler: me.onSendInspection
            }, {
                xtype: 'button',
                itemId: 'delete-inspection',
                text: Profile.getText('Delete'),
                iconCls: 'delete',
                disabled: true,
                handler: me.onDeleteInspection
            },
            //            {
            //                xtype: 'button',
            //                itemId: 'finish-inspection',
            //                text: Profile.getText('FinishInspection'),
            //                disabled: true,
            //                menu: {
            //                    xtype: 'menu',
            //                    items: [{
            //                        text: Profile.getText('accept'),
            //                        itemId: 'accept'
            //                    }, {
            //                        text: Profile.getText('Decline'),
            //                        itemId: 'decline'
            //                    }]
            //                }
            //            }, 
            {
            xtype: 'button',
            itemId: 'change-location',
            text: Profile.getText('ChangeLocation'),
            disabled: true,
            hidden: true,
            handler: me.onChangeLocation
        }, {
            xtype: 'button',
            itemId: 'edit-inspection',
            text: Profile.getText('EditInspection'),
            disabled: true,
            handler: me.onEditInspection
        }, {
            xtype: 'button',
            itemId: 'comment',
            text: Profile.getText('AddComment'),
            disabled: true,
            handler: me.onAddComment
        }, {
            xtype: 'button',
            itemId: 'prioritize',
            //TODO: spell error PriportizeManually to PrioritizeManually
            text: Profile.getText('PriportizeManually'),
            disabled: true,
            handler: me.onPrioritize
        }, {
            xtype: 'button',
            itemId: 'set_andon',
            text: 'Andon',
            disabled: true,
            handler: me.onSetAndon
        }, {
            xtype: 'button',
            text: Profile.getText('ScanSystem'),
            handler: me.openScanSystem
        }, '->', {
            xtype: 'checkbox',
            name: 'only_unfinished',
            boxLabel: '仅显示未完成',
            checked: true,
            style: {
                fontSize: '11px'
            },
            //TODO
            hidden: true,
            listeners: {
                change: function (field, newValue, oldValue) {
                    store.load();
                }
            }
        }, {
            xtype: 'triggerfield',
            name: 'search_wo_item',
            fieldLabel: Profile.getText('item/WO'),
            labelWidth: 60,

            trigger1Cls: 'x-form-clear-trigger',
            trigger2Cls: 'x-form-search-trigger',

            onTrigger1Click: function () {
                this.setValue('');
            },
            onTrigger2Click: function () {
                store.load();
            },


            listeners: {
                specialkey: function (field, e) {
                    // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
                    // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
                    if (e.getKey() == e.ENTER) {
                        store.load();
                    }
                }
            }
        }, {
            xtype: 'combobox',
            name: 'inspection_location',
            margin: '5 10 5 25',
            fieldLabel: Profile.getText('inspection_location'),
            labelWidth: 60,
            store: locationStore,
            value: 0,
            stateful: true,
            stateId: 'cmb-inspection-location',
            displayField: 'name',
            valueField: 'inspection_location_id',
            editable: false,
            listeners: {
                select: function (cmp) {
                    var search_wo_item = me.down('[name=search_wo_item]').rawValue,
                            inspection_location_id = cmp.value;
                    store.load({
                        params: {
                            search_wo_item: search_wo_item,
                            inspection_location_id: inspection_location_id
                        }
                    });
                }
            }
        }]
    }];

    me.bbar = Ext.widget('pagingtoolbar', {
        store: me.store,
        displayInfo: true,
        plugins: [
                Ext.create('Asz.ux.PagingToolbarResizer', {
                    options: [20, 50, 100, 200, 500]
                })]
    });

    me.callParent();

    me.on({
        selectionchange: me.onSelectionChange,
        afterrender: me.onAfterRenderer
    });
},

onSelectionChange: function (selModel, selected) {
    //TODO： 检查是否所有选中项都是未完成检验的
    var me = this,
            hasNoSelection = (selected.length === 0);
    me.down('#delete-inspection').setDisabled(hasNoSelection);
    // me.down('#accept').setDisabled(hasNoSelection);
    //  me.down('#decline').setDisabled(hasNoSelection);
    me.down('#edit-inspection').setDisabled(hasNoSelection);
    me.down('#comment').setDisabled(hasNoSelection);


    var priority = selected[0] == undefined ? 0 : selected[0].data.priority;
    var disable_urgency = false;
    Ext.Array.each(selected, function (inspection_record) {
        if (inspection_record.data.priority != priority) {
            disable_urgency = true;
        }
    });
    me.down('#prioritize').setDisabled(hasNoSelection || disable_urgency || priority >= 16);
    me.down('#set_andon').setDisabled(hasNoSelection || selected.length > 1 || selected[0].data.urgency != 1);


    me.activeRecords = selected;
},

onAfterRenderer: function () {
    this.store.load();
},

buildUserValidationWindow: function (api, onSuccess, onFailure) {
    return Ext.create('Asz.ux.UserValidation', {
        api: api,
        onSuccess: onSuccess,
        onFailure: onFailure
    }).show();
},

getInspectionIds: function (inspectionRecords) {
    var idArray = [];
    for (var i in inspectionRecords) {
        idArray.push(inspectionRecords[i].data.id);
    }
    return idArray.join(',');
},

getSerials: function (inspectionRecords) {
    var idArray = [];
    for (var i in inspectionRecords) {
        idArray.push(inspectionRecords[i].data.serial);
    }
    return idArray.join('\r');
},

onSendInspection: function () {
    var me = this,
            win = me.buildUserValidationWindow({
                submit: SystemAdmin.UserValidation
            },
            function (form, action) {
                win.close();
                Ext.create('QDT.view.inspection.SendInspection', {
                    create_by: action.result.data.user_id,
                    create_by_name: action.result.data['name_' + Profile.getLang()] + '(' + action.result.data.sso + ')'
                }).show();
            },
            function (form, action) {
                Ext.Msg.alert('Error', action.result.errorMessage);
            }
            );
},

onDeleteInspection: function () {
    var me = this,
        selected_data = cq.query('inspection-maingrid')[0].getSelectionModel().getSelection(),
        inspection_ids = this.getInspectionIds(selected_data),
        win = this.buildUserValidationWindow({
            submit: SystemAdmin.UserValidation
        }, function (form, action) {
            win.close();
            var records = '';
            var user_id = action.result.data['user_id'];
            for (var i = 0; i < selected_data.length; i++) {
                var record = selected_data[i];
                records += record.data['type'] + ':' + record.data['item'] + '  OP:' + record.data['oper_num'] + '</br>';
            }

            My.Msg.question('attention', records + '是否确定删除？', function (btn, text) {
                if (btn == 'yes') {
                    DpInspection.DeleteInspection(inspection_ids, user_id, function (result) {
                        if (result.success) {
                            My.Msg.warning('删除成功！');
                        } else {
                            My.Msg.warning('删除失败！');
                        }
                        cq.query('inspection-maingrid')[0].store.reload();
                    });
                } else {

                }
            });
        }, function (form, action) {
            Ext.Msg.alert('Error', action.result.errorMessage);
        });
},

onChangeLocation: function () {
    var me = this,
        win = me.buildUserValidationWindow({
            submit: SystemAdmin.UserValidation
        }, function (form, action) {
            win.close();
            var inspectionIds = me.getInspectionIds(me.activeRecords);
            Ext.create('QDT.view.inspection.ChangeLocation', {
                selected_inspections: inspectionIds,
                change_by: action.result.data.user_id,
                change_by_name: action.result.data['name_' + Profile.getLang()] + '(' + action.result.data.sso + ')'
            }).show();
        }, function (form, action) {
            Ext.Msg.alert('Error', action.result.errorMessage);
        });
},

onEditInspection: function () {
    var me = this,
        win = me.buildUserValidationWindow({
            submit: SystemAdmin.UserValidation
        }, function (form, action) {
            win.close();
            var inspectionIds = me.getInspectionIds(me.activeRecords);
            var serials = me.getSerials(me.activeRecords);
            Ext.create('QDT.view.inspection.InspectionEditor', {
                selected_inspections: inspectionIds,
                selected_serials: serials,
                edit_by: action.result.data.user_id,
                edit_by_name: action.result.data['name_' + Profile.getLang()] + '(' + action.result.data.sso + ')'
            }).show();
        }, function (form, action) {
            Ext.Msg.alert('Error', action.result.errorMessage);
        });
},

onAddComment: function () {
    var me = this,
        win = me.buildUserValidationWindow({
            submit: SystemAdmin.UserValidation
        }, function (form, action) {
            win.close();
            var inspectionIds = me.getInspectionIds(me.activeRecords);
            Ext.create('QDT.view.inspection.Comment', {
                selected_inspections: inspectionIds,
                add_by: action.result.data.user_id,
                add_by_name: action.result.data['name_' + Profile.getLang()] + '(' + action.result.data.sso + ')'
            }).show();
        }, function (form, action) {
            My.Msg.alert('Error', action.result.errorMessage);
        });
},

onPrioritize: function () {
    var me = this,
        win = me.buildUserValidationWindow({
            submit: SystemAdmin.UserValidation
        }, function (form, action) {
            win.close();
            var inspection_ids = me.getInspectionIds(me.activeRecords);
            Ext.create('QDT.view.inspection.Prioritize', {
                selected_inspections: inspection_ids,
                prioritize_by: action.result.data.user_id,
                prioritize_by_name: action.result.data['name_' + Profile.getLang()] + '(' + action.result.data.sso + ')'
            }).show();
        }, function (form, action) {
            My.Msg.alert('Error', action.result.errorMessage);
        });
},

onSetAndon: function () {
    var me = this,
        win = me.buildUserValidationWindow({
            submit: SystemAdmin.UserValidation
        }, function (form, action) {
            win.close();
            var inspection_ids = me.getInspectionIds(me.activeRecords);
            Ext.create('QDT.view.inspection.Andon', {
                selected_inspections: inspection_ids,
                set_andon_by: action.result.data.user_id,
                set_andon_by_name: action.result.data['name_' + Profile.getLang()] + '(' + action.result.data.sso + ')'
            }).show();
        }, function (form, action) {
            My.Msg.alert('Error', action.result.errorMessage);
        });
},

openScanSystem: function () {
    var me = this,
            records = [];
    Ext.Array.each(me.activeRecords, function (activeRecord) {
        if (activeRecord.data.start_time == null) {  //已经开始的检验项，不能再次扫描，直接过滤掉
            records.push(Ext.create('QDT.model.scan.CurrentWork', {
                inspection_id: activeRecord.data.id,
                item: activeRecord.data.item,
                serial: activeRecord.data.serial,
                job: activeRecord.data.wo,
                suffix: activeRecord.data.suffix,
                oper_num: activeRecord.data.oper_num,
                project: activeRecord.data.project,
                project_id: activeRecord.data.project_id,
                quantity: activeRecord.data.quantity,
                original_oper_num: activeRecord.data.oper_num
            }));
        }

    });
    Ext.create('QDT.view.scan.InspectorScan', {
        newInspectionScanRecords: records
    }).show();
}

});


