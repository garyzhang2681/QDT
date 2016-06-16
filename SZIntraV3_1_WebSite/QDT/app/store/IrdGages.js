Ext.define('QDT.store.IrdGages', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.IrdGage',

    pageSize: 10,
    remoteSort: true,
    sorters: [
        new Ext.util.Sorter({
            property: 'irdGage.gage_id',
            direction: 'ASC'
        })],  
    proxy: {
        type: 'direct',
        directFn: DpIrd.GetGageList,
        paramsAsHash: true,
        simpleSortMode: true,
        reader: {
            type:'json',
            root:'data',
            totalProperty:'total'
        }
    }
});