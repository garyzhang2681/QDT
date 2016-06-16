Ext.define('QDT.controller.tq.SkillTraining', {
    extend: 'Ext.app.Controller',
    stores: [
        'QDT.store.tq.SkillTrainings'
    ],
    views: [
        'QDT.view.tq.SkillTrainingPanel',
        'QDT.view.tq.WorkflowProcessGrid',
        'QDT.view.tq.ProcessScanRecordGrid',
        'QDT.view.tq.CreateSkillTrainingWindow',
        'QDT.view.tq.WorkflowActionGrid',
        'QDT.view.tq.ProcessApproverPicker',
        'QDT.view.tq.SkillTrainingApproverEditor'
    ],

    refs: [{
        ref: 'trainingGrid',
        selector: 'tq-skilltrainingpanel tq-skilltraininggrid'
    }, {
        ref: 'workflowProcessGrid',
        selector: 'tq-skilltrainingpanel tq-workflowprocessgrid'
    }, {
        ref: 'processScanRecordGrid',
        selector: 'tq-skilltrainingpanel tq-processscanrecordgrid'
    }, {
        ref: 'workflowActionGrid',
        selector: 'tq-skilltrainingpanel tq-workflowactiongrid'
    }, {
        ref: 'createSkillTrainingWindow',
        selector: 'tq-createskilltrainingwindow'
    }, {
        ref: 'trainingApproverGrid',
        selector: 'tq-createskilltrainingwindow tq-skilltrainingapprovergrid'
    }],

    init: function () {
        var me = this;

        me.control({
            'tq-skilltrainingpanel tq-skilltraininggrid': {
                afterrender: function (cmp) {
                    var store = cmp.store;
                    store.mon(store, {
                        destroyable: true,
                        beforeload: function () {
                            Ext.apply(store.proxy.extraParams, {
                                working_group_id: null
                            });
                        }
                    });
                    store.load();
                },
                selectionchange: function (selModel, selected) {
                    var record = {},
                        trainingGrid = me.getTrainingGrid(),
                        grid = me.getWorkflowProcessGrid();
                    if (selected.length > 0) {
                        record = selected[0];
                        grid.store.load({
                            params: {
                                request_id: record.data.request_id
                            }
                        });
                    } else {
                        grid.store.removeAll();
                    }


                    if (selected.length == 1) {

                        var rowid = cq.query('tq-skilltrainingpanel tq-skilltraininggrid')[0].store.find('request_id', selected[0].data.request_id);

                        cq.query('tq-skilltrainingpanel tq-skilltraininggrid #view-attachment')[rowid].refNum = selected[0].data.request_id;

                    }


                    trainingGrid.activeRecord = record;

                    var finished = (record.data.current_step_name == '培训完成');


                    trainingGrid.down('#cancel').setDisabled(finished || Ext.Object.equals(record, {}));
                    trainingGrid.down('#edit').setDisabled(finished || Ext.Object.equals(record, {}));
                }
            },

            'tq-skilltrainingpanel tq-skilltraininggrid #add': {
                click: function () {
                    Ext.widget('tq-createskilltrainingwindow');
//                    Ext.create('QDT.view.tq.CreateSkillTrainingWindow', {
//                        closeAction: 'destroy'
//                    }).show();
                }
            },

            'tq-skilltrainingpanel tq-skilltraininggrid #cancel': {
                click: function () {
                    var trainingGrid = me.getTrainingGrid(),
                        record = trainingGrid.activeRecord;
                    QDT.util.Util.prompt(Profile.getText('txtYouCanAttachAComment'), function (btn, text) {
                        if (btn === 'ok') {
                            DpTq.CancelTraining(record.data.request_id, text, function (result) {
                                QDT.util.Util.generalCallbackCRUD(result, 'd');
                                trainingGrid.store.reload(); // reload my skill trainging panel
                            });
                        }
                    });
                }
            },

            'tq-skilltrainingpanel tq-skilltraininggrid #edit': {
                click: function () {
                    var record = me.getTrainingGrid().activeRecord;
            
                    Ext.widget('tq-skilltrainingapprovereditor', {
                        requestId: record.data.request_id,
                        skillCodeId: record.data.certification_item_id,
                        certifyMode:record.data.certify_mode
                    });
                }
            },

            'tq-skilltrainingpanel #show_finished_trainings': {
                click:function() {
                    //TODO; show finished trainings or not
                }
            },

            'tq-skilltrainingpanel tq-workflowprocessgrid': {
                selectionchange: function (selModel, selected) {
                    var record,
                        grid1 = me.getProcessScanRecordGrid(),
                        grid2 = me.getWorkflowActionGrid();
                    if (selected.length > 0) {
                        record = selected[0];
                        grid1.store.load({
                            params: {
                                process_id: record.data.id
                            }
                        });
                        grid2.store.load({
                            params: {
                                action_target: 'process',
                                target_id: record.data.id
                            }
                        });
                    } else {
                        grid1.store.removeAll();
                        grid2.store.removeAll();
                    }
                }
            },




            'tq-skilltrainingapprovereditor tq-skilltrainingapprovergrid': {
                afterrender: function (cmp) {
                    cmp.store.load({
                        params: {
                            request_id: cmp.requestId
                        }
                    });
                }
            }
        });
    }
});