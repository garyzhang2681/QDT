Ext.define('QDT.store.tq.OperationSkills', {
    extend: 'Ext.data.Store',
    model:'QDT.model.tq.OperationSkill',
    groupField: 'item',
    proxy: {
        type: 'direct',
        directFn: 'DpTq.GetOperationSkills',
        simpleSortMode: true,
        reader: {
            root: 'data',
            totalProperty: 'total'
        }
    }
});