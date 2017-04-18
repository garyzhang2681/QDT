Ext.define('QDT.controller.rig.RIG', {
    extend: 'Ext.app.Controller',
    views: [
        'QDT.view.rig.RIG',
        'QDT.view.rig.RIGDetail',
        'QDT.view.rig.SearchRIG',
        'QDT.view.rig.RigGraphic',
        'QDT.view.rig.RigGraphicShow'
     
    ],
    stores: ['QDT.store.rig.RIGs', 'QDT.store.rig.RigGraphics'],


    init: function() {

        var me = this;
        me.control({
            'rig': {
                afterrender: function(cmp) {

                    cmp.store.load();

                },

                itemdblclick: function (cmp, record) {





                    DpRig.CheckRIGisclosed(record.data['rig_num'], function(result) {


                        var rIgDetail = Ext.widget('rigdetail', { rignum: record.data['rig_num'], isclosed: result['isclosed'] }
                        );
              
                        rIgDetail.down('form').loadRecord(record);
                        rIgDetail.show();

                    });


                }


            }


        });
    }
});