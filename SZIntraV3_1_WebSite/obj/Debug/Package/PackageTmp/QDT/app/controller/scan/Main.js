Ext.define('QDT.controller.scan.Main', {
    extend: 'Ext.app.Controller',

    views: [
         'QDT.view.scan.MainPanel',
         'QDT.view.tq.ProcessScanWindow'
    ],
    refs: [{
        ref: 'trainingGrid',
        selector: 'scan-mainpanel tq-skilltraininggrid'
    }, {
        ref: 'scanToolbar',
        selector: 'scan-mainpanel toolbar[dock=top]'
    }, {
        ref: 'processScanRecordGrid',
        selector: 'scan-mainpanel tq-processscanrecordgrid'
    }],

    init: function (application) {
        var me = this;
        me.control({
            'scan-mainpanel': {
                afterrender: function (cmp) {

                }
            },

            'scan-mainpanel #check-in textfield[name=local_id]': {
                blur: function (field) {
                    me.onCheckIn();
                },
                specialkey: function (field, e) {
                    if (e.getKey() === e.ENTER) {
                        me.onCheckIn();
                    }
                }
            },

            'scan-mainpanel #check-out #btn-check-out': {
                click: function () {
                    me.onCheckOut();
                }
            },

            'scan-mainpanel tq-skilltraininggrid': {
                afterrender: function (cmp) {

                },
                selectionchange: function (selModel, selected) {

                    var grid = me.getTrainingGrid(),
                        button = grid.down('#scan'),
                        record,
                        store = me.getProcessScanRecordGrid().store;
                    button.setDisabled(true);
                    if (selected.length === 0) {
                        button.setDisabled(true);
                    }
                    //quality
                    if (selected[0].data.workflow_id == 7 && (selected[0].data.current_step == 1 || selected[0].data.current_step == 2 || selected[0].data.current_step == 3)) {
                        button.setDisabled(false);
                    }
                    //warehouse
                    if (selected[0].data.workflow_id == 11 && (selected[0].data.current_step == 1 || selected[0].data.current_step == 2 || selected[0].data.current_step == 3)) {
                        button.setDisabled(false);
                    }
                    //npi
                    if (selected[0].data.workflow_id == 12 && (selected[0].data.current_step == 1 || selected[0].data.current_step == 2 || selected[0].data.current_step == 3)) {
                        button.setDisabled(false);
                    }
                    //refreshmac
                    if (selected[0].data.workflow_id == 14 && (selected[0].data.current_step == 0 || selected[0].data.current_step == 1)) {
                        button.setDisabled(false);
                    }                    
                    //refreshact
                    if (selected[0].data.workflow_id == 15 && (selected[0].data.current_step == 0 || selected[0].data.current_step == 1)) {
                        button.setDisabled(false);
                    }
                    //refreshcom
                    if (selected[0].data.workflow_id == 16 && (selected[0].data.current_step == 0 || selected[0].data.current_step == 1)) {
                        button.setDisabled(false);
                    }
                    //machining
                    if (selected[0].data.workflow_id == 17 && (selected[0].data.current_step ==1 || selected[0].data.current_step == 2 || selected[0].data.current_step == 3 || selected[0].data.current_step == 4 || selected[0].data.current_step == 5)) {
                        button.setDisabled(false);
                    }
                    //actuation
                    if (selected[0].data.workflow_id == 18 && (selected[0].data.current_step == 1 || selected[0].data.current_step == 2 || selected[0].data.current_step == 3 || selected[0].data.current_step == 4 || selected[0].data.current_step == 5)) {
                        button.setDisabled(false);
                    }
                    //composite
                    if (selected[0].data.workflow_id == 19 && (selected[0].data.current_step == 1 || selected[0].data.current_step == 2 || selected[0].data.current_step == 3 || selected[0].data.current_step == 4 || selected[0].data.current_step == 5)) {
                        button.setDisabled(false);
                    }

                    //machining1
                    if (selected[0].data.workflow_id == 1 && (selected[0].data.current_step == 1 || selected[0].data.current_step == 2 || selected[0].data.current_step == 3 )) {
                        button.setDisabled(false);
                    }
                    //actuation1
                    if (selected[0].data.workflow_id == 2 && (selected[0].data.current_step == 1 || selected[0].data.current_step == 2 || selected[0].data.current_step == 3 )) {
                        button.setDisabled(false);
                    }
                    //composite1
                    if (selected[0].data.workflow_id == 3 && (selected[0].data.current_step == 1 || selected[0].data.current_step == 2 || selected[0].data.current_step == 3)) {
                        button.setDisabled(false);
                    }


                    console.log(selected[0].data);
                    if (selected.length > 0) {
                        grid.activeRecord = selected[0];
                        store.load();
                    } else {
                        store.removeAll();
                    }
                }
            },

            'scan-mainpanel tq-processscanrecordgrid': {
                afterrender: function (cmp) {
                    var store = cmp.store;
                    store.mon(store, {
                        destroyable: true,
                        beforeload: function () {
                            Ext.apply(store.proxy.extraParams, {
                                process_id: me.getTrainingGrid().activeRecord.data.current_process_id
                            });
                        }
                    });
                },
                selectionchange: function (selModel, selected) {

                    var grid = me.getProcessScanRecordGrid();
                    grid.activeRecord = selected[0] || {};


                    grid.down('#end-job').setDisabled(selected.length === 0 || grid.activeRecord.data.end_time);
                },
                beforerender: function () {

                    cq.query('scan-mainpanel tq-skilltraininggrid')[0].columns[9].setVisible(false);


                }
            },

            'scan-mainpanel tq-processscanrecordgrid #end-job': {
                click: function () {
                    var record = me.getProcessScanRecordGrid().activeRecord,
                        store = me.getProcessScanRecordGrid().store;

                    DpTq.EndProcessScan(record.data.id, function (result) {
                        if (result.success) {
                            store.load();
                        } else {
                            My.Msg.warning(result.errorMessage);
                        }
                    });
                }
            },

            'scan-mainpanel tq-skilltraininggrid #scan': {
                click: function () {
                    var grid = me.getTrainingGrid(),
                        scanner = Ext.widget('tq-processscanwindow');
                    scanner.down('#process').loadRecord(grid.activeRecord);
                }
            },

            'tq-processscanwindow': {
                close: function () {
                    me.getProcessScanRecordGrid().store.load();
                }
            }
        });
    },

    onCheckIn: function () {
        var me = this,
            tbar = me.getScanToolbar(),
            checkIn = tbar.down('#check-in'),
            checkOut = tbar.down('#check-out'),
            localId = tbar.down('[name=local_id]').getValue();

        if (localId.length === 5) {
            DpScan.EmployeeCheckIn(localId, function (result) {
                if (result.success) {
                    var employee = result.data,
                        name = 'N/A';
                    if (!employee.IsInShiftArrangement) {
                        My.Msg.warning('没有排班信息');
                    }
                    else if (employee.IsInBreakLunch) {
                        My.Msg.warning('休息时间');
                    }
                    else {
                        if (Profile.getLang() === 'en') {
                            name = result.data.NameEn;
                        } else {
                            name = result.data.NameCn;
                        }
                        checkIn.hide();
                        checkIn.down('[name=local_id]').reset();
                        checkOut.down('[name=employee_id]').setValue(employee.EmployeeId)
                        checkOut.down('#username').setText(name);
                        checkOut.show();
                        me.getTrainingGrid().store.load({
                            params: {
                                employee_id: employee.EmployeeId
                            }
                        });
                    }
                } else {
                    My.Msg.warning(result.errorMessage);
                }
            });
        }
    },

    onCheckOut: function () {
        var me = this,
            tbar = me.getScanToolbar(),
            checkIn = tbar.down('#check-in'),
            checkOut = tbar.down('#check-out');
        employeeId = checkOut.down('[name=employee_id]').getValue();
        DpScan.EmployeeCheckOut(employeeId, function (result) {
            checkIn.show();
            checkOut.hide();
            me.getTrainingGrid().store.removeAll();
        });
    }

});
