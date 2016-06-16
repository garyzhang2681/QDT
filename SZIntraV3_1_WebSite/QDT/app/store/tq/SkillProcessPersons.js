Ext.define('QDT.store.SkillProcessPersons', {
    extend: 'Ext.data.Store',
    model:'QDT.model.tq.PersonProcessSkill',
    proxy: {
        type: 'direct',
        directFn: 'DpTq.GetSkillProcessPerson',
        paramOrder: ['id'],
        reader: {
            root: 'data'
        }
    }
});