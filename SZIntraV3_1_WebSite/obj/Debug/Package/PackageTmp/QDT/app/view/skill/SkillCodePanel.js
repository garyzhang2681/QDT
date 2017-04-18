Ext.define('QDT.view.skill.SkillCodePanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.skill-skillcodepanel',
    requires: [
        'QDT.view.skill.SkillCodeGrid',
        'QDT.view.skill.RelatedOperationPanel'
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
                xtype: 'skill-skillcodegrid',
                width: 480
            }, {
                xtype: 'splitter'
            }, {
                xtype: 'tabpanel',
                flex: 1,
                items: [{
                    xtype: 'tabpanel',
                    tabPosition: 'bottom',
                    title: Profile.getText('RelatedPerson'),
                    items: [{
                        xtype: 'tq-certificationbasegrid',
                        title: Profile.getText('certified'),
                        width: 750,
                        tbar: [{
                            xtype: 'checkbox',
                            name: 'filter_status',
                            boxLabel: Profile.getText('FilterStatus')
                        }, {
                            xtype: 'tbtext',
                            text: ': '
                        }, {
                            xtype: 'tq-certificationstatuscombo',
                            hideLabel: true,
                            disabled: true
                        }]
                    }, {
                        xtype: 'tq-skilltraininggrid',
                        store: Ext.create('QDT.store.tq.SkillCodeTrainings'),
                        title: Profile.getText('TrainingInProcess')
                    }]
                }, {
                    xtype: 'skill-relatedoperationpanel'
                }]
            }]
        });


        me.callParent();
    }
  
});