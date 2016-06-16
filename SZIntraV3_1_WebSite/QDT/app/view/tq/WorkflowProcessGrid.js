Ext.define('QDT.view.tq.WorkflowProcessGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.tq-workflowprocessgrid',
    requires: ['QDT.store.tq.WorkflowProcesses'],

    initComponent: function () {
        var me = this,
            store = Ext.create('QDT.store.tq.WorkflowProcesses');

        Ext.apply(me, {
            store: store,

            columns: [{
                dataIndex: 'name', text: Profile.getText('process_name'), minWidth: 150, flex: 1, block: true
            }, {
                dataIndex: 'status', text: Profile.getText('status'), renderer: QDT.util.Renderer.workflowProcessStatus, minWidth: 100, block: true
            }, {
                dataIndex: 'start_time', text: Profile.getText('start_time'), width: 80, renderer: QDT.util.Renderer.dateTimeRenderer, block: true
            }, {
                dataIndex: 'end_time', text: Profile.getText('end_time'), width: 80, renderer: QDT.util.Renderer.dateTimeRenderer, block: true
            }, {
                dataIndex: 'approvers', text: Profile.getText('approvers'), width: 80, renderer: QDT.util.Renderer.usernames, block: true
            }],

            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                margin: '0 0 5 0',
                layout: 'fit',
                items: [{
                    xtype: 'displayfield',
                    fieldLabel: '声明',
                    labelWidth: 40,
                    value: '培训师：我声明该培训生通过充分培训，已掌握了该技能所有相关的图纸，作业指导书，质量风险等，并能独立操作</br>培训生：我声明我通过充分培训已掌握了该技能所有相关的图纸，作业指导书，质量风险等，并能独立操作'
                }]
            }]
        });

        me.callParent();
    }
});


