Ext.define('QDT.controller.permission.PermissionManagement', {
    extend: 'Ext.app.Contr' +
        'oller',
    views: [
        'permission.UserPermissionPanel'
    ],
    stores: ['permission.UserGroupMenus',
    'permission.UserMenus',
    'permission.RemainingMenus'],
    refs: [{
        ref: 'userPermissionPanel',
        selector: 'permission-userpermissionpanel'
    }],

    init: function () {
        var me = this;
        me.control({
            'permission-userpermissionpanel #user': {
                select: function (combo, records, eOpts) {
                    var userPermissionPanel = cq.query('permission-userpermissionpanel')[0];
                    var groupPermission = userPermissionPanel.down('#group_permission');
                    var userPermission = userPermissionPanel.down('#user_permission');
                    var remainingPermission = userPermissionPanel.down('#remaining_permission');


                    //                    var groupPermissionStore = Ext.create('QDT.store.permission.UserGroupMenus');
                    //                
                    //                    groupPermissionStore.load({
                    //                        params: {
                    //                            user_id: combo.value
                    //                        }
                    //                    });
                    //                      groupPermission.reconfigure(groupPermissionStore);
                    //                    console.log(groupPermissionStore);


                    groupPermission.store.load({
                        params: {
                            user_id: combo.value
                        }
                    });


                    userPermission.store.load({
                        params: {
                            user_id: combo.value
                        }
                    });

                    remainingPermission.store.load({
                        params: {
                            user_id: combo.value
                        }
                    });




                    //                    var userPermissionStore = Ext.create('QDT.store.permission.UserMenus');
                    //                    userPermissionStore.load({
                    //                        params: {
                    //                            user_id: combo.value
                    //                        }
                    //                    });
                    //                    userPermission.reconfigure(userPermissionStore);


                    //                    var remainingPermissionStore = Ext.create('QDT.store.permission.RemainingMenus');
                    //                    remainingPermissionStore.load({
                    //                        params: {
                    //                            user_id: combo.value
                    //                        }
                    //                    });
                    //                    remainingPermission.reconfigure(remainingPermissionStore);

                }
            }

        });
    }
})