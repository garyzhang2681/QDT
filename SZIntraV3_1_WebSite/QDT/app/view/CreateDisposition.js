Ext.define('QDT.view.CreateDisposition', {
    extend: 'Ext.window.Window',
    alias: 'widget.createdisposition',
    layout: 'fit',
    width: 500,
    dr_num: '',
    dispGrid: {},
    modal: true,
    title: Profile.getText('CreateDisposition'),
    isCreate: true,
    isUpdate: false,
    disp_id: '',

    initComponent: function () {
        var me = this;

        var createForm = Ext.widget('form', {
            frame: true,
            api: me.isCreate ? { submit: QDT.CreateDisposition} : me.isUpdate ? { submit: QDT.UpdateDisposition} : '',
            layout: 'anchor',
            defaultType: 'textfield',
            listeners: {
                afterrender: function () {
                    if (me.isCreate) {
                        QDT.GetDiscrepancyiesByDrNumber(me.dr_num, function (result) {
                            var discrepancies = result.data;
                            var index = 0;
                            Ext.Array.each(discrepancies, function (discrepancy) {
                                createForm.down('[name=discrepancy_list]').insert(++index, Ext.create('Ext.form.field.Checkbox', {
                                    boxLabel: Profile.getText('Normal') + ': ' + discrepancy.NormalDescription + ';  ' + Profile.getText('Discrepancy') + ': ' + discrepancy.description,
                                    name: 'discrepancy_list#' + index,
                                    inputValue: discrepancy.disc_id,
                                    checked: me.isCreate ? false : true
                                }));
                            });
                        });
                    }
                    //                    else if (me.isUpdate) {
                    //                        QDT.GetDiscrepanciesByDispositionId(me.disp_id, function (result) {
                    //                            var discrepancies = result.data;
                    //                            var index = 0;
                    //                            Ext.Array.each(discrepancies, function (discrepancy) {
                    //                                createForm.down('[name=discrepancy_list]').insert(++index, Ext.create('Ext.form.field.Checkbox', {
                    //                                    boxLabel: Profile.getText('Normal') + ': ' + discrepancy.NormalDescription + ';  ' + Profile.getText('Discrepancy') + ': ' + discrepancy.description,
                    //                                    name: 'discrepancy_list#' + index,
                    //                                    inputValue: discrepancy.disc_id,
                    //                                    checked: discrepancy.disc_disp
                    //                                }));
                    //                            });
                    //                        });
                    //                    } 
                    else {
                        QDT.GetDiscrepanciesByDispositionId(me.disp_id, function (result) {
                            var discrepancies = result.data;
                            var index = 0;
                            Ext.Array.each(discrepancies, function (discrepancy) {
                                if (discrepancy.disc_disp) {
                                    createForm.down('[name=discrepancy_list]').insert(++index, Ext.create('Ext.form.field.Checkbox', {
                                        boxLabel: Profile.getText('Normal') + ': ' + discrepancy.NormalDescription + ';  ' + Profile.getText('Discrepancy') + ': ' + discrepancy.description,
                                        name: 'discrepancy_list#' + index,
                                        inputValue: discrepancy.disc_id,
                                        checked: true,
                                        readOnly: true
                                    }));
                                }

                            });
                        });
                    }
                }
            },
            defaults: {
                labelAlign: 'left',
                margin: '10 0 10 5',
                anchor: '90%',
                labelWidth: 80,
                submitValue: true
            },
            items: [
            {
                xtype: 'hiddenfield',
                name: 'disp_id',
                fieldLabel: 'disp_id',
                value: me.disp_id
            },
            {
                xtype: 'displayfield',
                name: 'disposition.dr_num',
                fieldLabel: Profile.getText('dr_num'),
                value: me.dr_num
            }, {
                xtype: 'searchcombo',
                name: 'reasonType.qdtComString.' + Profile.getLang() + '_string',
                fieldLabel: Profile.getText('reason_code'),
                store: Ext.create('QDT.store.DispositionReasons'),
                displayField: 'common_string',
                valueField: 'id',
                readOnly: !me.isCreate && !me.isUpdate,
                pageSize: 10
            }, {
                xtype: 'remotecombo',
                name: 'responsibleDepartment.qdtComString.' + Profile.getLang() + '_string',
                fieldLabel: Profile.getText('responsible_department'),
                store: Ext.create('QDT.store.dr.ResponsibleDepartments'),
                valueField: 'id',
                displayField: 'common_string',
                emptyText: Profile.getText('PleaseSelect'),
                editable: false,
                forceSelection: true,
                readOnly: !me.isCreate && !me.isUpdate
            }, {
                xtype: 'remotecombo',
                name: 'dispType.qdtComString.' + Profile.getLang() + '_string',
                forceSelection: true,
                fieldLabel: Profile.getText('disp_type'),
                store: Ext.create('QDT.store.DispositionTypes'),
                displayField: 'common_string',
                valueField: 'id',
                emptyText: Profile.getText('PleaseSelect'),
                readOnly: !me.isCreate && !me.isUpdate,
                listeners: {  //为Combo添加select事件
                    select: function (combo, record, index) {   // 该事件会返回选中的项对应在 store中的 record值. index参数是排列号.
                        if (combo.rawValue == '报废') {
                            My.Msg.info('Warning','请检查是否有装配件需要退库？');
                        }
                    }
                }

            }, {
                xtype: 'textarea',
                name: 'disposition.description',
                fieldLabel: Profile.getText('reason_description'),
                readOnly: !me.isCreate && !me.isUpdate,
                height: 100
            }, {
                xtype: 'checkboxgroup',
                fieldLabel: Profile.getText('discrepancy_item'),
                name: 'discrepancy_list',
                columns: 1,
                readOnly: !me.isCreate && !me.isUpdate
            }]
        });

        me.items = [createForm];

        me.buttons = [{
            text: me.isCreate ? Profile.getText('Save') : me.isUpdate ? Profile.getText('Update') : Profile.getText('Close'),
            iconCls: 'submit',
            handler: function () {

                if (!me.isCreate && !me.isUpdate) {
                    me.close();
                }
                //console.log(createForm.getValues());
                //                if (createForm.getValues()['reasonType.qdtComString.' + Profile.getLang() + '_string'] == 0) {
                //                    alert('reason type equals to 0!');
                //                }
                //                else {

                createForm.submit({
                    success: function (form, action) {

                        if (me.isCreate) {
                            Ext.Msg.alert(Profile.getText('DispositionCreated'),
                                '</br>' + Profile.getText('dr_num') + ':' +
                                action.result.data.dr_num + '-----> ' +
                                Profile.getText('Disposition') +
                                action.result.data.disp_rank);
                            // me.dispGrid.store.add(action.result.data);
                            me.dispGrid.store.reload({
                                callback: function () {
                                    var newDispIndex = cq.query('grid[gridName=dispGrid]')[0].store.totalCount - 1;
                                    cq.query('grid[gridName=dispGrid]')[0].selModel.select(newDispIndex);
                                }
                            });
                            //TODO: reload是异步的，所以下面的selection之后可能会被覆盖
                            //   var new_disp_index = cq.query('grid[gridName=dispGrid]')[0].store.totalCount - 1;
                            //  cq.query('grid[gridName=dispGrid]')[0].selModel.select(1);

                        } else if (me.isUpdate) {
                            Ext.Msg.alert(Profile.getText('Message'), Profile.getText('txtRecordUpdated'));
                            me.dispGrid.store.reload();
                            me.dispGrid.selModel.select(action.result.data.disp_rank - 1);
                        }
                        me.close();
                    },
                    failure: function (form, action) {
                        Ext.Msg.alert(Profile.getText('Error'), action.result.data.errorMessage);
                    }
                });

            }
        }];

        me.callParent();
    }
}); 