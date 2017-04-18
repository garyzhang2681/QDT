Ext.define('QDT.view.tq.TrainingPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.tq-trainingpanel',
    requires: [
        'QDT.view.tq.TrainingGrid'
    ],

    initComponent: function () {
        var me = this,
            grid = Ext.create('QDT.view.tq.TrainingGrid'),
            store = grid.getStore();

        me.tbar = [{
            iconCls: 'add',
            text: Profile.getText('Create'),
            handler: me.onCreateTraining
        }, {
            iconCls: 'remove',
            text: Profile.getText('Delete'),
            handler: me.onDeleteTraining
        }, {
            iconCls: 'cancel',
            text: Profile.getText('Cancel'),
            handler: me.onCancelTraining
        }, {
            iconCls: 'edit',
            text: Profile.getText('Edit'),
            handler: me.onEditTraining
        }, {
            iconCls: 'back',
            text: '回退到上一步骤'
        }, '-', {
            xtype: 'searchfield',
            store: store,
            width: 150,
            name: 'query',
            emptyText: Profile.getText('Search')
        }, '->', {
            xtype: 'tbtext',
            text: 'Employee Group Selector'
        }];

        me.callParent();
    },

    getGrid: function () {
        return this.down('[tq-traininggrid]');
    },

    onCreateTraining: function () {
        Ext.create('QDT.view.tq.CreateTrainingWindow');
    },

    onDeleteTraining: function () {
        var me = this,
            grid = me.getGrid(),
            records = grid.getSelectionModel().getSelection(),
            record = records.length > 0 ? records[0] : null;
        if (record) {
            //TODO
            console.log('delete record of ' + record.get('id'));
            //            Ext.Msg.confirm('', '是否确认删除选定的培训记录(相关的培训历史也将同时被删除)?', function (e) {
            //                if (e == 'yes') {
            //                    KanBan.DeleteSkillApply(rec.data.fileid, function (res) {
            //                        if (res.success) {
            //                            KanBan.util.msg('', '删除成功');
            //                            cmp.store.load();
            //                        }
            //                    });
            //                }
            //            });
        }
        else {
            //            KanBan.util.msg('', '请先选择要删除的培训条目');
        }
    },

    onEditTraining: function () {
//        Ext.create('QDT.view.tq.ApproverEditorWindow', {
//            requestId:
//        });
    }



});