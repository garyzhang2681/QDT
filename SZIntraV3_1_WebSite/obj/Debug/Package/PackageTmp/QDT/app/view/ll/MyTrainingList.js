Ext.define('QDT.view.ll.MyTrainingList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.ll-mytraininglist',

    initComponent: function () {
        var me = this;



        var myTrainingStore = Ext.create('QDT.store.ll.Trainings', {
            listeners: {
                datachanged: function () {
                    me.getSelectionModel().deselectAll();
                }
            }
        });

        Ext.apply(myTrainingStore.proxy.extraParams, {
            isAll:false
        });



        Ext.applyIf(me, {
            title: Profile.getText('Training'),
            store: myTrainingStore,

            columns: [{
                dataIndex: 'request_id', text: 'request id', width: 30, hidden: true
            }, {
                dataIndex: 'lesson_id', text: 'lesson_id', width: 30, hidden: true
            }, {
                dataIndex: 'employee_id', text: Profile.getText('trainee'), width: 80, renderer: QDT.util.Renderer.employeeName
            }, {
                dataIndex: 'subject', text: Profile.getText('subject'), flex: 1, minWidth: 100, renderer: QDT.util.Renderer.ellipsis(25, false)
            }, {
                dataIndex: 'detail', text: Profile.getText('detail'), flex: 2, minWidth: 200, renderer: QDT.util.Renderer.ellipsis(50, false)
            }, {
                dataIndex: 'business', text: Profile.getText('business'), width: 100
            }, {
                dataIndex: 'start_time', text: Profile.getText('create_date'), width: 90, renderer: QDT.util.Renderer.dateTimeRenderer
            }, {
                dataIndex: 'due_date', text: Profile.getText('due_date'), width: 90, renderer: QDT.util.Renderer.dateRenderer
            }, {
                dataIndex: 'requestor', text: Profile.getText('create_by'), width: 80, renderer: QDT.util.Renderer.username
            }, {
                dataIndex: 'status', text: Profile.getText('status'), width: 100
            }, {
                dataIndex: 'current_step', text: Profile.getText('current_step'), width: 150,hidden:true
            }, {
                dataIndex: 'current_step_name', text: Profile.getText('current_step'), width: 150
            }, {
                dataIndex: 'current_approvers', text: Profile.getText('Approver'), width: 100, renderer: QDT.util.Renderer.usernames
            }]
        });

        me.callParent();

        me.on({
            afterrender: me.onAfterRender
        });
    },
    onAfterRender: function () {
        this.getStore().load();
    }
});