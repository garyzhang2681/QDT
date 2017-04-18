Ext.define('QDT.view.inspection.Scan', {
    extend: 'Ext.form.Panel',
    requires: [
        'QDT.view.scan.MyCurrentWork'
    ],
    alias: 'widget.inspection-scan',
    frame: true,
    fieldDefaults: {
        labelWidth: 60
    },

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            items: [{
                xtype: 'fieldset',
                title: 'Check In',
                defaultType: 'button',
                items: [{
                    xtype: 'textfield',
                    name: 'local_id',
                    fieldLabel: Profile.getText('local_id')
                }, {
                    text: Profile.getText('Submit')
                }, {
                    text: Profile.getText('MyCurrentWork'),
                    handler: me.showMyCurrentWork,
                    scope: me
                }]
            }, {
                xtype: 'fieldset',
                title: 'Work orders',
                items: [{
                    xtype: 'hidden',
                    name: 'inspection_type_id'
                }, {
                    xtype: 'displayfield',
                    name: 'inspection_type',
                    fieldLabel: Profile.getText('inspection_type')
                }, {
                    xtype: 'displayfield',
                    name: 'project_item',
                    fieldLabel: Profile.getText('project_item')
                }, {
                    xtype: 'hidden',
                    name: 'wo_list'
                }, {
                    xtype: 'grid',
                    itemId:'wo-list',
                    store: Ext.create('Ext.data.Store', {
                        fields:['wo','suffix','id'],
                        proxy:{
                            type:'memory',
                            reader:{
                                type:'json'
                            }
                        }
                    }),
                    columns: [{
                        dataIndex:'wo',text:Profile.getText('job'),width:100
                    },{
                        dataIndex:'suffix',text:Profile.getText('suffix'),flex:1
                    }],
                    width: 160,
                    height:180,
                    margin:'10 0 30 0'
                }, {
                    xtype: 'textfield',
                    name: 'oper_num',
                    fieldLabel: Profile.getText('oper_num')
                }]
            }, {
                xtype: 'button',
                text: Profile.getText('StartInspection'),
                handler: this.onStartInspection,
                disabled: true,
                itemId: 'start-inspection'
            }]
        });

        me.callParent(arguments);
    },

    showMyCurrentWork: function () {
        var me = this,
            localId = me.down('[name=local_id]').getValue(),
            store = Ext.create('QDT.store.scan.MyCurrentWork', {
                autoDestroy: true,
                autoLoad: true,
                listeners: {
                    datachanged: function () {
                        //update active job
                        win.down('scan-mycurrentwork').hasActiveWork = this.count() > 0;
                    },
                    beforeload: function () {
                        Ext.apply(this.getProxy().extraParams, {
                            employee_id: 140
                        });
                    }
                }
            });
        var win = Ext.widget('window', {
            title: Profile.getText('MyCurrentWork') + ' - 郭宇峰',
            constrainHeader: true,
            autoShow: true,
            modal: true,
            width: 700,
            height: 560,
            layout: 'fit',
            items: [{
                xtype: 'scan-mycurrentwork',
                title: '',
                store: store
            }],
            listeners: {
                beforeclose: function () {
                    var grid = this.down('scan-mycurrentwork');
                    if (!grid.hasActiveWork && !grid.isPunchOut) {
                        Ext.Msg.alert('Error', 'You don\'t have active work.');
                        return false;
                    }
                }
            }
        });
        //        store.load();
    }

});