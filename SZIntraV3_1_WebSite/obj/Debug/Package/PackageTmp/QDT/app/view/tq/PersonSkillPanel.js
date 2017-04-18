Ext.define('QDT.view.tq.PersonSkillPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tq-personskillpanel',
    requires: [
        'QDT.view.tq.PersonSkillCountGrid',
        'QDT.view.tq.CertificationBaseGrid',
        'QDT.view.tq.SkillTrainingGrid'
    ],

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            border: false,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'tq-personskillcountgrid',
                width: 380
            }, {
                xtype: 'splitter'
            }, {
                xtype: 'tabpanel',
                flex: 1,
                tabPosition: 'bottom',
                items: [{
                    xtype: 'tq-certificationbasegrid',
                    title: Profile.getText('certified'),
                    width: 550,
                    tbar: [{
                        xtype: 'checkbox',
                        name: 'filter_status',
                        disabled:true,
                        checked:true,
                        boxLabel: Profile.getText('FilterStatus')
                    }, {
                        xtype: 'tbtext',
                        text: ': '
                    }, {
                        xtype: 'tq-certificationstatuscombo',
                        hideLabel: true,
                        disabled: false
                    }]
                }, {
                    xtype: 'tq-skilltraininggrid',
                    store: Ext.create('QDT.store.tq.PersonSkillTrainings'),
                    title: Profile.getText('TrainingInProcess')
                }]
            }, {
                xtype: 'splitter',
                collapsible:true
            }, {
                xtype: 'tq-trainerattachmentlist'
            }]
        });


        me.callParent();
    }
});