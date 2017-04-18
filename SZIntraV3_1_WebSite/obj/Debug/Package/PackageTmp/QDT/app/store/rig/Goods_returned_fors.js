Ext.define('QDT.store.rig.Goods_returned_fors', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.rig.Goods_returned_for',
    proxy: {
        type: 'direct',
        directFn: DpRig.QueryGoods_returned_for,
        reader: {
            type: 'json',
            root: 'data'
        }
    }

});
