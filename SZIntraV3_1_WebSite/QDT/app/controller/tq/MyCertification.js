Ext.define('QDT.controller.tq.MyCertification', {
    extend: 'Ext.app.Controller',

    views: [
        'QDT.view.tq.MyCertificationGrid'
    ],

    init: function () {
        var me = this;

        me.control({
            'tq-mycertificationgrid': {
                afterrender: function (cmp) {
                    var store = cmp.store;
                    store.mon(store, {
                        destroyable: true,
                        beforeload: function () {
                            Ext.apply(store.proxy.extraParams, {
                                filter_status: cmp.down('[name=filter_status]').getValue(),
                                status: cmp.down('[name=status]').getValue(),
                                employee_id: cmp.employeeId,
                                working_group_id: null
                            });
                        }
                    });
                    store.load();
                }
            }
        });
    }
});