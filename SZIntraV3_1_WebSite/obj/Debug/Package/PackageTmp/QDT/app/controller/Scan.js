Ext.define('QDT.controller.Scan', {
    extend: 'Ext.app.Controller',

    views: [

         'scan.MyCurrentWork'
    ],
    stores: [
        'QDT.store.scan.ScanHistory'

    ],

    refs: [{
        ref: 'scanMain',
        selector: 'scan_main'
    }, {
        ref: 'tabContainer',
        selector: 'scan_main #tab-container'
    }, {
        ref: 'myCurrentWork',
        selector: 'scan-mycurrentwork'
    }],

    clearForm: function (button, e, eOpts) {
        button.up('form').getForm().reset();
    },

    showItemScanWindow: function (button, e, eOpts) {
        Ext.create('QDT.view.scan.Item').show();

    },

    ShowLearnWindow: function (button, e, eOpts) {
        Ext.create('QDT.view.scan.Learn').show();
    },

    EmployeeCheckIn: function (textfield, e, eOpts) {
        var me = this,
            localId = textfield.getValue();
        if (localId.length === 5) {
            DpScan.EmployeeCheckIn(localId, function (result) {
                if (result.success) {
                    textfield.up('form').down('#name').setValue(result.data.name);
                    textfield.up('form').down('#employee_id').setValue(result.data.employee_id);
                    textfield.up('form').down('#is_in_shift').setValue(result.data.is_in_shift);
                    var tabContainer = me.getTabContainer(),
                    myWorkPanel = tabContainer.getComponent('my-work');
                    tabContainer.setActiveTab(myWorkPanel);
                    myWorkPanel.store.load();
                } else {
                    My.Msg.warning(result.errorMessage);
                }
            });
        }
    },

    GetMachine: function (textfield, e, eOpts) {
        var machineNumber = textfield.getValue();
        DpScan.GetMachine(machineNumber, function (result) {
            if (result.success) {
                textfield.up('form').down('#machine_type').setValue(result.data.machine_type);
            } else {
                My.Msg.warning(result.errorMessage);
            }
        });

    },

    onJobOrderChange: function () {
        var me = this,
            form = me.getScanMain().down('form'),
            job = form.getValues().job,
            suffix = form.getValues().suffix;
        DpScan.GetJobOrder(job, suffix, function (result) {
            if (result.success) {
                var jobOrder = result.data;
                if (jobOrder.status === "R") {
                    form.getForm().setValues({
                        item: jobOrder.item,
                        qty: jobOrder.qty_released
                    });
                    form.down('[name=oper_num]').reset();
                } else {
                    My.Msg.warning('Job order status is not Released');
                }
            } else {
                My.Msg.warning(result.errorMessage);
            }

        });
    },

    reloadScanHistory: function () {
        var me = this;
        me.getTabContainer().getComponent('scan-history').store.load();
    },

    onMyWorkActivated: function () {
        var me = this,
            employeeId = me.getScanMain().down('[name=employee_id]').getValue();
        if (employeeId.length > 0) {
            me.getTabContainer().getComponent('my-work').store.load();
        }
    },

    init: function (application) {
        var me = this;
        me.control({
            "scan_main form #reset": {
                click: me.clearForm
            },
            "scan_main form #item": {
                click: me.showItemScanWindow
            },
            "scan_main #learn": {
                click: me.ShowLearnWindow
            },
            "scan_main form #local_id": {
                blur: me.EmployeeCheckIn
            },
            "scan_main form #machine_number": {
                blur: me.GetMachine
            },
            "scan_main form #job": {
                blur: me.onJobOrderChange
            },
            "scan_main form #suffix": {
                blur: me.onJobOrderChange
            },

            'scan_main #my-work': {
                activate: me.onMyWorkActivated
            },

            'scan-mycurrentwork': {
                selectionchange: function (selModel, selected) {
                    me.getMyCurrentWork().down('#end-selected-work').setDisabled(selected.length === 0);
                }
            }
        });
    }

});
