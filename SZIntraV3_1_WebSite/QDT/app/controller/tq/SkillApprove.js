Ext.define('Kanban.controller.SkillApprove', {
    extend: 'Ext.app.Controller',
    stores: [],
    views: ['SkillApproveGrid'],

    init: function () {
        var me = this;


        me.control({
            'skillapprovegrid': {
                afterrender: function () {

                    var cmp = cq.query('skillapprovegrid')[0];

                    cmp.store.load();
                },
                itemclick: function (t, r, item, i) {
                    var cmp = cq.query('#skillapprovemodule gridpanel')[1];
                    cmp.store.load({ params: { applyid: r.data.applyid} });
                }
            }
        });
    }
});