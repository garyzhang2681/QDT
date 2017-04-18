Ext.define('QDT.store.rig.TrackNums', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.rig.TrackNum',
    proxy: {
        type: 'direct',
        directFn: DpRig.QueryTrackNum,
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    }

});
