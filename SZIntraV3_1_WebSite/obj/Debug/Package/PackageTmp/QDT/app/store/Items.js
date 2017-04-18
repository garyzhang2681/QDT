/// <reference path="../../../extjs/ext-all.js" />
Ext.define('QDT.store.Items', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.Item',
    remoteSort: true,
    sorters: [
        new Ext.util.Sorter({
            property: 'item',
            direction: 'ASC'
        })
        ],
    pageSize:10,
    proxy: {
        type: 'direct',
        directFn: QDT.SearchItems,
        paramsAsHash: true,
        simpleSortMode: true,
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});