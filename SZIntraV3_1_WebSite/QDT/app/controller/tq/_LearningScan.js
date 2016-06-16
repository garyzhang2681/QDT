Ext.define('Kanban.controller.LearningScan', {
    extend: 'Ext.app.Controller',
    stores: ['SkillScanTrans'],
    views: ['LearningScanWin', 'SkillScanTransGrid', 'SkillProcessDataGrid'],

    init: function () {
        var me = this;
        me.control({
            'skillscantransgrid': {
                afterrender: function () {
                    me.getSkillScanTransStore().load();

                }
            }
        });
    }
});