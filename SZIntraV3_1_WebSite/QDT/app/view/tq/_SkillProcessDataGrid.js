Ext.define('Kanban.view.SkillProcessDataGrid', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.skillprocessdatagrid',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    initComponent: function () {
        var me = this;

        var a = Ext.widget('gridpanel', {
            flex: 1,
            layout: 'fit',
            store: Ext.create('Ext.data.DirectStore', {
                fields: ['process', 'status', 'owner', 'starttime', 'endtime', 'applyid'],
                directFn: KanBan.ProcessOfSkillApply,
                paramOrder: ['applyid'],
                root: 'data'

            }),
            columns: [{
                dataIndex: 'process', text: '流程<br/>Process', flex: 1
            }, {
                dataIndex: 'status', text: '状态<br/>Status', flex: 1
            }, {
                dataIndex: 'owner', text: '批准人<br/>Owner', flex: 1
            }, {
                dataIndex: 'starttime', text: '开始<br/>Start', flex: 1, renderer: Ext.util.Format.dateRenderer('Y-m-d H:i')
            }, {
                dataIndex: 'endtime', text: '结束<br/>End', flex: 1, renderer: Ext.util.Format.dateRenderer('Y-m-d H:i')
            }]
        });

        var b = Ext.widget('gridpanel', {
            flex: 1,
            store: Ext.create('Ext.data.DirectStore', {
                fields: ['process', 'job', 'serial', 'mins', 'starttime', 'endtime', 'applyid'],
                directFn: KanBan.ScanOfSkillApply,
                paramOrder: ['applyid'],
                root: 'data'
            }),
            columns: [{
                dataIndex: 'process', text: '流程<br/>Process', flex: 1
            }, {
                dataIndex: 'job', text: '工卡<br/>Status', flex: 1
            }, {
                dataIndex: 'serial', text: '序列号<br/>SN', flex: 1
            }, {
                dataIndex: 'starttime', text: '开始<br/>Start', flex: 1, renderer: Ext.util.Format.dateRenderer('Y-m-d H:i')
            }, {
                dataIndex: 'endtime', text: '结束<br/>End', flex: 1, renderer: Ext.util.Format.dateRenderer('Y-m-d H:i')
            }, {
                dataIndex: 'mins', text: '持续时间<br/>Duration', flex: 1
            }]
        });

        me.items = [a, b];
        me.callParent();
    }
})