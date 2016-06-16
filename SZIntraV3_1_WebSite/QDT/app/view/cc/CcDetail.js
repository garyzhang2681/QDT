Ext.define('QDT.view.cc.CcDetail', {
    extend: 'Ext.form.Panel',
    alias: 'widget.cc-ccdetail',

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            autoScroll: true,
            border: false,
            layout: 'fit',

            defaults: {
                xtype: 'displayfield',
                labelWidth: 60,
                margin: '0 0 5 15'
            },
            items: [{
                           
                name: 'cc_num',
                fieldLabel: 'CC Num.',
                margin: '30 0 5 15',
                style: {
                    backgroundColor: '#add566'
                }
            }, {
                             
                name: 'business',
                fieldLabel: 'Business'
            }, {
                name: 'serial_lot',
                fieldLabel: 'Serial/Lot'
            }, {
                name: 'part_num',
                fieldLabel: 'Part Num.'
            }, {
                name: 'create_by',
                fieldLabel: 'Creator',
                renderer: QDT.util.Renderer.username
            }, {
                name: 'create_date',
                fieldLabel: 'Create Date',
                renderer: QDT.util.Renderer.dateTimeRenderer
            }, {
                name: 'po_num',
                fieldLabel: 'PO No.'
            }, {
                name: 'criteria',
                fieldLabel: 'Criteria'
            }, {
                name: 'type',
                fieldLabel: 'Type',
                renderer: QDT.util.Renderer.ccType
            }, {
                name: 'rejected_quantity',
                fieldLabel: 'Rejected Quantity'
            }, {
                name: 'comments',
                fieldLabel: 'Comments'
            }, {
                name: 'failure_code',
                fieldLabel: 'Failure Code',
                renderer: QDT.util.Renderer.ccFailureCode
            }, {
                name: 'indicate_finding',
                fieldLabel: 'Indicate Finding',
                renderer: QDT.util.Renderer.ccIndicateFinding
            }, {
                name: 'response_date',
                fieldLabel: 'Response Date',
                renderer: QDT.util.Renderer.dateTimeRenderer
            }, {
                name: 'quality_rep',
                fieldLabel: 'Quality Rep',
                renderer: QDT.util.Renderer.employeeName
            }, {
                name: 'responsible_manager',
                fieldLabel: 'Responsible Manager',
                hidden: true
            }, {
                name: 'ca_assigned_to',
                fieldLabel: 'Ca Assigned To',
                renderer: QDT.util.Renderer.employeeName
            }, {
                name: 'closed_date',
                fieldLabel: 'Closed Date',
                renderer: QDT.util.Renderer.dateTimeRenderer
            }, {
                name: 'audit_findings',
                fieldLabel: 'Audit Findings'
            }, {
                name: 'update_by',
                fieldLabel: 'Update By',
                renderer: QDT.util.Renderer.username
            }, {
                name: 'update_date',
                fieldLabel: 'Update Date',
                renderer: QDT.util.Renderer.dateTimeRenderer
            }],
            tbar: [
            {

                iconCls: 'print',
                itemId: 'print',
                name: 'print',
                text: 'Print 8D Report',
                handler: function () {
                    // me.down('form').getForm().reset();
                }

            }]
        });

        this.callParent();
    }
});