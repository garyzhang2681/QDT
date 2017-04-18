Ext.define('QDT.view.tq.ProcessScanRecordGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.tq-processscanrecordgrid',

    initComponent: function () {
        var me = this,
            store = Ext.create('QDT.store.tq.ProcessScanRecords');

        Ext.apply(me, {
            store: store,
            columns: [{
                dataIndex: 'employee_id', text: Profile.getText('employee_name'), width: 80, flex: 1, renderer: QDT.util.Renderer.employeeName
            }, {
                dataIndex: 'work_date', text: Profile.getText('work_date'), width: 80, renderer: QDT.util.Renderer.dateRenderer
            }, {
                dataIndex: 'start_time', text: Profile.getText('start_time'), width: 80, renderer: QDT.util.Renderer.dateTimeRenderer
            }, {
                dataIndex: 'end_time', text: Profile.getText('end_time'), width: 80, renderer: QDT.util.Renderer.dateTimeRenderer
            }, {
                dataIndex: 'work_time', text: Profile.getText('work_time'), width: 60
            }, {
                dataIndex: 'job', text: Profile.getText('job'), minWidth: 100, flex: 1
            }, {
                dataIndex: 'oper_num', text: Profile.getText('oper_num'), width: 60
            }]
        });
        me.callParent();
    }
});