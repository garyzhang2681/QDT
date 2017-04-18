Ext.define('QDT.view.tq.SkillTrainingApproverEditor', {
    extend: 'Ext.window.Window',
    alias: 'widget.tq-skilltrainingapprovereditor',
    requires: [
        'QDT.view.tq.SkillTrainingApproverGrid',
        'QDT.store.tq.SkillTrainingRoutes'
    ],
    skillCodeId: null,
    requestId: null,
    certifyMode: null,

    initComponent: function () {
        var me = this,
            gridStore = Ext.create('QDT.store.tq.SkillTrainingRoutes'),
            grid = Ext.widget('tq-skilltrainingapprovergrid', {
                store: gridStore,
                skillCodeId: me.skillCodeId,
                requestId: me.requestId
            });

        Ext.apply(me, {
            autoShow: true,
            layout: 'fit',
            modal: true,
            width: 480,
            items: [grid],
            buttons: [{
                iconCls: 'submit',
                text: Profile.getText('Submit'),
                itemId: 'submit'
            }, {
                iconCls: 'cancel',
                text: Profile.getText('Cancel'),
                itemId: 'cancel'
            }]
        });

        me.callParent();

        gridStore.mon(gridStore, {
            destroyable: true,
            beforeload: function () {
                Ext.apply(gridStore.proxy.extraParams, {
                    requestId: grid.requestId
                });
            }
        });
    }
});