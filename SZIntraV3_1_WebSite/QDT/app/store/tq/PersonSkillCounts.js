Ext.define('QDT.store.tq.PersonSkillCounts', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.tq.PersonSkillCount',
    proxy: {
        type: 'direct',
        directFn: 'DpTq.GetPersonSkillCount',
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    }
});