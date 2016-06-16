Ext.define('Kanban.controller.SkillOperation', {
    extend: 'Ext.app.Controller',
    stores: ['CurrentOperations', 'SkillOperations'],
    views: ['CurrentOperation', 'SkillOperation'],

    init: function () {
        var me = this;

        me.control({
            'currentoperation searchcombo': {
                select: function (combo, records) {
                    me.getSkillOperationsStore().load({
                        params: { item: records[0].data.text }
                    });
                }
            }
        });
    }
});