Ext.define('QDT.store.inspection.InspectionRecords', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.inspection.InspectionRecord',
    pageSize: 50,
    groupField: 'location',
    remoteSort:false,

    proxy: {
        type: 'direct',
        directFn: 'DpInspection.GetInspection',
        simpleSortMode: true,
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    }
    ,
    listeners: {
        beforeload: function (store, records) {
            var mainGrid = cq.query('inspection-maingrid')[0],
                query = mainGrid.down('triggerfield[name=search_wo_item]').getValue(),
                locationId = mainGrid.down('combobox[name=inspection_location]').getValue(),
                onlyUnfinished = mainGrid.down('[name=only_unfinished]').getValue();
            Ext.apply(store.proxy.extraParams,
            {
                search_wo_item: query,
                inspection_location_id: locationId,
                only_unfinished: onlyUnfinished
            });
        }
    }
});