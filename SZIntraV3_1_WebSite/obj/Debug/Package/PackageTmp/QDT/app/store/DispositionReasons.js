/// <reference path="../../../extjs/ext-all.js" />
Ext.define('QDT.store.DispositionReasons', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.CommonString',
    remoteSort: true,
    sorters: [
        new Ext.util.Sorter({
            property: 'qdtComString.id',
            direction: 'ASC'
        })
        ],
    pageSize:10,
    proxy: {
        type: 'direct',
        directFn: QDT.SearchDispositionReasons,
        paramsAsHash: true,
        simpleSortMode: true,
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});