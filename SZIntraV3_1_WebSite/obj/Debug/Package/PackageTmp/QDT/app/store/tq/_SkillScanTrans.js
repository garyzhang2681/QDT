Ext.define('Kanban.store.SkillScanTrans', {
    extend: 'Ext.data.Store',
    fields: ['applyid', 'emp_name','employeeid', 'status', 'job', 'item', 'serial', 'starttime', 'endtime', 'mins','row_spec'],
    pageSize: 50,
    autoLoad: false,
    remoteSort: false,

    sorters: [{
        property: 'starttime',
        direction: 'DESC'
    }],
    proxy: {
        type: 'direct',
        directFn: KanBan.SkillScanTrans,
        simpleSortMode: true,
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    },
    listeners: {
        beforeload: function () {
            var cmp = cq.query('skillscantransgrid')[0];
            this.getProxy().extraParams.applyid = cmp.down('[name=applyid]').getValue();

            this.getProxy().extraParams.employeeid = cmp.down('[name=employeeid]').getValue();
        }
    }
});