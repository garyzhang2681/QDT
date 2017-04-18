Ext.define('QDT.controller.tq.ProcessApproval', {
    extend: 'Ext.app.Controller',
    views: [
        'QDT.view.tq.ProcessApprovalPanel',
        'QDT.view.tq.MyProcessApprovalGrid',
        'QDT.view.tq.ProcessScanRecordGrid',
        'QDT.view.tq.WorkflowActionGrid'
    ],

    refs: [{
        ref: 'workflowProcessGrid',
        selector: 'tq-processapprovalpanel tq-workflowprocessgrid'
    }, {
        ref: 'attachmentButton',
        selector: 'tq-processapprovalpanel tq-myprocessapprovalgrid #view-attachment'
    },
    {
        ref: 'attachmentButtonSingle',
        selector: 'tq-processapprovalpanel tq-myprocessapprovalgrid #view-attachment-single'
    },
    {
        ref: 'processScanRecordGrid',
        selector: 'tq-processapprovalpanel tq-processscanrecordgrid'
    }, {
        ref: 'workflowActionGrid',
        selector: 'tq-processapprovalpanel tq-workflowactiongrid'
    }],

    init: function () {
        var me = this;

        me.control({
            'tq-processapprovalpanel tq-myprocessapprovalgrid': {
                afterrender: function (cmp) {

                    cmp.store.load();

                },
                selectionchange: function (selModel, selected) {
                    var record,
                        grid = me.getWorkflowProcessGrid(),
                        btnAttachment = me.getAttachmentButton(),
                        btnAttachmentSingle = me.getAttachmentButtonSingle();


                    btnAttachment.setDisabled(selected.length === 0);
                    btnAttachmentSingle.setDisabled(selected.lenth === 0); 


                    if (selected.length == 1) {
                        record = selected[0];
                        grid.store.load({
                            params: {
                                request_id: record.data.request_id
                            }
                        });

                        var requstId = record.data.request_id;

                        var current_process_id = record.data.current_process_id;


                        btnAttachment.refNum = record.data.request_id;

                        btnAttachment.refreshText(record.data.attachment_quantity);
                        
                        var rowid = cq.query('tq-processapprovalpanel tq-myprocessapprovalgrid')[0].store.find('request_id', requstId);

                        cq.query('tq-processapprovalpanel tq-myprocessapprovalgrid #view-attachment-single')[rowid].refNum = current_process_id;

                      


                    } 
                    else {
                        grid.store.removeAll();
                    }
                }
            },

            'tq-processapprovalpanel tq-workflowprocessgrid': {
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
            }
        });
    }
})