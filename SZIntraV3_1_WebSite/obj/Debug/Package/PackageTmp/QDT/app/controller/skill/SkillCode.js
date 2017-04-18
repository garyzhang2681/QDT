Ext.define('QDT.controller.skill.SkillCode', {
    extend: 'Ext.app.Controller',
    stores: [
        'QDT.store.skill.RelatedOperations',
        'QDT.store.skill.SkillCodes'
    ],
    views: [
        'QDT.view.skill.SkillCodePanel',
        'QDT.view.skill.SkillCodeGrid',
        'QDT.view.skill.RelatedOperationGrid',
        'QDT.view.skill.SkillCodeEditor',
        'QDT.view.skill.ScanTransactionGrid'
    ],

    refs: [{
        ref: 'skillCodeGrid',
        selector: 'skill-skillcodepanel skill-skillcodegrid'
    }, {
        ref: 'relatedOperationGrid',
        selector: 'skill-skillcodepanel skill-relatedoperationgrid'
    }, {
        ref: 'certifiedGrid',
        selector: 'skill-skillcodepanel tq-certificationbasegrid'
    }, {
        ref: 'trainingGrid',
        selector: 'skill-skillcodepanel tq-skilltraininggrid'
    }, {
        ref: 'scanTransactionGrid',
        selector: 'skill-scantransactiongrid'
    }, {
        ref: 'scanTransactionSearchForm',
        selector: 'skill-scantransactiongrid #search_scan_transaction'
    }, {
        ref: 'skillCodeEditor',
        selector: 'skill-skillcodeeditor'
    }],

    init: function () {
        var me = this;
        me.control({

            'skill-skillcodeeditor #work_type': {
                select: function (cmp, records) {
                    if (records[0].data.work_type != 'run') {
                        cq.query('skill-skillcodeeditor #business')[0].clearValue();
                        cq.query('skill-skillcodeeditor #business')[0].hide();
                        cq.query('skill-skillcodeeditor #business')[0].disable();
                    } else {
                        cq.query('skill-skillcodeeditor #business')[0].show();
                        cq.query('skill-skillcodeeditor #business')[0].enable();
                    }
                }
            },
            'skill-skillcodeeditor #is_special_skill': {
                change: function (cmp, newValue, oldValue) {
                    if (newValue == true) {
                        cq.query('skill-skillcodeeditor #effective_time')[0].clearValue();
                        cq.query('skill-skillcodeeditor #effective_time')[0].hide();
                        cq.query('skill-skillcodeeditor #effective_time_day')[0].hide();

                    } else if (newValue == false) {
                        cq.query('skill-skillcodeeditor #effective_time')[0].show();
                        cq.query('skill-skillcodeeditor #effective_time')[0].setValue(180);
                        cq.query('skill-skillcodeeditor #effective_time_day')[0].show();
                    }
                }
            },
            'skill-scantransactiongrid #search': {
                click: me.searchScanTransaction
            },
            'skill-scantransactiongrid #clear': {
                click: me.onClickClearFilter

            },
            'skill-skillcodepanel skill-skillcodegrid': {
                afterrender: function (cmp) {

                    var grid = me.getSkillCodeGrid(),
                        store = grid.store;
                    store.mon(store, {
                        destroyable: true,
                        beforeload: function () {
                            store.proxy.extraParams.business = grid.down('[name=business]').getValue();
                        },
                        datachanged: function () {

                        }
                    });
                    store.load();
                },
                selectionchange: function (selModel, selected) {

                    var grid = me.getSkillCodeGrid(),
                        operationStore = me.getRelatedOperationGrid().store,
                        certifiedStore = me.getCertifiedGrid().store,
                        trainingStore = me.getTrainingGrid().store,
                        record;
                 
                    if (selected.length > 0) {
                        record = selected[0];
                        me.getRelatedOperationGrid().skill_code_id = record.data.id;
                        grid.activeRecord = record;
                        operationStore.load({
                            params: {
                                skill_code_id: record.data.id
                            }
                        });
                        certifiedStore.load();
                        trainingStore.load();
                    } else {
                        operationStore.removeAll();
                        certifiedStore.removeAll();
                        trainingStore.removeAll();
                    }
                    grid.down('#edit').setDisabled(selected.length === 0);
                    grid.down('#delete').setDisabled(selected.length === 0);

                }
            },

            'skill-skillcodepanel skill-skillcodegrid businesscombo': {
                select: function () {
                    me.getSkillCodeGrid().store.loadPage(1);
                }
            },

            'skill-skillcodepanel skill-relatedoperationgrid': {
                selectionchange: function (selModel, selected) {
                    var me = this,
                        operationGrid = me.getRelatedOperationGrid();
                    operationGrid.down('#delete').setDisabled(selected.length === 0);
                },
                afterrender: function (cmp) {
                    var store = cmp.store;
                    store.mon(store, {
                        destroyable: true,
                        beforeload: function () {
                            Ext.apply(store.proxy.extraParams, {
                                skill_code_id: cmp.skill_code_id
                            });
                        }
                    });
                }
            },

            'skill-skillcodepanel skill-relatedoperationgrid #delete': {
                click: function (btn) {
                    var me = this,
                        operationGrid = me.getRelatedOperationGrid(),
                        operationIds = [];
                    Ext.Msg.confirm(Profile.getText('Confirm'), Profile.getText('txtConfirmDelete'), function (btn) {
                        if (btn === 'yes') {
                            Ext.Array.each(operationGrid.getSelectionModel().getSelection(), function (operation) {
                                operationIds.push(operation.data.id);
                            });
                            DpSkill.RemoveRelatedOperations(operationGrid.skill_code_id, operationIds, function (result) {
                                if (result.success) {
                                    Ext.Msg.alert(Profile.getText('Success'), Profile.getText('txtRelatedOperationRemoved'));
                                    operationGrid.store.load();
                                } else {
                                    Ext.Msg.alert(Profile.getText('Error'), result.errorMessage);
                                }
                            });
                        }
                    });

                }
            },

            'skill-skillcodepanel tq-certificationbasegrid': {
                afterrender: function (cmp) {
                    var store = cmp.store;
                    store.mon(store, {
                        destroyable: true,
                        beforeload: function () {
                            Ext.apply(store.proxy.extraParams, {
                                filter_status: cmp.down('[name=filter_status]').getValue(),
                                status: cmp.down('[name=status]').getValue(),
                                working_group_id: null,
                                certification_item_id: me.getSkillCodeId()
                            });
                        }
                    });
                }
            },

            'skill-skillcodepanel tq-skilltraininggrid': {
                afterrender: function (cmp) {
                    var store = cmp.store;
                    store.mon(store, {
                        destroyable: true,
                        beforeload: function () {
                            Ext.apply(store.proxy.extraParams, {
                                skill_code_id: me.getSkillCodeId()
                            });
                        }
                    });
                }
            }
        });
    },

    getSkillCodeId: function () {
        var me = this,
            grid = me.getSkillCodeGrid(),
            record = grid.activeRecord,
            skillCodeId = 0;
        if (!Ext.Object.equals(record, {})) {
            skillCodeId = record.data.id;
        };
        return skillCodeId;
    },

    onClickClearFilter: function () {
        var me = this;
        var scanTransactionForm = me.getScanTransactionSearchForm();
        scanTransactionForm.getForm().reset();
    },
    searchScanTransaction: function () {
        var me = this;
        var scanTransactionGrid = me.getScanTransactionGrid();

        scanTransactionGrid.store.load({
            // waitMsg: '正在加载数据请稍后',
            params: {
                search_conditions: me.getScanTransactionSearchForm().getValues()
            },
            callback: function (records, operation, success) {
                if (!success) {
                    My.Msg.warning('查询不到相关记录，如有相关疑问，请联系IT!');
                }
            }
        });
    }



})