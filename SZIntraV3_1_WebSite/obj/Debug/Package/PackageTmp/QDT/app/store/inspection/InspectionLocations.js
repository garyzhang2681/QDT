Ext.define('QDT.store.inspection.InspectionLocations', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.inspection.InspectionLocation',

    proxy: {
        type: 'direct',
        directFn: 'DpInspection.GetInspectionLocation',
        reader: {
            type: 'json',
            root: 'data'
        }
    }

    //    listeners: {
    //        beforeload: function (store, records, options) {
    //            Ext.apply(store.proxy.extraParams,
    //            {
    //                language: Profile.getLang()
    //            });
    //        }
    //    }
});