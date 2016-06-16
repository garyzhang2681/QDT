Ext.define('Kanban.controller.SkillApply', {
    extend: 'Ext.app.Controller',
    stores: ['ApplyLists'],
    views: ['ApplyList','SkillAuthorization'],
    refs: [{
        ref: 'applyList',
        selectore: 'applylist'
    }],
    init: function () {
        var me = this;
        me.control({
            'applylist': {
                afterrender: function () {
                    me.getApplyListsStore().load();
                },
                itemclick: function (t, r, item,i,e) {
                    var applyid = r.data.fileid;
                    var cmp = cq.query('skillprocessdatagrid')[0];
                    cmp.items.each(function (grid) {
                        grid.store.load({
                            params: { applyid: applyid }
                        });
                    });
                }
            }
        });
    }
});