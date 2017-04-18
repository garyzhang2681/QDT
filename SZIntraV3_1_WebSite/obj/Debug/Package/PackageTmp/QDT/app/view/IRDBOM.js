Ext.define('QDT.view.IRDBOM', {
    extend: 'Ext.window.Window',
    alias: 'widget.irdbom',
    title: Profile.getText('IRDBOM'),
    width: 1180,
    height: 600,
    modal: true,
    //    isPrepare: false,
    //    isVerify: false,
    //    isApprove: false,
    canEdit: false,
    needVerify: false,
    needApprove: false,
    verified: false,
    prepared: false,
    isUpgrade: false,
    ird_id: '',
    layout: {
        type: 'border'
    },

    initComponent: function () {
        var me = this;

        var irdBomInfoForm = Ext.widget('form', {
            frame: false,
            border: false,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margin: '5 5 0 5'
            },
            items: [{
                xtype: 'container',
                layout: 'hbox',
                defaultType: 'textfield',
                defaults: {
                    lableWidth: 18,
                    margin: '10 5 5 5'
                },
                items: [{
                    xtype: 'searchcombo',
                    name: 'part_num',
                    id: 'part_num',
                    fieldLabel: Profile.getText('part_num'),
                    store: Ext.create('QDT.store.Items'),
                    displayField: 'item',
                    valueField: 'item',
                    columns: [{ dataIndex: 'item', text: 'Item'}],
                    pageSize: 10
                }, {
                    fieldLabel: 'Rev. Level:', //TODO: language
                    value: 'AK', //TODO:
                    id: 'rev_level'
                }, {
                    fieldLabel: 'IRD Revision:', //TODO: language 
                    value: '21', //TODO:
                    id: 'ird_revision'
                }]
            }, {
                xtype: 'container',
                layout: 'hbox',
                defaultType: 'textfield',
                defaults: {
                    lableWidth: 18,
                    margin: '5 5 5 5'
                },
                items: [{
                    fieldLabel: 'syteline bom id', // TODO: Language
                    value: '',
                    id: 'job'
                }, {
                    fieldLabel: 'syteline bom suffix', // TODO: Language
                    labelWidth: 110,
                    value: '',
                    id: 'suffix'
                }]
            }, {
                xtype: 'container',
                layout: {
                    pack: 'end',
                    type: 'hbox'
                },
                defaults: {
                    margin: '5 5 10 5'
                },
                items: [
             {
                 xtype: 'button',
                 text: Profile.getText('UpgradeIRD'),
                 id: 'upgrade_ird',
                 disabled: true
             }, {
                 xtype: 'button',
                 text: Profile.getText('Submit'),
                 id: 'save',
                 disabled: true
             }, {
                 xtype: 'button',
                 text: 'Verify',  //TODO: language  depends on current status
                 id: 'verify',
                 disabled: true,
                 handler: function () {
                     var win = Ext.create('QDT.view.ird.IrdDifference', {
                         ird_id: me.ird_id,
                         check_type: 'Verify'
                     });
                     win.show();
                 }
                 //prepared -> veryify
                 //verified -> approve
                 //approved -> hidden
                 //click: show confirm message box
             }, {
                 xtype: 'button',
                 text: 'Approve',  //TODO: language
                 id: 'approve',
                 disabled: true,
                 handler: function () {
                     var win = Ext.create('QDT.view.ird.IrdDifference', {
                         ird_id: me.ird_id,
                         check_type: 'Approve'
                     });
                     win.show();
                 }
             }]
            }]
        });

        var irdBomGrid = Ext.widget('grid', {
            //store
            // features: [Ext.create('Ext.grid.feature.Grouping')],
            gridName: 'irdBomGrid',
            scroll: true,
            columns: [{
                header: Profile.getText('Edit'),
                xtype: 'actioncolumn',
                width: 50,
                items: [{
                    xtype: 'button',
                    getClass: function (v, meta, rec) {
                        return 'edit';
                    },
                    handler: function (grid, rowIndex, colIndex) {

                        if (me.canEdit) {  //在part NO. 的文本框的blur时间中，根据不同的情况设置，true表示此人可以进行编辑，false表示有人正在对此ird revision进行修改，不能对其操作
                            if (!me.isUpgrade) { // isUpgrade 在用户点击Upgrade ird 按钮的时候置为true，只有第一个对其进行编辑的人才能点击这个按钮
                                My.Msg.warning('请点击“Upgrade IRD”按钮进行升版');
                            } else {
                                var modifyOperation = Ext.create('QDT.view.IRDModifyOperation', {
                                    isUpgrade: true,  //TODO
                                    canEdit: me.canEdit,
                                    ird_id: me.ird_id
                                });

                                var record = grid.getStore().getAt(rowIndex);
                                modifyOperation.down('form').loadRecord(record);
                                modifyOperation.down('grid[name=irdBOMCharacteristicGrid]').store.load({
                                    params: { ird_id: me.ird_id,
                                        oper_num: record.data.oper_num
                                    }
                                });
                                modifyOperation.show();
                            }
                        }
                        else if (me.needVerify) {  //完成对ird 的编辑，并且save了，等待第二人的verify
                            My.Msg.warning('Someone has upgraded this ird revision, please verify it!');
                        }
                        else if (me.needApprove) { //完成了对ird 的verify， 等待第三人的approve
                            My.Msg.warning('Someone has upgraded this ird revision, please approve it!');
                        } else if (me.prepared) {  //part no 输入框的blur事件后，如果这个ird是由登录用户编辑并保存的，则prepared为true，表示这个用户不能再编辑了
                            My.Msg.warning('You have upgraded this ird revision');
                        } else if (me.verified) { //part no 输入框的blur事件后，如果这个ird是由登录用户verified的，则verified为true，表示该用户不能再编辑了
                            My.Msg.warning('You have verified this ird revision');
                        } else {
                            My.Msg.warning('Someone is editing this ird revision, please contact IT!');
                        }
                    }
                }]
            }, {
                dataIndex: 'ird_id', text: Profile.getText('ird_id'), flex: 1, hidden: true
            }, {
                dataIndex: 'oper_num', text: Profile.getText('oper_num'), flex: 1
            }, {
                dataIndex: 'description', text: Profile.getText('description'), flex: 1
            }, {
                dataIndex: 'Uf_item_aircraft_type', text: Profile.getText('Uf_item_aircraft_type'), flex: 1
            }, {
                dataIndex: 'Uf_item_ge_project', text: Profile.getText('Uf_item_ge_project'), flex: 1
            }]
        });

        me.items = [
            {
                region: 'north',
                split: true,
                items: [irdBomInfoForm]
            }, {
                region: 'center',
                items: [irdBomGrid],
                layout: 'fit'
            }
        ];

        me.callParent();
    }
});














