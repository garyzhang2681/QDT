Ext.define('QDT.view.scan.InspectorScan', {
    extend: 'Ext.window.Window',
    alias: 'widget.scan-inspectorscan',
    width: 1000,
    y: 20,
    modal: true,
    border: false,
    newInspectionScanRecords: [],
    constrainHeader: true,
    bodyPadding: 8,
    initComponent: function () {

        var me = this,
            currentInspectionGrid,
            newInspectionStore,
            transactionTypeStore,
            newInspectionGrid;

        me.title = Profile.getText('ScanSystem');


        var locationEditor = Ext.widget('combobox', {
            name: 'inspection_location',
            emptyText: Profile.getText('inspection_location'),
            fieldLabel: '',
            store: Ext.create('QDT.store.inspection.InspectionLocations', {
                storeId: 'next_location_store'
            }).load({
                params: {
                    language: Profile.getLang(),
                    view_all: false
                }
            }),
            displayField: 'name',
            valueField: 'inspection_location_id',
            forceSelection: true,
            trigger2Cls: 'x-form-clear-trigger',
            onTrigger2Click: function () {
                this.reset();
            },
            listeners: {
                'change': function (me, newVal) {
                    if (newVal === null) {
                        me.reset();
                    }
                }
            }

        });


        currentInspectionGrid = Ext.widget('grid', {
            itemId: 'current-inspection-grid',
            minHeight: 150,
            maxHeight: 320,
            store: Ext.create('QDT.store.scan.CurrentWork', {
                listeners: {
                    load: function () {
                        var fieldset = currentInspectionGrid.up('fieldset'),
                            hasActiveWork = this.count() > 0;
                        if (!hasActiveWork) {
                            fieldset.collapse();
                        } else {
                            fieldset.expand();
                        }
                        me.enableButton("#punch-out", hasActiveWork);
                    },
                    beforeload: function () {
                        Ext.apply(this.getProxy().extraParams, {
                            employee_id: me.down('[name=employee_id]').getValue()
                        });
                    }
                }
            }),
            plugins: [{
                ptype: 'rowediting',
                clicksToEdit: 2,
                saveBtnText: Profile.getText('Save'),
                cancelBtnText: Profile.getText('Cancel'),
                listeners: {
                    validateedit: function (editor, context) {
                        var oldValues = context.originalValues,
                            newValues = context.newValues,
                            transactionType = oldValues.trans_tyep,
                            valid = true;
                        if (transactionType === 'indirect') {
                            valid = false;
                        } else if (newValues.qty_work_on > oldValues.quantity) {
                            Ext.Msg.alert(Profile.getText('Warning'), '工作数量不能大于作业总数量');
                            valid = false;
                        } else if (newValues.qty_complete > oldValues.quantity) {
                            Ext.Msg.alert(Profile.getText('Warning'), '完成数量不能大于作业总数量');
                            valid = false;
                        } else if (newValues.qty_complete > newValues.qty_work_on) {
                            Ext.Msg.alert(Profile.getText('Warning'), '完成数量不能大于工作数量');
                            valid = false;
                        }
                        return valid;
                    },
                    edit: function (editor, context) {

                        var nextLoaction = context.record.data.next_location;
                        if (context.record.data.batch_id === null) {
                            context.record.data.next_location = context.newValues.next_location;
                            context.record.commit();
                        } else {
                            My.Msg.question('提示', '是否批量改变送检位置？', function (btn, txt) {
                                if (btn == 'yes') {
                                    var batchRecords = context.grid.store.query('batch_id', context.record.data.batch_id).items;
                                    Ext.Array.each(batchRecords, function (record) {
                                        record.data.next_location = context.newValues.next_location;
                                        record.commit();
                                    });
                                } else {
                                    context.record.data.next_location = context.newValues.next_location;
                                    context.record.commit();
                                }
                            });
                        }
                    }
                }
            }],
            selType: 'checkboxmodel',
            tbar: [{
                text: Profile.getText('EndJob'),
                iconCls: 'cancel',
                itemId: 'end-current-job',
                disabled: true,
                handler: me.endSelectedJob,
                scope: me
            }, '->', {
                xtype: 'tbtext',
                text: '请在提交前选择要结束的作业'
            }],
            columns: [{
                dataIndex: 'id', text: 'Id', width: 45, hidden: true
            }, {
                dataIndex: 'inspection_id', text: 'Inspection_id', width: 45, hidden: true
            }, {
                dataIndex: 'batch_id', text: 'Batch', width: 45, hidden: true
            }, {
                dataIndex: 'trans_type', text: Profile.getText('trans_type'), width: 60, hidden: true
            }, {
                dataIndex: 'start_time', text: Profile.getText('start_time'), width: 80, renderer: QDT.util.Renderer.dateTimeRenderer
            }, {
                dataIndex: 'duration', text: Profile.getText('duration'), width: 60
            }, {
                dataIndex: 'machine_number', text: Profile.getText('machine_number'), width: 60
            }, {
                dataIndex: 'item', text: Profile.getText('item'), minWidth: 100, flex: 1.2
            }, {
                dataIndex: 'serial', text: Profile.getText('serial'), minWidth: 80, flex: 1
            }, {
                dataIndex: 'job', text: Profile.getText('job'), minWidth: 80, flex: 1
            }, {
                dataIndex: 'suffix', text: Profile.getText('suffix'), width: 45
            }, {
                dataIndex: 'oper_num', text: Profile.getText('oper_num'), width: 45
            }, {
                dataIndex: 'indirect_code', text: Profile.getText('indirect_code'), flex: 1
            }, {
                dataIndex: 'project', text: Profile.getText('Project'), flex: 1
            }, {
                dataIndex: 'quantity', text: Profile.getText('quantity'), width: 60,
                renderer: function (v) {
                    return v || 0;
                }
            }, {
                dataIndex: 'qty_work_on', text: Profile.getText('qty_work_on'), width: 60,
                editor: {
                    xtype: 'numberfield',
                    allowBlank: false,
                    allowDecimals: false,
                    minValue: 0
                }
            }, {
                dataIndex: 'qty_complete', text: Profile.getText('qty_complete'), width: 60,
                editor: {
                    xtype: 'numberfield',
                    allowBlank: false,
                    allowDecimals: false,
                    minValue: 0,
                    listeners: {
                        beforecomplete: function (cmp, boundEl, value, eOpts) {
                        }
                    }
                }
            }, {
                dataIndex: 'passed', text: Profile.getText('passed'), xtype: 'booleancolumn', falseText: Profile.getText('No'), trueText: Profile.getText('Yes'), width: 45,
                editor: {
                    xtype: 'checkbox'
                }
            }, {
                dataIndex: 'next_location',
                text: Profile.getText('ChangeInspectionLocation'),
                // renderer: me.displaylocation,
                renderer: me.comboRenderer(locationEditor),
                editor: locationEditor
            }]
        });



        newInspectionStore = Ext.create('QDT.store.scan.CurrentWork', {
            data: me.newInspectionScanRecords
        });
        transactionTypeStore = me.checkIsCustomInspection() ?
            Ext.create('Ext.data.Store', {
                fields: [{
                    name: 'trans_type'
                }, {
                    name: 'value'
                }],
                data: [{
                    trans_type: Profile.getText('CustomInspection'), value: 'project'
                }]
            })
            :
            Ext.create('Ext.data.Store', {
                fields: [{
                    name: 'trans_type'
                }, {
                    name: 'value'
                }],
                data: [{
                    trans_type: Profile.getText('cmm'), value: 'cmm'
                }, {
                    trans_type: Profile.getText('manual'), value: 'manual'
                }, {
                    trans_type: Profile.getText('online'), value: 'online'
                }, {
                    trans_type: Profile.getText('FPI'), value: 'fpi'
                }, {
                    trans_type: Profile.getText('Cleaning'), value: 'cleaning'
                }, {
                    trans_type: Profile.getText('Ti-Cleaning'), value: 'ticleaning'
                }]
            });

        newInspectionGrid = Ext.widget('grid', {
            itemId: 'future-inspection-grid',
            minHeight: 150,
            maxHeight: 320,
            store: newInspectionStore,
            plugins: [{
                ptype: 'rowediting',
                clicksToEdit: 2,
                saveBtnText: Profile.getText('Save'),
                cancelBtnText: Profile.getText('Cancel')
            }],
            columns: [{
                text: 'inspection_id',
                dataIndex: 'inspection_id',
                width: 20,
                hidden: true
            }, {
                text: Profile.getText('part_num'),
                dataIndex: 'item',
                minWidth: 120,
                flex: 2
            }, {
                text: Profile.getText('serial'),
                dataIndex: 'serial',
                minWidth: 120,
                flex: 2
            }, {
                text: Profile.getText('oper_num'),
                dataIndex: 'oper_num',
                width: 120,
                editor: {
                    xtype: 'combobox',
                    allowBlank: false,
                    displayField: 'opwc',
                    valueField: 'oper_num',
                    listeners: {
                        afterrender: function (cmp, boundEl, value, eOpts) {

                            var selectedData = me.down('#future-inspection-grid').getSelectionModel().getSelection()[0].data;

                            DpInspection.GetPreviousAvailableOperations(selectedData.job, selectedData.suffix, selectedData.oper_num, function (result) {
                                if (result.success) {
                                    var op_store = Ext.create('Ext.data.Store', {
                                        fields: [
                                            {
                                                name: 'oper_num',
                                                mapping: 'oper_num'
                                            }, {
                                                name: 'wc',
                                                mapping: 'wc'
                                            }, {
                                                name: 'opwc',
                                                convert: function (val, record) {
                                                    return record.data['oper_num'] + ':' + record.data['wc'];
                                                }
                                            }
                                        ],
                                        data: result.data
                                    });
                                    cmp.bindStore(op_store);
                                } else {
                                    My.Msg.warning(result.erroeMessage);
                                }
                            });
                        }
                    }
                }
            }, {
                text: Profile.getText('original_oper_num'),
                dataIndex: 'original_oper_num',
                width: 45,
                hidden: true
            }, {
                text: Profile.getText('job'),
                dataIndex: 'job',
                width: 100
            }, {
                text: Profile.getText('suffix'),
                dataIndex: 'suffix',
                width: 15,
                hidden: true
            }, {
                text: Profile.getText('Project'),
                dataIndex: 'project',
                minWidth: 120,
                flex: 3
            }, {
                text: Profile.getText('quantity'),
                dataIndex: 'quantity',
                width: 45
            }],
            tbar: [{
                xtype: 'combobox',
                fieldLabel: Profile.getText('trans_type'),
                itemId: 'trans_type',
                store: transactionTypeStore,
                displayField: 'trans_type',
                valueField: 'value',
                labelWidth: 60,
                value: me.checkIsCustomInspection() === true ? 'project' : null,
                forceSelection: true,
                editable: false,
                listeners: {
                    select: function (cmp, records) {
                        if (records[0].data.value === 'cmm') {
                            this.up().down('[name=machine_id]').enable(true);
                        }
                        else {
                            this.up().down('[name=machine_id]').reset();
                            this.up().down('[name=machine_id]').disable();
                        }
                    }
                }
            }, {
                xtype: 'combobox',
                fieldLabel: Profile.getText('machine_number'),
                labelWidth: 60,
                name: 'machine_id',
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        'machine_id',
                        'machine_number'
                    ],
                    data: [{
                        machine_id: 1,
                        machine_number: 'CM641'
                    }, {
                        machine_id: 2,
                        machine_number: 'CM642'
                    }, {
                        machine_id: 3,
                        machine_number: 'CM643'
                    }, {
                        machine_id: 4,
                        machine_number: 'CM644'
                    }],
                    proxy: {
                        type: 'memory',
                        reader: {
                            type: 'json'
                        }
                    }
                }),
                displayField: 'machine_number',
                valueField: 'machine_id',
                editable: false,
                disabled: true
            }]
        });


        me.items = [
        {
            xtype: 'fieldset',
            padding: 10,
            title: Profile.getText('EmployeeInformation'),
            layout: {
                type: 'hbox',
                pack: 'start'
            },
            frame: true,
            items: [{
                xtype: 'textfield',
                fieldLabel: Profile.getText('local_id'),
                itemId: 'local_id',
                name: 'local_id',
                width: 200,
                listeners: {
                    blur: function (cmp) {
                        me.onEmployeeCheckIn(cmp.getValue());
                    },
                    specialkey: function (field, e) {
                        if (Ext.EventObject.ENTER == e.getKey()) {
                            field.blur();
                        }
                    }
                }
            }, {
                xtype: 'displayfield',
                fieldLabel: Profile.getText('employee_name'),
                itemId: 'employee_name',
                width: 150
            }, {
                xtype: 'displayfield',
                fieldLabel: Profile.getText('client_transaction_time'),
                value: Ext.Date.format(new Date(), 'Y-m-d h:i')
            },
                {
                    xtype: 'hidden',
                    name: 'employee_id',
                    itemId: 'employee_id'
                }, {
                    xtype: 'hidden',
                    name: 'punched_in'
                }
            ]
        }, {
            xtype: 'fieldset',
            collapsible: true,
            padding: 10,
            title: Profile.getText('MyCurrentWork'),
            frame: true,
            layout: {
                type: 'fit'
            },
            items: [currentInspectionGrid]
        }, {
            xtype: 'fieldset',
            padding: 10,
            title: Profile.getText('StartNewWork'),
            frame: true,
            layout: {
                type: 'fit'
            },
            items: [
            {
                xtype: 'container',
                hidden: true,
                defaults: {
                    margin: '0 5 0 0',
                    labelWidth: 60
                },
                layout: {
                    type: 'hbox',
                    pack: 'start'
                },
                items: [
                {
                    xtype: 'checkbox',
                    boxLabel: '是否培训实操',
                    name: 'is_training',
                    itemId: 'is_training',
                    checked: false
                }, {
                    xtype: 'combobox',
                    name: 'training_skill_code',
                    itemId: 'training_skill_code',
                    editable: false,
                    //    store: Ext.create('QDT.store.skill.SkillCodes'),
                    displayField: 'skill_code',
                    valueField: 'skill_code_id',
                    fieldLabel: Profile.getText('skill_code'),
                    hidden: true
                }, {
                    xtype: 'displayfield',
                    name: 'training_process',
                    itemId: 'training_process',
                    editable: false,
                    fieldLabel: Profile.getText('process_name'),
                    hidden: true
                }, {
                    xtype: 'hidden',
                    name: 'training_process_id',
                    itemId: 'training_process_id'
                }, {
                    xtype: 'combobox',
                    name: 'training_trainer',
                    itemId: 'training_trainer',
                    editable: false,
                    valueField: 'approver_id',
                    displayField: 'approver_name',
                    fieldLabel: Profile.getText('trainer'),
                    hidden: true
                }, {
                    xtype: 'textfield',
                    inputType: 'password',
                    fieldLabel: Profile.getText('Password'),
                    name: 'training_trainer_password',
                    itemId: 'training_trainer_password',
                    hidden: true
                }]
            }, newInspectionGrid],
            hidden: !me.hasNewInspection()
        }, {
            xtype: 'combobox',
            fieldLabel: Profile.getText('indirect_code'),
            name: 'indirect_code',
            itemId: 'indirect-code',
            labelWidth: 70,
            width: 250,
            editable: false,
            resizable: true,
            listConfig:
            {
                maxHeight: 180
            },
            emptyText: Profile.getText('PleaseSelect'),
            store: Ext.create('QDT.store.scan.IndirectCodes'),
            displayField: 'description',
            valueField: 'indirect_code',
            hidden: me.hasNewInspection()
        }];

        me.buttons = [
            {
                iconCls: 'exit',
                text: Profile.getText('PunchOut'),
                itemId: 'punch-out',
                disabled: true,
                hidden: me.hasNewInspection(),
                handler: me.onPunchOut,
                scope: me
            }, {
                iconCls: 'forward',
                text: Profile.getText('Submit'),
                disabled: true,
                itemId: 'submit',
                handler: me.onSubmit,
                scope: me
            }
        ];
        me.callParent();

        currentInspectionGrid.on({
            select: function (rowModel, record) {
                me.doBatchSelection(rowModel, record, currentInspectionGrid.store, true);
            },
            deselect: function (rowModel, record) {
                me.doBatchSelection(rowModel, record, currentInspectionGrid.store, false);
            },
            selectionchange: function (selModel, selected) {
                currentInspectionGrid.down('#end-current-job').setDisabled(selected.length === 0);

            }
        });

        me.on({
            close: me.onClose
        });

    },

    onClose: function () {
        var me = this,
            employeeId = me.down('[name=employee_id]').getValue();
        if (employeeId.length > 0) {
            me.onEmployeeCheckOut(employeeId);
        }
    },

    onEmployeeCheckOut: function (employeeId) {
        DpScan.EmployeeCheckOut(employeeId, function (result) {
            if (result.success) {

            }
        });
    },

    onEmployeeCheckIn: function (localId) {
        var me = this;
        if (localId.length === 5) {
            DpScan.EmployeeCheckIn(localId, function (result) {
                if (result.success) {
                    var employee = result.data,
                        name = 'N/A';
                    if (!employee.IsInShiftArrangement) {
                        me.down('#employee_id').setValue('');
                        me.down('#is_training').reset();
                        me.down('#training_skill_code').clearValue();
                        me.down('#training_process').setValue('');
                        me.down('#training_trainer').clearValue();
                        me.down('#training_trainer_password').setValue('');
                        me.down('#employee_name').setValue('');

                        me.down('#training_skill_code').hide();
                        me.down('#training_process').hide();
                        me.down('#training_trainer').hide();
                        me.down('#training_trainer_password').hide();
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
                        me.down('#employee_name').setValue(name);
                        me.down('#employee_id').setValue(employee.EmployeeId);
                        me.down('[name=punched_in]').setValue(employee.PunchedIn);
                        me.down('#current-inspection-grid').store.load({
                            params: { employee_id: employee.EmployeeId }
                        });
                        me.enableButton('#submit', true);
                        me.enableButton('#punch-out', true);
                    }
                } else {
                    My.Msg.warning(result.errorMessage);
                }
            });
        }
    },

    doBatchSelection: function (selModel, record, store, doSelect) {
        if (record.data.batch_id !== null) {
            var batchRecords = store.query('batch_id', record.data.batch_id).items;
            if (doSelect) {
                selModel.select(batchRecords, true, true);
            } else {
                selModel.deselect(batchRecords, true);
            }

        }
    },

    hasNewInspection: function () {
        var me = this;
        return me.newInspectionScanRecords.length > 0;
    },

    checkIsCustomInspection: function () {
        var me = this,
            i;
        for (i = 0; i < me.newInspectionScanRecords.length; i++) {
            if (me.newInspectionScanRecords[i].data.project === 'NA') {
                return false;
            }
        }
        return true;
    },

    enableButton: function (btnQuery, enabled) {
        var me = this;
        me.down(btnQuery).setDisabled(!enabled);
    },

    endSelectedJob: function () {
        //TODO: check if there is going to be new job after ending all current jobs
        var me = this,
            currentInspectionGrid = me.down('#current-inspection-grid'),
            jobsToEnd = me.getRecordsData(currentInspectionGrid.getSelectionModel().getSelection()),
            store = currentInspectionGrid.store,
            employeeId = me.down('[name=employee_id]').getValue(),
            confirmed = true;
        if (store.count() === currentInspectionGrid.getSelectionModel().getSelection().length) {
            Ext.Msg.confirm(Profile.getText('Confirm'), '请确保结束所有当前作业之后开始新的作业；或者直接点击打卡下班', function (btn) {
                if (btn === 'yes') {
                    me.endCurrentWork(employeeId, jobsToEnd);
                }
            });
        } else {
            me.endCurrentWork(employeeId, jobsToEnd);
        }
    },

    endCurrentWork: function (employeeId, jobsToEnd) {
        var me = this,
            currentInspectionGrid = me.down('#current-inspection-grid');
        DpScan.EndCurrentWork(employeeId, jobsToEnd, function (result) {
            if (result.success) {
                currentInspectionGrid.getStore().load();
                cq.query('inspection-maingrid')[0].store.reload();
            }
        });
    },

    onPunchOut: function () {
        var me = this;
        Ext.Msg.confirm(Profile.getText('Warning'), Profile.getText('txtConfirmPunchOut'), function (btn) {
            if (btn === 'yes') {
                me.scanSubmit(null, true);
            }
        });
    },

    onSubmit: function () {
        var me = this,
            currentInspectionStore = me.down('#current-inspection-grid').store,
            futureInspectionStore = me.down('#future-inspection-grid').store,
            isIndirect = futureInspectionStore.count() === 0,
            punchOut = false,
            transType = me.down('#trans_type').getValue(),
            indirectCode = me.down('[name=indirect_code]').getValue(),
            employeeId = me.down('#employee_id').getValue(),
            machineId = me.down('[name=machine_id]').getValue(),
            isTraining = me.down('#is_training').getValue(),
            trainingSkillCode = me.down('#training_skill_code').getValue(),
            trainingProcess = me.down('#training_process').getValue(),
            trainingProcessId = me.down('#training_process_id').getValue(),
            trainerId = me.down('#training_trainer').getValue(),
            trainerPassword = me.down('#training_trainer_password').getValue();

        if (isTraining) {
            if (trainingSkillCode == null || trainingProcess == '' || trainingProcessId == "" || trainerId == null || trainerPassword == "") {
                Ext.Msg.alert(Profile.getText('Warning'), '请输入完整实操信息！');
            } else {
                SystemAdmin.UserValidationByUserIdAndPassword(trainerId, trainerPassword, function (result) {
                    if (result.success) {
                        if (employeeId === '') {
                            My.Msg.warning('请正确输入工号！');
                        } else if ((transType === null || transType === '') && futureInspectionStore.count() > 0) {
                            My.Msg.warning('请选择操作类型！');
                        } else if ((indirectCode === null || indirectCode.length === 0) && isIndirect) {
                            My.Msg.warning('请选择间接代码！');
                        } else if (transType === 'cmm' && (!machineId || machineId === '')) {
                            My.Msg.warning('请选择设备编号！');
                        } else if ((currentInspectionStore.count() > 0 && isIndirect) || (currentInspectionStore.count() === 1 && currentInspectionStore.getAt(0).data.trans_type === 'indirect')) {
                            My.Msg.warning('间接作业不能够和其他作业同时开始，请先结束当前作业！');
                        } else {
                            if (isIndirect) {
                                transType = 'indirect';
                            }

                            if (transType === 'cmm') {
                                DpScan.CheckMachineOccupied(machineId, function (result1) {
                                    if (result1.success) {
                                        if (!result1.occupied) {
                                            me.scanSubmit(transType, punchOut);
                                        } else {
                                            Ext.Msg.alert(Profile.getText('Error'), Profile.getText('txtMachineOccupied'));
                                        }
                                    } else {
                                        Ext.Msg.alert(Profile.getText('Error'), result1.errorMessage);
                                    }
                                });
                            } else {
                                me.scanSubmit(transType, punchOut);
                            }
                        }

                    } else {
                        Ext.Msg.alert(Profile.getText('Error'), result.errorMessage);
                    }
                });
            }
        } else {
            if (employeeId === '') {
                My.Msg.warning('请正确输入工号！');
            } else if ((transType === null || transType === '') && futureInspectionStore.count() > 0) {
                My.Msg.warning('请选择操作类型！');
            } else if ((indirectCode === null || indirectCode.length === 0) && isIndirect) {
                My.Msg.warning('请选择间接代码！');
            } else if (transType === 'cmm' && (!machineId || machineId === '')) {
                My.Msg.warning('请选择设备编号！');
            } else if ((currentInspectionStore.count() > 0 && isIndirect) || (currentInspectionStore.count() === 1 && currentInspectionStore.getAt(0).data.trans_type === 'indirect')) {
                My.Msg.warning('间接作业不能够和其他作业同时开始，请先结束当前作业！');
            } else {
                if (isIndirect) {
                    transType = 'indirect';
                }

                if (transType === 'cmm') {
                    DpScan.CheckMachineOccupied(machineId, function (result2) {
                        if (result2.success) {
                            if (!result2.occupied) {
                                me.scanSubmit(transType, punchOut);
                            } else {
                                Ext.Msg.alert(Profile.getText('Error'), Profile.getText('txtMachineOccupied'));
                            }
                        } else {
                            Ext.Msg.alert(Profile.getText('Error'), result2.errorMessage);
                        }
                    });
                } else {
                    me.scanSubmit(transType, punchOut);
                }
            }
        }

    },

    scanSubmit: function (transType, punchOut) {
        var me = this,
            punchedIn = me.down('[name=punched_in]').getValue(),
            store1 = me.down('#current-inspection-grid').store,
            store2 = me.down('#future-inspection-grid').store,
            currentJobArray = store1.count() > 0 ? me.getRecordsData(store1.getRange(0, store1.count() - 1)) : [],
            newJobArray = store2.count() > 0 ? me.getRecordsData(store2.getRange(0, store2.count() - 1)) : [],
            employeeId = me.down('[name=employee_id]').getValue(),
        //TODO: indirect, project or 3 inspect type
            indirectCode = me.down('#indirect-code').getValue(),
            machineId = me.down('[name=machine_id]').getValue(),

        //如果这个是实操，需要传入trainer的emp_id,以及实操process_id
            trainerEmployeeId = me.down('#training_trainer').value,
            trainingProcessId = me.down('#training_process_id').value;

        DpScan.ScanSubmit(currentJobArray, newJobArray, punchOut, indirectCode, transType, employeeId, punchedIn, machineId, trainerEmployeeId, trainingProcessId, function (result) {
            if (result.success) {
                My.Msg.warning('提交成功！');
                cq.query('inspection-maingrid')[0].store.reload();
                me.close();
            } else {
                My.Msg.warning(result.errorMessage);
            }
        });
    },

    getRecordsData: function (records) {
        var array = [],
            i;

        for (i = 0; i < records.length; i++) {
            array.push(records[i].data);
        }
        return array;
    },
    comboRenderer: function (combo) {
        return function (value) {
            if (value != undefined) {
                var idx = combo.store.find(combo.valueField, combo.value, 1, false, true, true);
                if (idx < 0) {
                    idx = 0;
                }
                var rec = combo.store.getAt(idx);
                return rec.get(combo.displayField);
            } else {
                return value;
            }
        };
    }

})