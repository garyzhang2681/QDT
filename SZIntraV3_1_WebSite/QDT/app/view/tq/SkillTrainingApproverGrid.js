Ext.define('QDT.view.tq.SkillTrainingApproverGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.tq-skilltrainingapprovergrid',
    requires: [
        'QDT.view.tq.ProcessApproverPicker'
    ],
    skillCodeId: null,
    requestId: null,
    height: 200,
    initComponent: function () {
        var me = this;

        var selModel = new Ext.selection.CheckboxModel({
            mode: 'SINGLE',
            showHeaderCheckbox: false
        });



        Ext.apply(me, {
            activeRecords: [],
            singleSelect: true,
            //            selType: 'checkboxmodel',
            //            selModel: {
            //             //   model: 'SINGLE',
            //                showHeaderCheckbox: false

            //            },

            selModel: selModel,
            layout: 'fit',
            columns: [{
                dataIndex: 'name', minWidth: 150, flex: 1, text: Profile.getText('process_name'), block: true
            }, {
                dataIndex: 'status', renderer: QDT.util.Renderer.workflowProcessStatus, width: 80, text: Profile.getText('status'), block: true
            }, {
                dataIndex: 'approvers', renderer: QDT.util.Renderer.usernames, maxWidth: 100, minWidth: 80, text: Profile.getText('approvers'), block: true
            }, {
                dataIndex: 'allow_custom_approver', text: Profile.getText('allow_change'), renderer: QDT.util.Renderer.booleanIconRenderer, width: 60, block: true
            }],
            tbar: [{
                iconCls: 'add_green',
                text: Profile.getText('AddApprovers'),
                itemId: 'add-approvers',
                disabled: true
            }, {
                iconCls: 'delete',
                text: Profile.getText('DeleteApprovers'),
                itemId: 'delete-approvers',
                disabled: true
            }]
        });

        me.callParent();
    },

    getProcessApprovers: function () {
        var me = this,
            valid = true,
            approvers = [],
            store = me.store;
        store.each(function (record) {
            if (record.data.approvers.length === 0) {
                valid = false;
            } else {
                Ext.Array.each(record.data.approvers.split(',').filter(function (el) { return el.length !== 0 }), function (approverId) {
                    approvers.push({
                        step: record.data.step,
                        approver_id: approverId
                    });
                });
            }
            return valid;
        });
        if (!valid) {
            approvers = [];
            Ext.Msg.alert(Profile.getText('Error'), Profile.getText('txtApproverNotAssigned'));
        }
        return approvers;
    }
});