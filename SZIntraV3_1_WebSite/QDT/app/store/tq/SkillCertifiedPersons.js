Ext.define('QDT.store.tq.SkillCertifiedPersons', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.tq.PersonCertifiedSkill',
    groupField: 'working_group',
    proxy: {
        type: 'direct',
        directFn: 'DpTq.GetSkillCertifiedPerson',
        paramOrder: [
            'item',
            'oper_num'
        ],
        reader: {
            root: 'data'
        }
    }
});