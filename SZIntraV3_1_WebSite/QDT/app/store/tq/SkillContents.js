Ext.define('Kanban.store.SkillContents', {
    extend: 'Ext.data.Store',
    fields: ['id', 'type', 'content', 'importance'],
    autoLoad: false,
    remoteSort: false,
    proxy: {
        type: 'direct',
        directFn: KanBan.SkillContent,
        paramOrder: ['item', 'op'],
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