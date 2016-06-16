Ext.define('Asz.ux.BusinessCombo', {
    extend: 'Asz.ux.RemoteCombo',
    alias: 'widget.businesscombo',
    name: 'business',
    
    width: 160,
    store: Ext.create('Ext.data.Store', {
        fields: [
            'business',
            { name: 'business_unit', convert: function (v, record) {
                return Ext.String.capitalize(record.data.business);
            }
            }
        ],
        data: [{
            business: 'actuation'
        }, {
            business: 'composite'
        }, {
            business: 'machining'
        }, {
            business: 'quality'
        }, {
            business: 'warehouse'
        }, {
            business: 'all'
        }]
    }),
    displayField: 'business_unit',
    valueField: 'business',

    initComponent: function () {

        var me = this;

        Ext.applyIf(me, {
            fieldLabel: Profile.getText('business'),
             labelWidth: Profile.getLang() == 'en' ? 60 : 50
        });
        me.callParent();
    }
})