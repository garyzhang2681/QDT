Ext.define('QDT.store.tq.SkillPersonCounts', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.tq.SkillPersonCount',
    groupField: 'skill_type',
    proxy: {
        type: 'direct',
        directFn: 'DpTq.GetSkillPersonCount',
        simpleSortMode: true,
        reader: {
            root: 'data',
            totalProperty: 'total'
        }
    }
});