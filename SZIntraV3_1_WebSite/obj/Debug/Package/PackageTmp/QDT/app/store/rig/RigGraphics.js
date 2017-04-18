Ext.define('QDT.store.rig.RigGraphics', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.rig.RigGraphic',
    autoLoad:true,
    proxy: {
        type: 'direct',
        directFn: DpRig.GetRigGraphic,
        reader: {
            type: 'json',
            root: 'data'

        }
    }

});
