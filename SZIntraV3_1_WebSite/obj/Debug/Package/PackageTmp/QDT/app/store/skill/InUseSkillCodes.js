Ext.define('QDT.store.skill.InUseSkillCodes', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.skill.SkillCode',
    remoteSort: true,
    autoDestory: true,
    pageSize: 100,
    sorters: [{
        property: 'skill_code',
        direction: 'ASC'
    }],
    proxy: {
        type: 'direct',
        directFn: 'DpSkill.GetInUseSkillCodes',
        //params collection contains 'query' and 'business'
        simpleSortMode: true,
        reader: {
            root: 'data'
        }
    }
});