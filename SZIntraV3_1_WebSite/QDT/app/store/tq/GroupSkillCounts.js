Ext.define('QDT.store.tq.GroupSkillCounts', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.tq.PersonSkillCount'
 //   autoDestroy: false,
//    proxy: {
//        type: 'direct',
//        directFn: 'DpTq.GetGroupSkillCount',
//        reader: {
//            type: 'json',
//            root: 'data',
//            totalProperty: 'total'
//        }
//    }
});