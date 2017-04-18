Ext.define('QDT.controller.rig.VendorManagement', {
    extend: 'Ext.app.Controller',
    views: [
        'QDT.view.rig.VendorManagement',
        'QDT.view.rig.VendorManagementDetail',
        'QDT.view.rig.SearchVendor'

    ],
    stores: ['QDT.store.rig.VendorManagements', 'QDT.store.rig.VendorStatuss', 'QDT.store.rig.GetRigByRigNums'],


    init: function () {

        var me = this;
        me.control({
            'vendormanagement': {
                afterrender: function (cmp) {

                    cmp.store.load();

                },
                itemdblclick:function(cmp, record) {

                    DpRig.CheckSQE(function(result) {
                        
                        if (result.data == 1) {


                            var vendorManagementDetail = Ext.widget('vendormanagementdetail');
                            vendorManagementDetail.down('form').loadRecord(record);
                            vendorManagementDetail.show();


                        }



                    });

                 





                }

                
            }



        });
    }
});