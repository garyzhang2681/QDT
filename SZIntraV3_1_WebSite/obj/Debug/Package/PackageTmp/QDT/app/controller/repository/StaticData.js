Ext.define('QDT.controller.repository.StaticData', {
    extend: 'Ext.app.Controller',
    stores: [
        'Asz.store.system.Users',
        'Asz.store.system.NativeUsers',
        'Asz.store.hr.Employees',
        'Asz.store.util.Items',
        'Asz.store.util.SerialsLots',
        'Asz.store.op.WorkCenters',
        'Asz.store.op.WorkTypes',
      //  'QDT.store.ll.Categories',
      //  'QDT.store.ll.WorkingGroups',
        'QDT.store.tq.CertificationStatus',
        'QDT.store.tq.CertificationCategories',
        'QDT.store.tq.WorkflowProcessStatus',
        'QDT.store.tq.WorkflowCategories',
        'QDT.store.tq.WorkflowActionTypes'
     //  'QDT.store.cc.CcTypes',
//        'QDT.store.cc.CcFailureCodes',
//        'QDT.store.cc.CcIndicateFindings'
    ]


});