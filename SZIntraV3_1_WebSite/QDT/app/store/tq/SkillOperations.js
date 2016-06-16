Ext.define('Kanban.store.SkillOperations', {
    extend: 'Ext.data.Store',
    remoteSort: false,
    fields: ['id', 'pn', 'op', 'active', 'business', 'npi', 'skill_type', 'mode'],
    proxy: {
        type: 'direct',
        directFn: KanBan.SkillOperation,
        paramOrder: ['item'],
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    listeners: {
        beforeload: function () {
        }
    }
});