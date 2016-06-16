Ext.define('QDT.view.scan.MyCurrentWork', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.scan-mycurrentwork',
    selType: 'checkboxmodel',
    layout: 'fit',


    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            title: Profile.getText('MyCurrentWork'),
            hasActiveWork: false,
            isPunchOut: false,
            columns: [{
                dataIndex: 'scan_type',
                text: Profile.getText('type'),
                width: 60
            }, {
                xtype: 'checkcolumn',
                dataIndex:'passed',
                text:Profile.getText('passed'),
                width:30
            },{
                dataIndex: 'employee_name',
                text: Profile.getText('employee_name'),
                width: 90
            }, {
                dataIndex: 'machine_number',
                text: Profile.getText('machine_number'),
                width: 70
            }, {
                dataIndex: 'job',
                text: Profile.getText('job'),
                width: 80
            }, {
                dataIndex: 'suffix',
                text: Profile.getText('suffix'),
                width: 40
            }, {
                dataIndex: 'oper_num',
                text: Profile.getText('oper_num'),
                width: 60
            }, {
                dataIndex: 'start_time',
                text: Profile.getText('start_time'),
                renderer: Ext.util.Format.dateRenderer('h:i'),
                width: 60
            }, {
                dataIndex: 'end_time',
                text: Profile.getText('end_time'),
                renderer: Ext.util.Format.dateRenderer('h:i'),
                width: 60
            }, {
                dataIndex: 'secs',
                text: Profile.getText('WorkTime'),
                width: 60
            }, {
                dataIndex: 'qty_work_on',
                text: Profile.getText('quantity'),
                width: 60
            }],
            tbar: [{
                iconCls:'stop',
                text: Profile.getText('EndSelectedWork'),
                itemId: 'end-selected-work',
                handler: this.EndSelectedWork,
                scope: me,
                disabled: true
            }, '->', {
                text: Profile.getText('PunchOut'),
                handler: this.PunchOut,
                scope: me
            }]
        });

        me.callParent(arguments);
    },

    EndSelectedWork: function () {
        var me = this;
        //TODO: single or multi
        DpScan.EndTransaction(me.getSelectionModel().getSelection()[0].data.id, function (result) {
            if (result.success) {
                me.store.load();
            }
        });
    },

    PunchOut: function () {
        var me = this;

        Ext.Msg.confirm(
            Profile.getText('Confirm'),
            Profile.getText('cfmPunchOut'),
            function (btnId) {
           
                if (btnId === 'yes') {
                    //TODO: punch out
                    me.isPunchOut = true;
                }
            }
        );
    }
});