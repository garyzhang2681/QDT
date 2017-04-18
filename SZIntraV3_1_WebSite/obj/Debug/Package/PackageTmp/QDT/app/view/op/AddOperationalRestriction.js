Ext.define('QDT.view.op.AddOperationalRestriction',
{
    extend: 'Ext.window.Window',
    alias: 'widget.op-addoperationalrestriction',
    activeRecords: [],

    initComponent: function () {
        var me = this;

        var grid = Ext.widget('op-operationgrid', {
            itemId: 'operations',
            height: 180,
            bbar: null,
            tbar: null,
            margin: '0 0 15 0',
            autoScroll: true
        });

        grid.store.loadData(me.activeRecords);

        Ext.apply(me, {
            title: Profile.getText('AddOperationalRestriction'),
            autoShow: true,
            modal: true,
            constrainHeader: true,
            width: 420,
            height: 360,
            defaults: [
            {
                margin: '5 10 5 10'
            }],
            items: [grid, {
                xtype: 'localcombo',
                name: 'work_type',
                itemId: 'work_type',
                fieldLabel: Profile.getText('WorkType'),
                store: Ext.create('Asz.store.op.WorkTypes'),
                displayField: 'work_type_string',
                valueField: 'work_type',
                value: 'run',
                width: 300
            }, {
                xtype: 'tq-certificationitemcascade',
                itemId: 'certification_item_cascade'
            }],
            buttons: [{
                iconCls: 'submit',
                text: Profile.getText('Submit'),
                itemId: 'submit'
              //  handler: function () 
            }]
        });


        me.callParent();

    }


});