Ext.define('QDT.store.inspection.CustomInspectionTypes', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.inspection.InspectionType',

    proxy: {
        type: 'direct',
        directFn: 'DpInspection.GetInspectionType',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    listeners: {
        beforeload: function (store, records, options) {
            Ext.apply(store.proxy.extraParams,
            {
                language: Profile.getLang(),
                category: 'custom'
            });
        }
    }

});