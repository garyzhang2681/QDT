Ext.define('QDT.view.tq.CertificationBaseGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.tq-certificationbasegrid',

    initComponent: function () {
        var me = this,
            store = Ext.create('QDT.store.tq.Certifications'),
            groupingFeature;

        //        groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
        //            groupHeaderTpl: Profile.getText('ghGeneral')
        //        });

        Ext.apply(me, {
            store: store,
            layout: 'fit',
            columns: [{
                dataIndex: 'id', text: Profile.getText('id'), width: 50,hidden:true
            }, {
                dataIndex: 'category', text: Profile.getText('category'), renderer: QDT.util.Renderer.certificationCategory, width: 150
            }, {
                dataIndex: 'employee_id', text: Profile.getText('employee_name'), renderer: QDT.util.Renderer.employeeName, minWidth: 80
            }, {
                dataIndex: 'certification_item', text: Profile.getText('certification_item'), width: 160
            }, {
                dataIndex: 'issue_date', text: Profile.getText('issue_date'), flex: 1, renderer: QDT.util.Renderer.dateRenderer, minWidth: 80
            }, {
                dataIndex: 'refresh_date', text: Profile.getText('refresh_date'), flex: 1, renderer: QDT.util.Renderer.dateRenderer, minWidth: 80
            }, {
                dataIndex: 'expire_date', text: Profile.getText('expire_date'), flex: 1, renderer: QDT.util.Renderer.certificationExpireDateRenderer, minWidth: 80
            }, {
                xtype: 'booleancolumn', dataIndex: 'is_trainer', text: Profile.getText('is_trainer'), renderer: QDT.util.Renderer.booleanRenderer, minWidth: 100
            }, {
                dataIndex: 'status', text: Profile.getText('status'), width: 80, renderer: QDT.util.Renderer.certificationStatus, minWidth: 80
            }, {
                dataIndex: 'remark', text: Profile.getText('remark'), minWidth: 80,flex:3
            }],

            features: [
            //                groupingFeature
            ]
        });

        me.callParent();
    }
});