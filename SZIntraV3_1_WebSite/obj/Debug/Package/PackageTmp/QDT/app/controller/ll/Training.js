Ext.define('QDT.controller.ll.Training', {
    extend: 'Ext.app.Controller',
    views: [
        'QDT.view.ll.MyTrainingList',
         'QDT.view.ll.TrainingList',
        'QDT.view.ll.Training'
    ],
    stores: [
        'QDT.store.ll.Trainings'
    ],

    refs: [{
        ref: 'trainingList',
        selector: 'll-traininglist'
    }, {
        ref: 'myTrainingList',
        selector: 'll-mytraininglist'
    }, {
        ref: 'training',
        selector: 'll-training'
    }],

    init: function () {
        var me = this;
        me.control({
            'll-mytraininglist': {
                itemdblclick: me.onDblClickTraining
            },
            'll-traininglist #search': {
                click: me.searchLlTrainingList
            },
            'll-traininglist #clear': {
                click: me.onClickClearFilter
            }
        });

    },

    onClickClearFilter: function () {
        var me = this;
        var trainingList = me.getTrainingList();
        trainingList.down('#search_training').getForm().reset();
        me.searchLlTrainingList();
    },

    searchLlTrainingList: function () {

        var me = this;
        var llTrainingList = me.getTrainingList();

        llTrainingList.store.load({
           // waitMsg: '正在加载数据请稍后',
            params: {
                search_conditions: llTrainingList.down('#search_training').getForm().getValues()
            },
            callback:function(records, operation, success) {
                if (!success) {
                    My.Msg.warning('查询出错，请刷新页面重新操作，或者联系IT！');
                }
            }
        });

      

      
    },

    onDblClickTraining: function () {
        var me = this,
        record = me.getMyTrainingList().getSelectionModel().getSelection()[0];

        if (record.data.status === 'active') {
            Ext.create('QDT.view.ll.Training', {
                isApprover: false,
                record: record
            }).show();
            return;
        } else if (record.data.status === 'pending') {
            DpLl.CheckApprover(record.data.current_process_id, function (result) {
                if (result.success) {
                    Ext.create('QDT.view.ll.Training', {
                        isApprover: result.isApprover,
                        record: record
                    }).show();
                } else {
                    My.Msg.warning(result.errorMessage);
                }
            });
        }

    }
});