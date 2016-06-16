//TODO

Ext.define('QDT.controller.tq.OperationSkill', {
    extend: 'Ext.app.Controller',
    stores: [
        'OperationSkills',
        'SkillPersonCounts',
        'SkillProcessPersons',
        'SkillCertifiedPersons'
    ],
    views: [
        'OperationSkillGrid',
        'SkillPersonCountGrid',
        'SkillProcessPersonGrid',
        'SkillCertifiedPersonGrid'
    ],
    refs: [{
        ref: 'partOpSkillGrid',
        selector: 'partopskillgrid'
    }, {
        ref: 'skillCodeGrid',
        selector: 'skillcodegrid'
    }, {
        ref: 'skillProcessPersonGrid',
        selector: 'skillprocesspersongrid'
    }, {
        ref: 'skillCertifyPersonGrid',
        selector: 'skillcertifypersongrid'
    }],

    init: function () {
        var me = this;
    
        me.control({
    
            '#opskillmodule partopskillgrid': {
                activate: function (grid) {

                    var cmp = Ext.getCmp('opskillmodule').getComponent('infortabpanel');
                    var a = cmp.getComponent('relatedpartop');
                    var b = cmp.getComponent('relatedskillcode');
                    a.setDisabled(true);
                    b.setDisabled(false);
                    var tab = Ext.getCmp('opskillmodule').getComponent('infortabpanel').getComponent('relatedskillcode');
                    var rec = grid.selModel.selected.first();
                    if (rec) {
                        var displayAll = me.getSkillCertifyPersonGrid().displayAll;
                        me.getSkillCertifyPersonStore().load({
                            params: { item: rec.data.item, op: rec.data.op, displayAll: displayAll }
                        });
                        me.getSkillProcessPersonStore().load({
                            params: { item: rec.data.item, op: rec.data.op }
                        });

                        tab.store.load({
                            params: { item: rec.data.item, op: rec.data.op }
                        });
                    }
                    else {
                        me.getSkillCertifyPersonStore().removeAll();
                        me.getSkillProcessPersonStore().removeAll();
                        tab.store.removeAll();
                    }
                },
                afterrender: function () {
                    me.getPartOpSkillsStore().load();
                },
                select: function (rm, rec, i) {
                    var displayAll = me.getSkillCertifyPersonGrid().displayAll;
                    me.getSkillCertifyPersonStore().load({
                        params: { item: rec.data.item, op: rec.data.op, displayAll: displayAll }
                    });
                    me.getSkillProcessPersonStore().load({
                        params: { item: rec.data.item, op: rec.data.op }
                    });
                    var tab = Ext.getCmp('opskillmodule').getComponent('infortabpanel').getComponent('relatedskillcode');
                    tab.store.load({
                        params: { item: rec.data.item, op: rec.data.op }
                    });
                }
            },
            '#opskillmodule skillcodegrid': {
                activate: function (grid) {

                    var cmp = Ext.getCmp('opskillmodule').getComponent('infortabpanel');
                    var a = cmp.getComponent('relatedpartop');
                    var b = cmp.getComponent('relatedskillcode');
                    a.setDisabled(false);
                    b.setDisabled(true);
                    var tab = Ext.getCmp('opskillmodule').getComponent('infortabpanel').getComponent('relatedpartop');

                    var rec = grid.selModel.selected.first();
                    if (rec) {
                        var displayAll = me.getSkillCertifyPersonGrid().displayAll;
                        me.getSkillCertifyPersonStore().load({
                            params: { item: rec.data.id, op: '', displayAll: displayAll }
                        });
                        me.getSkillProcessPersonStore().load({
                            params: { item: rec.data.id, op: '' }
                        });
                        tab.store.load({
                            params: { id: rec.data.id }
                        });
                    }
                    else {
                        me.getSkillCertifyPersonStore().removeAll();
                        me.getSkillProcessPersonStore().removeAll();
                        tab.store.removeAll();
                    }
                },
                afterrender: function () {
                    me.getSkillCodesStore().load();
                },
                select: function (rm, rec, i) {
                    var displayAll = me.getSkillCertifyPersonGrid().displayAll;
                    me.getSkillCertifyPersonStore().load({
                        params: { item: rec.data.id, op: '', displayAll: displayAll }
                    });
                    me.getSkillProcessPersonStore().load({
                        params: { item: rec.data.id, op: '' }
                    });
                    var tab = Ext.getCmp('opskillmodule').getComponent('infortabpanel').getComponent('relatedpartop');
                    tab.store.load({
                        params: { id: rec.data.id }
                    });
                }
            }
        });

    }
});