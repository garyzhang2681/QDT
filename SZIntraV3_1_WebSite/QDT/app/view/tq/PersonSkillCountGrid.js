Ext.define('QDT.view.tq.PersonSkillCountGrid', {
    alias: 'widget.tq-personskillcountgrid',
    extend: 'Ext.grid.Panel',
    requires: [
        'QDT.store.tq.PersonSkillCounts'
    ],
    activeRecord: {},

    initComponent: function () {
        var me = this,
            store = Ext.create('QDT.store.tq.PersonSkillCounts');


        Ext.apply(me, {
            store: store,
            columns: [{
                dataIndex: 'employee_id', text: Profile.getText('local_id'), minWidth: 80, renderer: QDT.util.Renderer.localId
            }, {
                dataIndex: 'employee_id', text: Profile.getText('employee_name'), minWidth: 80, renderer: QDT.util.Renderer.employeeName
            }, {
                dataIndex: 'certified', text: Profile.getText('certified'), flex: 1
            }, {
                dataIndex: 'training_in_process', text: Profile.getText('training_in_process'), flex: 1
            }],
            tbar: [{
                xtype: 'workinggroupcombo',
                queryParam: 'working_group_id',
                name: 'working_group_id',
                emptyText: Profile.getText('SelectWorkGroup'),
                listeners: {
                    select: function () {

                        DpTq.GetGroupSkillCount(this.value, function(result) {
                            if (result.success) {
                                me.store.loadRawData(result.data);

                            } else {

                                My.Msg.warning(result.errorMessage);
                            }
                        });


                        //TODO: note 如果'QDT.store.tq.GroupSkillCounts'中配置autoDestroy为true，则不知道为什么下面的代码没用。 
//                        var groupStore = Ext.create('QDT.store.tq.GroupSkillCounts');
//                        groupStore.getProxy().extraParams.working_group_id = this.value;
//                        groupStore.load();
//                        me.reconfigure(groupStore);


//TODO: note 不知道为什么下面的代码没用
                        //                        var groupStore = Ext.create('QDT.store.tq.GroupSkillCounts');
                        //                        me.store = groupStore;
                        //                        me.store.getProxy().extraParams.working_group_id = this.value;
                        //                        me.store.reload();
                        //                        me.reconfigure();
                    }
                }
            }, '->', {
                xtype: 'searchfield',
                name: 'query',
                store: store,
                emptyText: Profile.getText('SearchEmployee'),
                width: 120
            }],
            bbar: {
                xtype: 'pagingtoolbar',
                store: store,
                displayInfo: true
            }
        });

        me.callParent();
    }
});