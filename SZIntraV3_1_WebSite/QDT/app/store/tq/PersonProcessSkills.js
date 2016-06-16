Ext.define('QDT.store.tq.PersonProcessSkills', {
    extend: 'Ext.data.Store',
    model:'QDT.model.tq.PersonProcessSkill',
    proxy: {
        type: 'direct',
        directFn: 'DpTq.GetPersonInProcessSkill',
        paramOrder: ['employee_id'],
        reader: {
            root: 'data'
        }
    }
});