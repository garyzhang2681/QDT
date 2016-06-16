Ext.define('Kanban.controller.TrainContent', {
    extend: 'Ext.app.Controller',
    stores: ['SkillCodes', 'PartOpSkills', 'SkillContents'],
    views: ['SkillCodeGrid', 'PartOpSkillGrid', 'SkillContentGrid'],
    refs: [],
    init: function () {
        var me = this;
        this.control({
            '#trainlistmodule partopskillgrid': {
                afterrender: function () {
                    me.getPartOpSkillsStore().load();
                },
                select: function (c, rec, i) {
                    var x = cq.query('#trainlistmodule panel[itemId=relatedskillcode]')[0];
                    //                    x.store.removeAll();
                    x.store.load({
                        params: { item: rec.data.item, op: rec.data.op }
                    });
                    var grid = cq.query('#trainlistmodule skillcontentgrid')[0];
                    grid.store.load({
                        params: { item: rec.data.item, op: rec.data.op }
                    });
                }
            }
            ,
            '#trainlistmodule skillcodegrid': {
                afterrender: function () {
                    me.getSkillCodesStore().load();
                },
                select: function (c, rec, i) {
                    var x = cq.query('#trainlistmodule panel[itemId=relatedskillcode]')[0];
                    //                    x.store.removeAll();
                    x.store.load({
                        params: { item: rec.data.id, op: '' }
                    });
                    var grid = cq.query('#trainlistmodule skillcontentgrid')[0];
                    grid.store.load({
                        params: { item: rec.data.id, op: '' }
                    });
                }
            }
            ,
            '#trainlistmodule panel[itemId=relatedskillcode]': {
                select: function (c, rec, i) {
                    var grid = cq.query('#trainlistmodule skillcontentgrid')[0];
                    grid.store.load({
                        params: { item: rec.data.id, op: '' }
                    });
                }
            }


        });
    }
});