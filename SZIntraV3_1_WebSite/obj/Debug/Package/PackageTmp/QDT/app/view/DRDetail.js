Ext.define('QDT.view.DRDetail', {
    extend: 'Ext.window.Window',
    alias: 'widget.drdetail',
    title: Profile.getText('DRDetail'),
    width: 1180,
    height: 600,
    modal: true,
    autoScroll: true,
    layout: {
        type: 'border'
    },
    dr_num: '',
    isQE: false,
    isME: false,
    isActionOwner: false,
    isClosed: false,

    initComponent: function () {
        var me = this;
        var drDetailForm = Ext.widget('form', {
            frame: false,
            border: false,
            layout: 'anchor',
            defaultType: 'displayfield',
            submitValue: true,
            autoScroll: true,
            height: 550,
            defaults: {
                labelAlign: 'left',
                margin: '5 0 5 5',
                anchor: '90%',
                labelWidth: 100
            },
            // api: { submit: QDT.EditDR },
            listeners: {
                afterrender: function (cmp) {

                    QDT.GetDiscrepancyiesByDrNumber(me.dr_num, function (result) {
                        if (result.success) {
                            var discrepancies = result.data;
                            var index = 0;
                            Ext.Array.each(discrepancies, function (discrepancy) {
                                drDetailForm.down('[name=discrepancy_list]').insert(++index, Ext.create('Ext.form.field.Display', {
                                    value: index + ',   ' + Profile.getText('Normal') + ': ' + discrepancy.NormalDescription + ';' + Profile.getText('Discrepancy') + ': ' + discrepancy.description

                                }));
                            });
                        } else {
                            My.Msg.warning(result.errorMessage);
                        }


                        QDT.GetAttachments(me.dr_num, function (result) {
                            if (result.success) {
                                var attachments = result.data;
                                var index = 0;
                                if (attachments.length != 0) {
                                    drDetailForm.down('[name=attachment_list]').setVisible(true);

                                    Ext.Array.each(attachments, function (attachment) {
                                        drDetailForm.down('[name=attachment_list]').insert(++index, Ext.create('Ext.container.Container', {
                                            layout: 'hbox',
                                            items: [{
                                                xtype: 'box',
                                                style: "padding: 3px",
                                                autoEl: {
                                                    //html: '&nbsp;<a href>Link To Prospect</a>'
                                                    tag: 'a',
                                                    href: '#',
                                                    cn: getFullFileName(attachment.attachmentUrl)
                                                }, listeners: {
                                                    render: function (component) {
                                                        component.getEl().on('click', function (e) {
                                                            var url = '../../QDT/DownloadDrAttachment?attachmentFullFileName=' + getFullFileName(attachment.attachmentUrl);
                                                            window.open(url);
                                                        });
                                                    }
                                                }
                                            }]
                                        }));
                                    });
                                }
                            } else {
                                My.Msg.warning(result.errorMessage);
                            }
                        });

                    });

                    dispGrid.on('itemcontextmenu', function (his, record, item, index, e) {
                        e.preventDefault();
                        e.stopEvent(); // 取消浏览器默认事件  
                        var array = [
                            {
                                text: Profile.getText('Delete'),
                                handler: function () {
                                    QDT.DeleteDisposition(record.data['disposition.disp_id'], function (result) {
                                        QDT.util.Util.generalCallbackCRUD(result, 'd');
                                        dispGrid.store.reload();
                                        dispGrid.selModel.select(0);
                                    });
                                }
                            }
                        ];
                        var nodemenu = new Ext.menu.Menu({
                            items: array
                        });
                        nodemenu.showAt(e.getXY());
                    });

                    actGrid.on('itemcontextmenu', function (his, record, item, index, e) {
                        e.preventDefault();
                        e.stopEvent(); // 取消浏览器默认事件  
                        var array = [
                            {
                                text: Profile.getText('Delete'),
                                handler: function () {

                                    QDT.DeleteAction(record.data['action.act_id'], function (result) {
                                        QDT.util.Util.generalCallbackCRUD(result, 'd');
                                        actGrid.store.reload();
                                      //  dispGrid.store.reload();
                                    });
                                }
                            }
                        ];
                        var nodemenu = new Ext.menu.Menu({
                            items: array
                        });
                        nodemenu.showAt(e.getXY());
                    });

                }
            },
            items: [{
                //   dataIndex: 'dr.dr_num',
                name: 'dr.dr_num',
                fieldLabel: Profile.getText('dr_num')
            }, {
                name: 'dr.job',
                fieldLabel: Profile.getText('job')
            }, {
                name: 'serial_lot',
                fieldLabel: Profile.getText('serial_lot')
            }, {
                name: 'dr.discrepancy_item',
                fieldLabel: Profile.getText('partNum')
            }, {
                name: 'dr.oper_num',
                fieldLabel: Profile.getText('operation_num')
            }, {
                name: 'dr.wc',
                fieldLabel: Profile.getText('wc')
            }, {
                //   dataIndex: 'drType.qdtComString.' + Profile.getLang() + '_string',
                name: 'drType.qdtComString.' + Profile.getLang() + '_string',
                fieldLabel: Profile.getText('type')
            }, {
                //   dataIndex: 'qeOwner.employee.name_' + Profile.getLang(),
                name: 'qeOwner.employee.name_' + Profile.getLang(),
                fieldLabel: Profile.getText('qe_owner')
            }, {
                //    dataIndex: 'meOwner.employee.name_' + Profile.getLang(),
                name: 'meOwner.employee.name_' + Profile.getLang(),
                fieldLabel: Profile.getText('me_owner')
            }, {
                //  dataIndex: 'dr.create_date',
                name: 'dr.create_date',
                fieldLabel: Profile.getText('create_date'),
                valueToRaw: function (v) {
                    return Ext.Date.format(new Date(v), 'Y-m-d H:i');
                }
            }, {
                name: 'dr.due_date',
                fieldLabel: Profile.getText('due_date'),
                valueToRaw: function (v) {
                    return Ext.Date.format(new Date(v), 'Y-m-d');
                }
            }, {
                name: 'dr.description',
                fieldLabel: Profile.getText('problem_description')
            }, {
                xtype: 'fieldset',
                name: 'discrepancy_list',
                anchor: '90%',
                title: Profile.getText('discrepancy_item'),
                collapsible: true,
                layout: 'anchor'
            }, {
                xtype: 'fieldset',
                name: 'attachment_list',
                anchor: '90%',
                title: Profile.getText('attachment'),
                collapsible: true,
                layout: 'anchor',
                hidden: true


            }
            , {
                xtype: 'button',
                name: 'printDr',
                text: Profile.getText('Print'),
                listeners: {
                    click: function () {

                        var url = '../../QDT/PrintDr?drNum=' + me.dr_num;
                        window.open(url);
                    }
                }
            }
            , {
                xtype: 'button',
                name: 'closeDr',
                text: Profile.getText('CloseDr'),
                hidden: !me.isQE || me.isClosed,
                listeners: {
                    click: function () {
                        if (me.isQE) {
                            QDT.CheckDispositionAndActionStatus(me.dr_num, function (result) {
                                // var close = false;
                                if (!result.finished) {
                                    Ext.MessageBox.show({
                                        title: 'Warning',
                                        msg: 'You still have ' + result.unfinishedDispositions + ' unchecked disoposition(s) and ' +
                                            result.unfinishedActions + ' unchecked action(s)<br />Do you still want to close ' + me.dr_num + '?', //TODO language
                                        buttons: Ext.MessageBox.YESNO,
                                        fn: function (btn) {
                                            if (btn === 'yes') {
                                                //         close = true;
                                                QDT.CloseDr(me.dr_num, function (result) {
                                                    if (result.success) {
                                                        MessageBox.alert(me.dr_num, 'Close ' + me.dr_num + ' successfully!'); //TODO language
                                                        me.down('button[name=closeDr]').setVisible(false);
                                                        actStore.getProxy().extraParams.disp_id = 0;
                                                        dispGrid.store.reload();
                                                        actGrid.store.reload();
                                                        Ext.StoreMgr.lookup('RelatedDRs').load();
                                                        dispGrid.down('[id=createDispose]').setDisabled(true);
                                                        actGrid.down('[id=createAction]').setDisabled(true);
                                                    } else {
                                                        MessageBox.alert(me.dr_num, 'Close ' + me.dr_num + ' failed!'); // TODO language
                                                    }
                                                });
                                            } else {
                                                close = false;
                                            }
                                        },
                                        animateTarget: 'mb4',
                                        icon: Ext.MessageBox.WARNING
                                    });
                                } else {

                                    Ext.MessageBox.show({
                                        title: 'Warning',
                                        msg: 'Are you sure to close ' + me.dr_num + '?', //TODO language
                                        buttons: Ext.MessageBox.YESNO,
                                        fn: function (btn) {
                                            if (btn === 'yes') {
                                                //         close = true;
                                                QDT.CloseDr(me.dr_num, function (result) {
                                                    if (result.success) {
                                                        MessageBox.alert(me.dr_num, 'Close ' + me.dr_num + ' successfully!'); //TODO language
                                                        me.down('button[name=closeDr]').setVisible(false);
                                                        actStore.getProxy().extraParams.disp_id = 0;
                                                        dispGrid.store.reload();
                                                        actGrid.store.reload();
                                                        Ext.StoreMgr.lookup('RelatedDRs').load();
                                                        dispGrid.down('[id=createDispose]').setDisabled(true);
                                                        actGrid.down('[id=createAction]').setDisabled(true);
                                                    } else {
                                                        MessageBox.alert(me.dr_num, 'Close ' + me.dr_num + ' failed!'); // TODO language
                                                    }
                                                });
                                            } else {
                                                close = false;
                                            }
                                        },
                                        animateTarget: 'mb4',
                                        icon: Ext.MessageBox.WARNING
                                    });
                                }

                            });
                        }
                    }
                }
            }]

        });

        var dispStore = Ext.create('QDT.store.dr.Dispositions');

        var dispGrid = Ext.widget('grid', {
            flex: 2,
            gridName: 'dispGrid',
            itemId:'disp_grid',

            tbar: [{
                xtype: 'button',
                iconCls: 'add_green',
                id: 'createDispose',
                //  ownerWidget: 'dr',
                disabled: !me.isME || me.isClosed,
                //actionName: 'createDispose',
                text: Profile.getText('Dispose'),
                handler: function () {
                    var dr_num = drDetailForm.down('[name=dr.dr_num]').getValue();
                    var createDisp = Ext.widget('createdisposition', {
                        dr_num: dr_num,
                        dispGrid: dispGrid
                    });
                    createDisp.show();
                }
            }],

            store: dispStore,
            columns: [{
                dataIndex: 'disposition.disp_id', text: 'id', hidden: true
            }, {
                dataIndex: 'disposition.disp_rank', text: Profile.getText('disp_rank'), width: 40
            }, {
                dataIndex: 'disposition.status', text: Profile.getText('status'), width: 70
            }, {
                dataIndex: 'responsibleDepartment.qdtComString.' + Profile.getLang() + '_string', text: Profile.getText('responsible_department'), width: 130
            }, {
                dataIndex: 'dispType.qdtComString.' + Profile.getLang() + '_string', text: Profile.getText('type'), width: 150
            }, {
                dataIndex: 'reasonType.qdtComString.' + Profile.getLang() + '_string', text: Profile.getText('reason'), flex: 1
            }, {
                dataIndex: 'disposition.create_date', text: Profile.getText('create_date'), width: 100, renderer: dateRenderer
            }, {
                dataIndex: 'disposition.description', text: Profile.getText('reason_description'), flex: 2
            }, {
                dataIndex: 'me_employee_id', text: Profile.getText('me_owner'), flex: 1, hidden: true, renderer: QDT.util.Util.employeeName
            }, {
                dataIndex: 'qe_employee_id', text: Profile.getText('qe_owner'), flex: 1, hidden: true, renderer: QDT.util.Util.employeeName
            }, {
                header: Profile.getText('FinishDispose'),
                xtype: 'actioncolumn',
                width: 50,
                hidden: !me.isME,
                items: [{
                    xtype: 'button',
                    getClass: function (v, meta, rec) {
                        if (rec.get('disposition.status') === 'create' && me.isME) {
                            this.items[0].tooltip = 'Finish Dispose';
                            return 'finish';
                        } else {
                            return 'finish_gray';
                        }
                    }
                }],
                handler: function (grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex);
                    if (rec.get('disposition.status') === 'create' && me.isME) {
                        My.Msg.question('Attention!', '请确认此轮部署中的所有action均已创建完成！<br> 已完成,请点击"Yes",未完成,请点击"No"并继续创建action', function (btn, text) {
                            if (btn === 'yes') {
                                //更新disposition的状态为open， DR 的状态为pending QEME
                                QDT.FinishDispose(me.dr_num, actGrid.disp_id, function (result) {
                                    if (result.success) {
                                        dispGrid.store.reload();
                                        //  cq.query('button[id=finishDispose]')[0].setDisabled(true);
                                      //  cq.query('button[id=createAction]')[0].setDisabled(true);
                                        My.Msg.warning('此轮部署完成！');

                                    } else {
                                        My.Msg.warning(result.errorMessage);
                                    }
                                })
                            } else if (btn === 'no') {

                            }
                        });
                    } else {
                        My.Msg.warning('请确认您是此DR的ME,并且此轮部署的状态为create');
                    }
                }

            }, {
                header: Profile.getText('approve'),
                xtype: 'actioncolumn',
                width: 50,
                hidden: !me.isQE,
                items: [{
                    xtype: 'button',
                    //    dataIndex: 'status',

                    getClass: function (v, meta, rec) {

                        if (rec.get('disposition.status') === 'open' && me.isQE) {
                            this.items[0].tooltip = 'Approve';
                            return 'approve';
                        } else {
                            // this.items[0].tooltip = 'Approved';
                            return 'approve_gray';
                        }
                    },

                    handler: function (grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        if (rec.get('disposition.status') === 'open' && me.isQE) {
                            Ext.MessageBox.show({
                                title: 'Warning',
                                msg: '是否确定批准此部署?', //TODO language
                                buttons: Ext.MessageBox.YESNO,
                                fn: function (btn) {
                                    if (btn === 'yes') {
                                        QDT.ApproveDisposition(me.dr_num, rec.get('disposition.disp_id'), function (result) {
                                            if (result.success) {
                                                actStore.getProxy().extraParams.disp_id = rec.get('disposition.disp_id');
                                                dispGrid.store.reload();
                                                actGrid.store.reload();
                                            } else {
                                                My.Msg.warning(result.errorMessage);
                                            }
                                        });
                                    }
                                },
                                animateTarget: 'mb4',
                                icon: Ext.MessageBox.WARNING
                            });
                        } else {
                            My.Msg.warining('请确认您是此DR的QE,并且该部署为open状态');
                        }
                    }
                }, {
                    xtype: 'button',
                    //    dataIndex: 'status',

                    getClass: function (v, meta, rec) {

                        if (rec.get('disposition.status') === 'open' && me.isQE) {
                            this.items[0].tooltip = 'Reject';
                            return 'reject';
                        } else {
                            // this.items[0].tooltip = 'Approved';
                            return 'reject_gray';
                        }
                    },

                    handler: function (grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        if (rec.get('disposition.status') === 'open' && me.isQE) {
                            Ext.MessageBox.show({
                                title: 'Warning',
                                msg: '是否确定拒绝此部署?', //TODO language
                                buttons: Ext.MessageBox.YESNO,
                                fn: function (btn) {
                                    if (btn === 'yes') {


                                        QDT.RejectDisposition(me.dr_num, rec.get('disposition.disp_id'), function (result) {
                                            if (result.success) {
                                                actStore.getProxy().extraParams.disp_id = rec.get('disposition.disp_id');
                                                dispGrid.store.reload();
                                                actGrid.store.reload();
                                            } else {
                                                My.Msg.warning(result.errorMessage);
                                            }
                                        });

                                    }
                                },
                                animateTarget: 'mb4',
                                icon: Ext.MessageBox.WARNING
                            });
                        } else {
                            My.Msg.warining('请确认您是此DR的QE,并且该部署为open状态');
                        }
                    }
                }]
            }, {
                header: Profile.getText('accept'),
                xtype: 'actioncolumn',
                width: 50,
                hidden: !me.isQE,
                items: [{
                    xtype: 'button',
                    // dataIndex: 'status',

                    getClass: function (v, meta, rec) {

                        if (rec.get('disposition.status') === 'completed' && me.isQE) {
                            this.items[1].tooltip = 'Accept';
                            return 'accept';
                        } else {
                            return 'accept_gray';
                        }
                    },

                    handler: function (grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        if (rec.get('disposition.status') === 'completed' && me.isQE) {
                            Ext.MessageBox.show({
                                title: 'Warning',
                                msg: '是否确定接受此部署结果?', //TODO language
                                buttons: Ext.MessageBox.YESNO,
                                fn: function (btn) {
                                    if (btn === 'yes') {
                                        QDT.AcceptDispositionResult(me.dr_num, rec.get('disposition.disp_id'), function (result) {
                                            if (result.success) {
                                                //   console.log('xxx');
                                                dispGrid.store.reload();
                                                actGrid.store.reload();
                                            } else {
                                                My.Msg.warning(result.errorMessage);
                                            }
                                        });

                                    }
                                },
                                animateTarget: 'mb4',
                                icon: Ext.MessageBox.WARNING
                            });
                        } else {
                            My.Msg.warining('请确认您是此DR的QE,并且该部署的状态为completed');
                        }
                    }
                }, {
                    xtype: 'button',
                    //    dataIndex: 'status',

                    getClass: function (v, meta, rec) {

                        if (rec.get('disposition.status') === 'completed' && me.isQE) {
                            this.items[0].tooltip = 'Reject';
                            return 'reject';
                        } else {
                            return 'reject_gray';
                        }
                    },

                    handler: function (grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        if (rec.get('disposition.status') === 'completed' && me.isQE) {
                            Ext.MessageBox.show({
                                title: 'Warning',
                                msg: '是否确定拒绝此部署结果?', //TODO language
                                buttons: Ext.MessageBox.YESNO,
                                fn: function (btn) {
                                    if (btn === 'yes') {
                                        QDT.RejectDispositionResult(me.dr_num, rec.get('disposition.disp_id'), function (result) {
                                            if (result.success) {
                                                dispGrid.store.reload();
                                                actGrid.store.reload();
                                            } else {
                                                My.Msg.warning(result.errorMessage);
                                            }
                                        });

                                    }
                                },
                                animateTarget: 'mb4',
                                icon: Ext.MessageBox.WARNING
                            });
                        } else {
                            My.Msg.warining('请确认您是此DR的QE,并且该部署的状态为completed');
                        }
                    }
                }]
            }


            ],
            listeners: {
                selectionchange: function (cmp, selected) {
                    if (selected.length > 0) {
                        // QDT.(disp_id)
                        //调用方法返回这个disp下的这个action owner的actions 的actid
                        var disp_id = selected[0].data['disposition.disp_id'];
                        QDT.GetActionsByDispositionId(disp_id, function (result) {
                            if (result.success) {

                                actGrid.actions = result.data;
                                actGrid.disp_id = disp_id;
                                //    cq.query('button[id=finishDispose]')[0].setDisabled(!(me.isME && !result.finishedDispose));
                                cq.query('button[id=createAction]')[0].setDisabled(!(me.isME && !me.isClosed && result.canDispose));
                                //   cq.query('button[id=createAction]')[0].setDisabled(!me.isME || me.isClosed || result.finishedDispose);
                                actStore.load({
                                    params: { disp_id: disp_id }
                                });
                            } else {
                                My.Msg.warning(result.errorMessage);
                            }
                        });

                    }
                }
            }
        });

        var actStore = Ext.create('QDT.store.dr.Actions');

        var actGrid = Ext.widget('grid', {
            disp_id: null,
            actions: [],
            gridName: 'actionGrid',
            itemId:'action_grid',
            tbar: [{
                xtype: 'button',
                iconCls: 'add_green',
                disabled: true,
                id: 'createAction',
                //      ownerWidget: 'dr',
                //      actionName: 'createAction',
                text: Profile.getText('CreateAction'),
                handler: function () {
                    var createAction = Ext.widget('createaction', {
                        disp_id: actGrid.disp_id,
                        actGrid: actGrid,
                        dispGrid: dispGrid,
                        isCreate:true,
                        isME:me.isME
                    });
                    createAction.show();
                }
            }],
            flex: 3,
            store: actStore,
            columns: [{
                dataIndex: 'action.act_id', text: 'id', width: 80, hidden: true

            }, {
                dataIndex: 'actionType.qdtComString.' + Profile.getLang() + '_string', text: Profile.getText('type'), width: 100
            }, {
                dataIndex: 'owner.employee.name_' + Profile.getLang(), text: Profile.getText('owner'), width: 60, renderer: emphasizeName
            }, {
                dataIndex: 'action.status', text: Profile.getText('status'), width: 70
            }, {
                dataIndex: 'action.st_action', text: Profile.getText('st_action'), width: 130
            }, {
                dataIndex: 'action.ct_action', text: Profile.getText('ct_action'), flex: 1
            }, {
                dataIndex: 'action.lt_action', text: Profile.getText('lt_action'), flex: 1
            }, {
                dataIndex: 'action.create_date', text: Profile.getText('create_date'), width: 100, renderer: dateRenderer
            }, {
                dataIndex: 'action.update_date', text: Profile.getText('update_date'), width: 100, renderer: dateRenderer, hidden: true
            }, {
                dataIndex: 'action.due_date', text: Profile.getText('due_date'), width: 100, renderer: dueDateRenderer
            }, {
                dataIndex: 'action.description', text: Profile.getText('description'), flex: 1
            }, {
                dataIndex: 'action.remark', text: Profile.getText('remark'), flex: 1
            }, {
                header: Profile.getText('complete'),
                xtype: 'actioncolumn',
                // hidden: !me.isActionOwner,
                width: 50,
                items: [{
                    xtype: 'button',
                    dataIndex: 'status',
                    getClass: function (v, meta, rec) {

                        if (rec.get('action.status') === 'approved' && isActionOwner(actGrid.actions, rec.get('action.act_id'))) {
                            this.items[0].tooltip = 'Complete';
                            return 'complete';
                        } else {
                            return 'complete_gray';
                        }
                    },

                    handler: function (grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        if (isActionOwner(actGrid.actions, rec.get('action.act_id'))) {
                            Ext.MessageBox.show({
                                title: 'Warning',
                                msg: '是否确定完成此动作?', //TODO language
                                buttons: Ext.MessageBox.YESNO,
                                fn: function (btn) {
                                    if (btn === 'yes') {
                                        // var rec = grid.getStore().getAt(rowIndex);
                                        if (rec.get('action.status') === 'approved' && isActionOwner(actGrid.actions, rec.get('action.act_id'))) {

                                            var actionDetail = Ext.widget('createaction', {
                                                isActionOwner: isActionOwner(actGrid.actions, rec.get('action.act_id')),
                                                act_id: rec.get('action.act_id'),
                                                isCreate: false,
                                                isUpdate:true,
                                                isComplete: true,
                                                actGrid: actGrid,
                                                dispGrid: dispGrid
                                            });
                                            actionDetail.down('form').down('searchcombo[name=' + 'owner.employee.name_' + Profile.getLang() + ']').emptyText = rec.get('owner.employee.name_' + Profile.getLang());

                                            actionDetail.down('form').down('remotecombo[name=' + 'actionType.qdtComString.' + Profile.getLang() + '_string' + ']').emptyText = rec.data['actionType.qdtComString.' + Profile.getLang() + '_string'];

                                            actionDetail.show();
                                            actionDetail.down('form').loadRecord(rec);
                                        }
                                    }
                                },
                                animateTarget: 'mb4',
                                icon: Ext.MessageBox.WARNING
                            });
                        }


                    }
                }]
            }]
        });


        function actionsAllCompleted(actStore) {
            var completedCount = 0;
            var i = 0;
            for (i = 0; i < actStore.getCount(); i++) {
                if (actStore.getAt(i).get('status') === 'completed' || actStore.getAt(i).get('status') === 'reject') {
                    completedCount++;
                }
            }
            if (actStore.getCount() === completedCount && completeCount !== 0) {
                return 'allCompleted';
            }
            else {
                return 'notyet';
            }
        }


        function hasAction(actions) {

            if (actions.length > 0) {
                return 'yes';
            }
            else {
                return 'no';
            }
        }


        function isActionOwner(actions, act_id) {
            for (i = 0; i < actions.length; i++) {
                if (actions[i] === act_id) {
                    return true;
                }
            }
            return false;
        }


        function emphasizeName(username) {
            if (username === Profile.getUserName()) {
                return '<span style="color:blue;">' + username + '</span>';
            }
            else {
                return username;
            }
        }


        me.items = [{
            region: 'west',
            title: Profile.getText('DRInfo'),
            width: 270,
            split: true,
            collapsible: true,
            items: [drDetailForm]
        }, {
            region: 'center',
            xtype: 'container',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },

            items: [dispGrid, actGrid]
        }];

        me.callParent();
    }
});

