Ext.define('QDT.controller.op.OperationManagement', {
    extend: 'Ext.app.Controller',
    views: [
        'QDT.view.op.ManagementPanel',
        'QDT.view.op.OperationGrid',
        'QDT.view.tq.OperationalRestrictionGrid',
        'QDT.view.tq.CertificationItemCombo',
        'QDT.view.tq.CertificationItemCascade'
    ],

    refs: [{
        ref: 'operationGrid',
        selector: 'op-managementpanel op-operationgrid'
    }, {
        ref: 'restrictionGrid',
        selector: 'op-managementpanel tq-operationalrestrictiongrid'
    }, {
        ref: 'addOperationalRestriction',
        selector: 'op-addoperationalrestriction'
    }],

    init: function () {
        var me = this;

        me.control({
            'op-managementpanel op-operationgrid': {
                afterrender: function (cmp) {
                    cmp.store.load();
                },
                selectionchange: function (selModel, selected) {
                    var operationGrid = me.getOperationGrid(),
                        restrictionGrid = me.getRestrictionGrid(),
                        restrictionStore = restrictionGrid.store;
                    operationGrid.activeRecords = selected;
                    workType = restrictionGrid.down('#work_type').getValue();
                    operationGrid.down('#add-restriction').setDisabled(selected.length === 0);
                    if (selected.length === 1) {
                        Ext.apply(restrictionStore.proxy.extraParams, {
                            work_type: workType
                        });
                        restrictionStore.load();
                    } else {
                        restrictionStore.removeAll();
                    }
                }
            },

            'op-managementpanel tq-operationalrestrictiongrid': {
                afterrender: function (cmp) {
                    var store = cmp.store;
                    store.mon(store, {
                        destroyable: true,
                        beforeload: function () {
                            var record = me.getOperationGrid().activeRecords[0];
                            Ext.apply(store.proxy.extraParams, {
                                item: record.data.item,
                                operation_id: record.data.id,
                                oper_num:record.data.oper_num
                            });
                        }
                    });
                },
                selectionchange: function (selModel, selected) {
                    var grid = me.getRestrictionGrid(),
                        btnDelete = grid.down('#delete');
                    btnDelete.setDisabled(selected.length === 0);
                    grid.activeRecords = selected;
                }
            },


            'op-managementpanel op-operationgrid #add-restriction': {
                click: function (item) {
                    var operationGrid = me.getOperationGrid();

                    var addRestrictionWindow = Ext.create('QDT.view.op.AddOperationalRestriction', {
                        activeRecords: operationGrid.activeRecords
                    });
                    addRestrictionWindow.show();
                }
            },


            'op-managementpanel tq-operationalrestrictiongrid #delete': {
                click: function () {
                    var grid = me.getRestrictionGrid(),
                        restrictions = [],
                        activeRecords = grid.activeRecords;
                    Ext.Array.each(activeRecords, function (record) {
                        restrictions.push(record.data.row_pointer);
                    });

                    Ext.Msg.confirm(Profile.getText('Confirm'), Profile.getText('txtConfirmDelete'), function (btn) {
                        if (btn === 'yes') {
                            DpTq.DeleteOperationalRestriction(restrictions, function (result) {
                                QDT.util.Util.generalCallbackCRUD(result, 'd');
                                grid.store.load();
                            });
                        }
                    });
                }
            },

            'op-addoperationalrestriction #submit': {
                click: function () {
                    console.log('xxx');
                    var restrictionGrid = me.getRestrictionGrid();
                    var addOperationalRestraction = me.getAddOperationalRestriction();
                    var operationIds = [];
                    var workType = addOperationalRestraction.down('#work_type').getValue();
                    var category = addOperationalRestraction.down('#category').getValue();
                    var certification_item_id = addOperationalRestraction.down('#certification_item_id').getValue();
                    Ext.Array.each(addOperationalRestraction.activeRecords, function (record) {
                        operationIds.push(record.data.id);
                    });

                    if (category != null && certification_item_id != null) {
                        DpTq.AddOperationalRestrictions(workType, category, certification_item_id, operationIds, function (result) {
                            if (result.success) {
                                QDT.util.Util.generalCallbackCRUD(result, 'c');
                                restrictionGrid.store.load();
                            } else {
                                My.Msg.warning(result.errorMessage);
                            }

                        });
                    } else {
                        My.Msg.warning('请选择认证项目！');
                    }

                }
            },

            'op-managementpanel tq-operationalrestrictiongrid #work_type': {
                select: function () {
                    //TODO: filter restriction

                    var restrictionGrid = me.getRestrictionGrid();
                    var restrictionStore = restrictionGrid.store;
                    var workType = restrictionGrid.down('#work_type').getValue();

                    Ext.apply(restrictionStore.proxy.extraParams, {
                        work_type: workType
                    });
                    restrictionStore.load();
                    //  DpTq.GetOperationalRestrictions()
                }

            }


        });
    }
});