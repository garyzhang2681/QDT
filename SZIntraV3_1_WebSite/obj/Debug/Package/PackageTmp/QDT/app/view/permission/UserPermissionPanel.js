Ext.define('QDT.view.permission.UserPermissionPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.permission-userpermissionpanel',
    requires: [
            'QDT.view.permission.GroupPermissionGrid',
            'QDT.view.permission.UserPermissionGrid',
            'QDT.view.permission.RemainingPermissionGrid'
        ],
    //    views: [
    //            'permission.GroupPermissionGrid',
    //            'permission.UserPermissionGrid',
    //            'permission.RemainingPermissionGrid'
    //        ],
    //  requires: ['QDT.view.exampleviews.gridexample'],
    // requires: ['QDT.view.permission.MenuGrid'],

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            border: false,
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'start'
            },
            items: [{
                xtype: 'nativeusercombo',
                fieldLabel: '工号',
                width: 120,
                name: 'user',
                itemId: 'user'
            }, {
                xtype: 'panel',
                flex: 1,
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'permission-grouppermissiongrid',
                    name: 'group_permission',
                    itemId: 'group_permission',
                    flex: 1

                }, {
                    xtype: 'container',
                    flex: 1,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [{
                        xtype: 'permission-userpermissiongrid',
                        name: 'user_permission',
                        itemId: 'user_permission',
                        flex: 1,
                        multiSelect: true,
                        viewConfig: {
                            plugins: {
                                ptype: 'gridviewdragdrop'
                            },
                            listeners: {
                                drop: function (node, data, dropRec, dropPosition) {

                                    var userId = me.down('#user').value;
                                    console.log(userId);
                                    var menus = QDT.util.Util.getRecordsData(data.records);

                                    SystemAdmin.AddUserMenu(userId, menus, function (result) {
                                        if (result.success) {
                                            //TODO  show drap success message     
                                        } else {
                                            My.Msg.warning(result.errorMessage);
                                        }
                                    });
                                }
                            }
                        }

                    }, {
                        xtype: 'permission-remainingpermissiongrid',
                        name: 'remaining_permission',
                        itemId: 'remaining_permission',
                        flex: 1,
                        
                        viewConfig: {
                            plugins: {
                                ptype: 'gridviewdragdrop'
                            },
                            listeners: {
                                drop: function (node, data, dropRec, dropPosition) {

                                    var userId = me.down('#user').value;
                                    console.log(userId);
                                    var menus = QDT.util.Util.getRecordsData(data.records);

                                    SystemAdmin.DeleteUserMenu(userId, menus, function (result) {
                                        if (result.success) {
                                            //TODO  show drap success message     
                                        } else {
                                            My.Msg.warning(result.errorMessage);
                                        }
                                    });
                                }
                            }
                        }
                    }]
                }]
            }]
        });


        me.callParent();
    }

});

