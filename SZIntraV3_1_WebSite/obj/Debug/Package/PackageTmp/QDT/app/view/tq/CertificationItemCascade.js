
Ext.define('QDT.view.tq.CertificationItemCascade', {
    extend: 'Ext.container.Container',
    alias: 'widget.tq-certificationitemcascade',

    initComponent: function () {

        var me = this;

        Ext.apply(me, {
            items: [{
                xtype: 'localcombo',
                itemId: 'category',
                store: Ext.create('Ext.data.ArrayStore', {
                    fields: [
                        'category',
                        'description'
                    ],
                    data: [
                    [Profile.getText('PleaseSelect') , '请选择类别'],
                        ['stc', 'Skill Code Certification'],
                        ['llc', 'Lessons\' Learnt Certification']
                    ]
                }),
                name: 'category',
                width: 300,
                fieldLabel: Profile.getText('category'),
                displayField: 'description',
                valueField: 'category',
                value: 'select',
                anchor: '50%',
                listeners: {
                    select: function (combo, records) {
                        this.up('container').down('[itemId=certification_item_id]').category = records[0].data.category;
                        this.up('container').down('[itemId=certification_item_id]').clearValue();

                        this.up('container').down('[itemId=certification_item_id]').store.getProxy().extraParams.category = records[0].data.category;
                        this.up('container').down('[itemId=certification_item_id]').store.reload();
                    }
                }
            }, {
                xtype: 'tq-certificationitemcombo',
                name: 'certification_item_id',
                itemId: 'certification_item_id',
                fieldLabel: Profile.getText('certification_item'),
                anchor: '50%',
                width: 300
            }]
        });

        me.callParent();
    }

});