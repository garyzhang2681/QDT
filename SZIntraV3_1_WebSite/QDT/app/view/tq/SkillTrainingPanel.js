Ext.define('QDT.view.tq.SkillTrainingPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tq-skilltrainingpanel',
    requires: [
        'QDT.view.tq.SkillTrainingGrid',
        'QDT.view.tq.WorkflowProcessGrid',
        'QDT.view.tq.ProcessScanRecordGrid',
        'QDT.view.tq.WorkflowActionGrid',
        'QDT.view.tq.CreateSkillTrainingWindow'
    ],

    initComponent: function () {
        var me = this,
            skillTrainingStore = Ext.create('QDT.store.tq.SkillTrainings'),
            skillTrainingGrid = Ext.widget('tq-skilltraininggrid', {
                flex: 2,
                minHeight: 180,
                store: skillTrainingStore,
                tbar: [{
                    iconCls: 'add_green',
                    itemId: 'add',
                    text: Profile.getText('add')
                }, {
                    iconCls: 'edit',
                    itemId: 'edit',
                    text: Profile.getText('Edit'),
                    disabled: true,
                    hidden: me.hide()
                }, {
                    iconCls: 'cancel',
                    itemId: 'cancel',
                    text: Profile.getText('Cancel'),
                    disabled: true,
                     hidden: me.hide()
                 }, '->', {
                     xtype: 'button',
                     text: '显示全部',
                     itemId: 'show_finished_trainings',
                     name: 'show_finished_trainings',
                     hidden:true,
                    enableToggle: true  
                },{
                    xtype: 'searchfield',
                    emptyText: Profile.getText('Search'),
                    width: 200,
                    store: skillTrainingStore
                }],
                bbar: {
                    xtype: 'pagingtoolbar',
                    displayInfo: true,
                    store: skillTrainingStore
                }
            });

        Ext.apply(me, {
            border: false,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [skillTrainingGrid, {
                xtype: 'splitter'
            }, {
                flex: 1,
                collapsible: true,
                collapseDirection: 'bottom',
                animCollapse: false,
                header: false,
                xtype: 'panel',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'tq-workflowprocessgrid',
                    flex: 1
                }, {
                    xtype: 'splitter'
                }, {
                    xtype: 'tabpanel',
                    flex: 1,
                    tabPosition: 'bottom',
                    items: [{
                        title: Profile.getText('ScanRecords'),
                        xtype: 'tq-processscanrecordgrid'
                    }, {
                        title: Profile.getText('ProcessOperatingRecords'),
                        xtype: 'tq-workflowactiongrid'
                    }]
                }]
            }]
        });

        me.callParent();
    },
    hide: function () {
        var currentUserSso = Profile.getUserSso();
        if (currentUserSso == '212348763'
            || currentUserSso == '307006712'
            || currentUserSso == '307010290'
            || currentUserSso == '307006710'
            ) {
            return false;
        } else {
            return true;
        }
    }
});